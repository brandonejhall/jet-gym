package com.ephyris.ephyris_engine.Service.Impl;

import com.ephyris.ephyris_engine.Config.ResourceNotFoundException;
import com.ephyris.ephyris_engine.DataTransferObject.ExerciseDTO;
import com.ephyris.ephyris_engine.DataTransferObject.ExerciseSetDTO;
import com.ephyris.ephyris_engine.DataTransferObject.ExerciseSuggestionDTO;
import com.ephyris.ephyris_engine.Entity.CanonicalExercise;
import com.ephyris.ephyris_engine.Entity.Exercise;
import com.ephyris.ephyris_engine.Entity.ExerciseSet;
import com.ephyris.ephyris_engine.Entity.Workout;
import com.ephyris.ephyris_engine.Mapper.ExerciseSetMapper;
import com.ephyris.ephyris_engine.Repository.CanonicalExerciseRepository;
import com.ephyris.ephyris_engine.Repository.ExerciseRepository;
import com.ephyris.ephyris_engine.Repository.WorkoutRepository;
import com.ephyris.ephyris_engine.Service.ExerciseService;
import com.ephyris.ephyris_engine.Mapper.ExerciseMapper;
import org.springframework.stereotype.Service;
import org.apache.commons.text.similarity.LevenshteinDistance;

