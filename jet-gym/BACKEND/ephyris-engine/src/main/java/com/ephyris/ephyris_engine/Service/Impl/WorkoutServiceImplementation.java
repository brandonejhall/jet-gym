package com.ephyris.ephyris_engine.Service.Impl;

import com.ephyris.ephyris_engine.Config.ResourceNotFoundException;
import com.ephyris.ephyris_engine.DataTransferObject.ExerciseDTO;
import com.ephyris.ephyris_engine.DataTransferObject.UserDTO;
import com.ephyris.ephyris_engine.DataTransferObject.WorkoutDTO;
import com.ephyris.ephyris_engine.Entity.Workout;
import com.ephyris.ephyris_engine.Repository.WorkoutRepository;
import com.ephyris.ephyris_engine.Service.WorkoutService;
import com.ephyris.ephyris_engine.Mapper.WorkoutMapper;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.OptionalDouble;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Locale;
import java.time.format.TextStyle;

@Service
public class WorkoutServiceImplementation implements WorkoutService {

    private final WorkoutRepository wRepo;
    private final UserServiceImplementation userService;

    private final ExerciseServiceImplementation exerciseService;

    private final WorkoutMapper wMapper;

    public WorkoutServiceImplementation(WorkoutRepository wRepo,
            UserServiceImplementation userService,
            ExerciseServiceImplementation exerciseService,
            WorkoutMapper wMapper) {
        this.wRepo = wRepo;
        this.userService = userService;
        this.exerciseService = exerciseService;
        this.wMapper = wMapper;
    }

    @Override
    public WorkoutDTO createWorkout(WorkoutDTO workoutDTO, Long userId) throws AccessDeniedException {
        // Validate input
        if (workoutDTO == null || userId == null) {
            throw new IllegalArgumentException("Invalid workout data");
        }

        // check if user exists
        UserDTO user = userService.getUserById(userId);
        user.getId();

        if (userService.getUserById(userId) == null) {
            throw new IllegalArgumentException("User does not exist");
        }

        List<ExerciseDTO> exercises = new ArrayList<>(workoutDTO.getExercises());

        workoutDTO.setExercises(Collections.<ExerciseDTO>emptyList());

        Workout workout = wMapper.toEntity(workoutDTO);
        Workout savedWorkout = wRepo.save(workout);

        ArrayList<ExerciseDTO> newExercises = new ArrayList<ExerciseDTO>();
        if (!exercises.isEmpty()) {
            for (ExerciseDTO ex : exercises) {

                ex.setWorkoutId(savedWorkout.getId());
                ExerciseDTO newExercise = exerciseService.createExercise(ex, userId);
                newExercises.add(newExercise);
            }

        }

        WorkoutDTO savedDTO = wMapper.toDTO(savedWorkout);

        savedDTO.getExercises().addAll(newExercises);

        return savedDTO;

    }

    @Override
    public List<WorkoutDTO> getWorkoutsByUserId(Long userId) throws AccessDeniedException {
        if (userId == null) {
            throw new IllegalArgumentException("Invalid workout data");
        }

        List<Workout> workouts = wRepo.findByUserId(userId);

        for (Workout workout : workouts) {
            if (!workout.getUser().getId().equals(userId)) {
                throw new AccessDeniedException("User is not allowed to access one or more requested Workouts");

            }

        }

        return wMapper.toDTOList(workouts);

    }