import java.nio.file.AccessDeniedException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExerciseServiceImplementation implements ExerciseService {

    private final WorkoutRepository wRepo;
    private final ExerciseRepository eRepo;

    private final ExerciseMapper eMapper;

    private final ExerciseSetMapper esMapper;

    private final CanonicalExerciseRepository canonicalRepo;

    private final ExerciseSetServiceImplementation exerciseSetService;

    private final LevenshteinDistance levenshteinDistance = LevenshteinDistance.getDefaultInstance();

    public ExerciseServiceImplementation(WorkoutRepository wRepo,
            ExerciseRepository eRepo,
            ExerciseMapper eMapper, ExerciseSetMapper esMapper, ExerciseSetServiceImplementation exerciseSetService,
            CanonicalExerciseRepository canonicalRepo) {
        this.wRepo = wRepo;
        this.eRepo = eRepo;
        this.eMapper = eMapper;
        this.esMapper = esMapper;
        this.exerciseSetService = exerciseSetService;
        this.canonicalRepo = canonicalRepo;
    }

    @Override
    public ExerciseDTO createExercise(ExerciseDTO exerciseDTO, Long userId) throws AccessDeniedException {

        // Validate input
        if (exerciseDTO == null || exerciseDTO.getWorkoutId() == null) {
            throw new IllegalArgumentException("Invalid exercise data");
        }

        // Verify workout exists and belongs to user
        Workout workout = wRepo.findById(exerciseDTO.getWorkoutId())
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found"));

        if (!workout.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User is not authorized to add exercises to this workout");
        }

        // Create a deep copy of the sets
        List<ExerciseSetDTO> sets = new ArrayList<>(exerciseDTO.getSets());

        // Clear the sets from the DTO to prevent detached entities
        exerciseDTO.setSets(Collections.emptyList());

        // Map the DTO to entity
        Exercise exercise = eMapper.toEntity(exerciseDTO);

        // Try to find match in user's history first
        Optional<Exercise> historicalMatch = findMatchInUserHistory(exercise.getName(), userId);

        if (historicalMatch.isPresent()) {
            // Suggest the historical match
            exercise.setCanonicalExercise(historicalMatch.get().getCanonicalExercise());
        } else {
            // Try to find a canonical match
            Optional<CanonicalExercise> canonicalMatch = findCanonicalMatch(exercise.getName());
            canonicalMatch.ifPresent(exercise::setCanonicalExercise);
        }

        // Set the workout
        exercise.setWorkout(workout);

        // Save the exercise first
        Exercise savedExercise = eRepo.save(exercise);

        // Handle sets if any
        if (!sets.isEmpty()) {
            for (ExerciseSetDTO setDTO : sets) {
                setDTO.setExerciseId(savedExercise.getId());
                ExerciseSetDTO savedSetDTO = exerciseSetService.createExerciseSet(setDTO, userId);
                ExerciseSet savedSet = esMapper.toEntity(savedSetDTO);
                savedSet.setExercise(savedExercise);
                savedExercise.getSets().add(savedSet);
            }
            // Save the exercise again to update the sets
            savedExercise = eRepo.save(savedExercise);
        }

        return eMapper.toDto(savedExercise);
    }

    @Override
    public ExerciseDTO getExerciseById(Long exerciseId, Long userId) throws AccessDeniedException {
        Exercise exercise = eRepo.findById(exerciseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        // Verify user owns this exercise
        if (!exercise.getWorkout().getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User not authorized to access this exercise");
        }

        return eMapper.toDto(exercise);
    }

    @Override
    public List<ExerciseDTO> getExercisesByWorkoutId(Long workoutId, Long userId) {

        Optional<Workout> workout = wRepo.findById(workoutId);

        if (workout.isPresent() &&
                workout.get().getUser()
                        .getId().equals(userId)) {

            return eMapper.toDtoList(workout.get().getExercises());
        }

        throw new ResourceNotFoundException("Exercise not found. " +
                "Please check the provided details and try again.");
    }

    // get exercise by name?

    @Override
    public ExerciseDTO updateExercise(Long userId, ExerciseDTO exerciseDTO) throws AccessDeniedException {
        // Verify exercise exists
        Exercise existingExercise = eRepo.findById(exerciseDTO.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        // Verify workout exists
        Workout workout = wRepo.findById(exerciseDTO.getWorkoutId())
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found"));

        // Verify user owns the workout
        if (!workout.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User not authorized to update this exercise");
        }

        // Verify exercise belongs to the specified workout
        if (!existingExercise.getWorkout().getId().equals(exerciseDTO.getWorkoutId())) {
            throw new IllegalArgumentException("Exercise does not belong to the specified workout");
        }

        Exercise updatedExercise = mergeExercise(exerciseDTO, existingExercise, userId);

        return eMapper.toDto(eRepo.save(updatedExercise));

    }

    @Override
    public void deleteExercise(Long exerciseId, Long userId) throws AccessDeniedException {
        Exercise exercise = eRepo.findById(exerciseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        // Verify user owns the exercise through workout
        if (!exercise.getWorkout().getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User not authorized to delete this exercise");
        }

        eRepo.delete(exercise);

    }

    @Override
    public List<ExerciseSuggestionDTO> getSuggestions(String input, Long userId) {
        if (input == null || input.length() < 2) {
            return Collections.emptyList();
        }

        List<ExerciseSuggestionDTO> suggestions = new ArrayList<>();
        String normalizedInput = input.toLowerCase().replaceAll("\\s+", "");

        // Get user history matches
        Optional<Exercise> historicalMatch = findMatchInUserHistory(input, userId);
        historicalMatch.ifPresent(exercise -> suggestions.add(new ExerciseSuggestionDTO(
                exercise.getName(),
                exercise.getCanonicalExercise() != null ? exercise.getCanonicalExercise().getName() : null,
                true)));

        // Get canonical matches
        List<CanonicalExercise> canonicalMatches = canonicalRepo
                .findByNameOrVariationOrAliasContainingIgnoreCase(normalizedInput);
        for (CanonicalExercise canonical : canonicalMatches) {
            if (suggestions.stream().noneMatch(s -> s.getCanonicalName() != null &&
                    s.getCanonicalName().equals(canonical.getName()))) {
                suggestions.add(new ExerciseSuggestionDTO(
                        canonical.getName(),
                        canonical.getName(),
                        false));
            }
        }

        return suggestions;
    }

    private Exercise mergeExercise(ExerciseDTO exerciseDTO, Exercise exercise, Long userId)
            throws AccessDeniedException {
        // Check if name is being updated
        if (exerciseDTO.getName() != null && !exerciseDTO.getName().equals(exercise.getName())) {
            // Set the new name
            exercise.setName(exerciseDTO.getName());

            // Try to find match in user's history first
            Optional<Exercise> historicalMatch = findMatchInUserHistory(exerciseDTO.getName(), userId);

            if (historicalMatch.isPresent()) {
                // Update canonical exercise based on historical match
                exercise.setCanonicalExercise(historicalMatch.get().getCanonicalExercise());
            } else {
                // Try to find a canonical match
                Optional<CanonicalExercise> canonicalMatch = findCanonicalMatch(exerciseDTO.getName());
                exercise.setCanonicalExercise(canonicalMatch.orElse(null)); // Set or clear canonical reference
            }
        }

        if (exerciseDTO.getSets() != null && !exerciseDTO.getSets().isEmpty()) {
            // First, identify sets to delete (those in the exercise but not in the DTO)
            List<ExerciseSet> existingSets = new ArrayList<>(exercise.getSets());
            List<ExerciseSetDTO> newSets = exerciseDTO.getSets();

            // Find sets to delete
            List<ExerciseSet> setsToDelete = existingSets.stream()
                    .filter(existing -> newSets.stream()
                            .noneMatch(newSet -> newSet.getId() != null && newSet.getId().equals(existing.getId())))
                    .collect(Collectors.toList());

            // Delete sets that are no longer in the DTO
            for (ExerciseSet setToDelete : setsToDelete) {
                exercise.getSets().remove(setToDelete);
                exerciseSetService.deleteExerciseSet(setToDelete.getId(), userId);
            }

            // Handle remaining sets (create or update)
            for (ExerciseSetDTO setDTO : newSets) {
                // Modify the DTO to include the exercise ID
                setDTO.setExerciseId(exercise.getId());

                if (setDTO.getId() == null) {
                    // This is a new set - create it
                    ExerciseSetDTO savedSetDTO = exerciseSetService.createExerciseSet(setDTO, userId);
                    ExerciseSet savedSet = esMapper.toEntity(savedSetDTO);
                    savedSet.setExercise(exercise);
                    exercise.getSets().add(savedSet);
                } else {
                    // Check if the set has actually changed
                    ExerciseSet existingSet = exercise.getSets().stream()
                            .filter(set -> set.getId().equals(setDTO.getId()))
                            .findFirst()
                            .orElse(null);

                    if (existingSet != null) {
                        boolean hasChanged = !Objects.equals(existingSet.getValue(), setDTO.getValue()) ||
                                !Objects.equals(existingSet.getWeight(), setDTO.getWeight()) ||
                                !Objects.equals(existingSet.getIsTimeBased(), setDTO.getIsTimeBased()) ||
                                !Objects.equals(existingSet.getCompleted(), setDTO.getCompleted());

                        if (hasChanged) {
                            // This is an existing set that has changed - update it
                            ExerciseSetDTO updatedSetDTO = exerciseSetService.updateExerciseSet(userId, setDTO);
                            ExerciseSet updatedSet = esMapper.toEntity(updatedSetDTO);
                            updatedSet.setExercise(exercise);

                            // Find and replace the existing set in the exercise's set list
                            exercise.getSets().removeIf(set -> set.getId().equals(updatedSet.getId()));
                            exercise.getSets().add(updatedSet);
                        }
                    }
                }
            }

            // Save the exercise after all sets have been processed
            exercise = eRepo.save(exercise);
        }

        return exercise;
    }

    private Optional<CanonicalExercise> findCanonicalMatch(String exerciseName) {
        String normalizedInput = exerciseName.toLowerCase().replaceAll("\\s+", "");

        // First try exact match
        Optional<CanonicalExercise> exactMatch = canonicalRepo.findByNameIgnoreCase(normalizedInput);
        if (exactMatch.isPresent()) {
            return exactMatch;
        }

        // If no exact match, try searching variations and aliases
        List<CanonicalExercise> matches = canonicalRepo
                .findByNameOrVariationOrAliasContainingIgnoreCase(normalizedInput);
        return matches.isEmpty() ? Optional.empty() : Optional.of(matches.get(0));
    }

    private Optional<Exercise> findMatchInUserHistory(String exerciseName, Long userId) {
        // Normalize input
        String normalizedInput = exerciseName.toLowerCase().replaceAll("\\s+", "");

        // Determine appropriate fuzzy matching threshold
        int maxDistance = determineLevenshteinThreshold(normalizedInput.length());

        // Skip fuzzy matching for very short inputs
        if (normalizedInput.length() <= 2) {
            return eRepo.findByUserIdAndNameIgnoreCase(userId, normalizedInput);
        }

        // Get all normalized exercise names for the user
        List<String> userExerciseNames = eRepo.findDistinctExerciseNamesByUserId(userId);

        // First try exact match on normalized name
        Optional<String> exactMatch = userExerciseNames.stream()
                .filter(name -> name.equals(normalizedInput))
                .findFirst();

        if (exactMatch.isPresent()) {
            return eRepo.findByUserIdAndNameIgnoreCase(userId, exactMatch.get());
        }

        // Fuzzy matching with dynamic threshold
        Optional<String> fuzzyMatch = userExerciseNames.stream()
                .map(name -> {
                    int distance = levenshteinDistance.apply(normalizedInput, name);
                    double similarityPercentage = 1.0
                            - (distance / (double) Math.max(normalizedInput.length(), name.length()));
                    return new AbstractMap.SimpleEntry<>(name,
                            new AbstractMap.SimpleEntry<>(distance, similarityPercentage));
                })
                .filter(entry -> entry.getValue().getKey() <= maxDistance &&
                        entry.getValue().getValue() >= 0.75)
                .max(Comparator.comparingDouble(entry -> entry.getValue().getValue()))
                .map(Map.Entry::getKey);

        if (fuzzyMatch.isPresent()) {
            return eRepo.findByUserIdAndNameIgnoreCase(userId, fuzzyMatch.get());
        }

        return Optional.empty();
    }

    private int determineLevenshteinThreshold(int inputLength) {
        if (inputLength <= 4)
            return 1;
        if (inputLength <= 7)
            return 2;
        return 3;
    }

    @Override
    public List<ExerciseDTO> getExercisesByMuscleGroup(String muscleGroup, Long userId) throws AccessDeniedException {
        if (muscleGroup == null || userId == null) {
            throw new IllegalArgumentException("Invalid input parameters");
        }

        // Get all exercises for the user and filter by muscle group
        List<Exercise> exercises = eRepo.findByUserIdAndMuscleGroup(userId, muscleGroup);

        // Verify user has access to all exercises
        for (Exercise exercise : exercises) {
            if (!exercise.getWorkout().getUser().getId().equals(userId)) {
                throw new AccessDeniedException("User is not authorized to access one or more exercises");
            }
        }

        return eMapper.toDtoList(exercises);
    }

    @Override
    public List<ExerciseDTO> getMostFrequentExercises(Long userId, int limit) throws AccessDeniedException {

        List<ExerciseDTO> exerciseDTOs = new ArrayList<>();
        return exerciseDTOs;
        /*
         * if (userId == null || limit <= 0) {
         * throw new IllegalArgumentException("Invalid input parameters");
         * }
         * 
         * // Get exercises sorted by frequency of use
         * List<Exercise> frequentExercises = eRepo.findMostFrequentByUserId(userId,
         * limit);
         * 
         * // Verify user has access to all exercises
         * for (Exercise exercise : frequentExercises) {
         * if (!exercise.getWorkout().getUser().getId().equals(userId)) {
         * throw new
         * AccessDeniedException("User is not authorized to access one or more exercises"
         * );
         * }
         * }
         * 
         * return eMapper.toDtoList(frequentExercises);
         */
    }

}