    @Override
    public WorkoutDTO updateWorkout(Long workoutId, Long userId, WorkoutDTO workoutDTO) throws AccessDeniedException {
        // Verify input data
        if (workoutDTO == null || userId == null || workoutId == null) {
            throw new IllegalArgumentException("Invalid workout data");
        }

        // Verify workout exists
        Workout workout = wRepo.findById(workoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout does not exist"));

        // Verify user owns workout
        if (!workout.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User is not allowed requested Workouts");

        }

        Workout updatedWorkout = mergeWorkout(workoutDTO, workout, userId);

        return wMapper.toDTO(wRepo.save(updatedWorkout));

    }

    private Workout mergeWorkout(WorkoutDTO workoutDTO, Workout workout,
            Long userId) throws AccessDeniedException {
        // Update workout name if provided
        if (workoutDTO.getName() != null) {
            workout.setName(workoutDTO.getName());
        }

        // Update date if provided

        // Handle exercises if provided
        if (workoutDTO.getExercises() != null && !workoutDTO.getExercises().isEmpty()) {
            for (ExerciseDTO exerciseDTO : workoutDTO.getExercises()) {
                // Modify the DTO to include the workout ID
                exerciseDTO.setWorkoutId(workout.getId());

                // Use the ExerciseService to create or update the exercise
                // If exercise has an ID, it might be an update; otherwise, it's a new exercise

                if (exerciseDTO.getId() == null) {
                    @SuppressWarnings("unused")
                    ExerciseDTO savedExerciseDTO = new ExerciseDTO();
                    // Create new exercise
                    savedExerciseDTO = exerciseService.createExercise(exerciseDTO, userId);
                } else {
                    @SuppressWarnings("unused")
                    ExerciseDTO updateExerciseDTO = new ExerciseDTO();
                    // Update existing exercise
                    updateExerciseDTO = exerciseService.updateExercise(userId, exerciseDTO);
                }
            }
        }

        return workout;
    }

    @Override
    public void deleteWorkout(Long workoutId, Long userId) throws AccessDeniedException {
        // check if workout exists
        Workout workout = wRepo.findById(workoutId)
                .orElseThrow(() -> new ResourceNotFoundException("workout does not exist"));

        @SuppressWarnings("unused")
        // check if user exists
        UserDTO user = userService.getUserById(userId);

        // check if user owns workout

        if (!workout.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("user does not own this workout");
        }

        wRepo.delete(workout);
    }

    @Override
    public WorkoutDTO startWorkout(Long workoutId, Long userId) throws AccessDeniedException {
        if (workoutId == null || userId == null) {
            throw new IllegalArgumentException("Invalid input data");
        }

        Workout workout = wRepo.findById(workoutId).orElseThrow(
                () -> new ResourceNotFoundException("Workout not found"));

        if (!workout.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User is not allowed to access this workout");
        }

        // Set the start time to now
        workout.setStartTime(LocalDateTime.now());
        workout.setCompleted(false);

        return wMapper.toDTO(wRepo.save(workout));
    }

    @Override
    public WorkoutDTO completeWorkout(Long workoutId, Long userId) throws AccessDeniedException {
        if (workoutId == null || userId == null) {
            throw new IllegalArgumentException("Invalid input data");
        }

        Workout workout = wRepo.findById(workoutId).orElseThrow(
                () -> new ResourceNotFoundException("Workout not found"));

        if (!workout.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User is not allowed to access this workout");
        }

        // Set the end time to now
        LocalDateTime endTime = LocalDateTime.now();
        workout.setEndTime(endTime);
        workout.setCompleted(true);

        // Calculate duration in minutes if we have a start time and no manual duration
        // was set
        if (workout.getStartTime() != null && workout.getDuration() == null) {
            long durationMinutes = java.time.Duration.between(workout.getStartTime(), endTime).toMinutes();
            workout.setDuration(Long.toString(durationMinutes));
        }

        return wMapper.toDTO(wRepo.save(workout));
    }

    @Override
    public WorkoutDTO getWorkoutById(Long workoutId, Long userId) throws AccessDeniedException {
        if (workoutId == null || userId == null) {
            throw new IllegalArgumentException("Invalid input data");
        }

        Workout workout = wRepo.findById(workoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found"));

        if (!workout.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User is not allowed to access this workout");
        }

        return wMapper.toDTO(workout);
    }

    @Override
    public List<WorkoutDTO> getWorkoutsByDateRange(Long userId, LocalDate startDate, LocalDate endDate)
            throws AccessDeniedException {
        if (userId == null || startDate == null || endDate == null) {
            throw new IllegalArgumentException("Invalid input data");
        }

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Start date cannot be after end date");
        }

        // Check if user exists
        userService.getUserById(userId);

        List<Workout> workouts = wRepo.findByUserIdAndDateBetween(userId, startDate, endDate);

        // Verify user has access to all workouts
        for (Workout workout : workouts) {
            if (!workout.getUser().getId().equals(userId)) {
                throw new AccessDeniedException("User is not allowed to access one or more requested Workouts");
            }
        }

        return wMapper.toDTOList(workouts);
    }

    @Override
    public WorkoutDTO updateDuration(Long workoutId, Long userId, Integer duration) throws AccessDeniedException {
        if (workoutId == null || userId == null || duration == null) {
            throw new IllegalArgumentException("Invalid input data");
        }

        if (duration <= 0) {
            throw new IllegalArgumentException("Duration must be positive");
        }

        Workout workout = wRepo.findById(workoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found"));

        if (!workout.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User is not allowed to modify this workout");
        }

        workout.setDuration(duration.toString());
        return wMapper.toDTO(wRepo.save(workout));
    }

    @Override
    public WorkoutDTO updateWorkoutNotes(Long workoutId, Long userId, String notes) throws AccessDeniedException {
        if (workoutId == null || userId == null) {
            throw new IllegalArgumentException("Invalid input data");
        }

        Workout workout = wRepo.findById(workoutId)
                .orElseThrow(() -> new ResourceNotFoundException("Workout not found"));

        if (!workout.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User is not allowed to modify this workout");
        }

        workout.setNotes(notes);
        return wMapper.toDTO(wRepo.save(workout));
    }

    @Override
    public Map<String, Object> getWorkoutStatistics(Long userId, LocalDate startDate, LocalDate endDate)
            throws AccessDeniedException {
        if (userId == null) {
            throw new IllegalArgumentException("Invalid user ID");
        }

        // Default to last 30 days if dates not provided
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(30);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        // Check if user exists
        userService.getUserById(userId);

        List<Workout> workouts = wRepo.findByUserIdAndDateBetween(userId, startDate, endDate);

        // Filter to only include completed workouts
        List<Workout> completedWorkouts = workouts.stream()
                .filter(w -> Boolean.TRUE.equals(w.getCompleted()))
                .collect(Collectors.toList());

        Map<String, Object> statistics = new HashMap<>();

        // Total number of completed workouts
        statistics.put("totalWorkouts", completedWorkouts.size());

        // Average workout duration
        OptionalDouble avgDuration = completedWorkouts.stream()
                .filter(w -> w.getDuration() != null)
                .mapToInt(w -> {
                    try {
                        return Integer.parseInt(w.getDuration());
                    } catch (NumberFormatException e) {
                        return 0;
                    }
                })
                .average();

        statistics.put("averageDuration", avgDuration.orElse(0));

        // Total workout time
        int totalTime = completedWorkouts.stream()
                .filter(w -> w.getDuration() != null)
                .mapToInt(w -> {
                    try {
                        return Integer.parseInt(w.getDuration());
                    } catch (NumberFormatException e) {
                        return 0;
                    }
                })
                .sum();

        statistics.put("totalWorkoutTime", totalTime);

        // Workouts per week
        long daysInRange = java.time.temporal.ChronoUnit.DAYS.between(startDate, endDate.plusDays(1));
        double weeksInRange = Math.max(1.0, daysInRange / 7.0);
        double workoutsPerWeek = completedWorkouts.size() / weeksInRange;

        statistics.put("workoutsPerWeek", workoutsPerWeek);

        Map<String, Long> workoutsByDayOfWeek = completedWorkouts.stream()
                .collect(Collectors.groupingBy(
                        w -> w.getDate().getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH),
                        Collectors.counting()));

        if (!workoutsByDayOfWeek.isEmpty()) {
            String mostCommonDay = workoutsByDayOfWeek.entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(Map.Entry::getKey)
                    .orElse("N/A");

            statistics.put("mostCommonDay", mostCommonDay);
        }

        return statistics;
    }
}