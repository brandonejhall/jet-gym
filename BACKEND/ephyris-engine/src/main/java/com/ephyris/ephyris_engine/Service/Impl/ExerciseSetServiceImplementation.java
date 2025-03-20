package com.ephyris.ephyris_engine.Service.Impl;

import com.ephyris.ephyris_engine.Config.ResourceNotFoundException;
import com.ephyris.ephyris_engine.DataTransferObject.ExerciseSetDTO;
import com.ephyris.ephyris_engine.Entity.Exercise;
import com.ephyris.ephyris_engine.Entity.ExerciseSet;
import com.ephyris.ephyris_engine.Mapper.ExerciseSetMapper;
import com.ephyris.ephyris_engine.Repository.ExerciseRepository;
import com.ephyris.ephyris_engine.Repository.ExerciseSetRepository;
import com.ephyris.ephyris_engine.Service.ExerciseSetService;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
public class ExerciseSetServiceImplementation implements ExerciseSetService {

    private final ExerciseSetRepository eSRepo;

    private final ExerciseSetMapper eSMapper;

    private final ExerciseRepository eRepo;

    public ExerciseSetServiceImplementation(ExerciseSetRepository eSRepo, ExerciseSetMapper eSMapper,
            ExerciseRepository eRepo) {
        this.eSRepo = eSRepo;
        this.eSMapper = eSMapper;
        this.eRepo = eRepo;
    }

    // Note for exercise suggest to user that one is already created instead of
    // creating a new one
    @Override
    public ExerciseSetDTO createExerciseSet(ExerciseSetDTO exerciseSetDTO, Long userId) throws AccessDeniedException {

        if (exerciseSetDTO == null || exerciseSetDTO.getExerciseId() == null) {
            throw new IllegalArgumentException("Invalid exercise set data");
        }

        Exercise exercise = eRepo.findById(exerciseSetDTO.getExerciseId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise does not exist"));

        if (!exercise.getWorkout().getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User is not permitted to make changes to this exercise");
        }

        ExerciseSet exSet = eSMapper.toEntity(exerciseSetDTO);
        exSet.setExercise(exercise);

        eSRepo.save(exSet);

        exercise.getSets().add(exSet);
        eRepo.save(exercise);

        return eSMapper.toDTO(exSet);

    }

    @Override
    public ExerciseSetDTO getExerciseSetById(Long exerciseSetId, Long userId) throws AccessDeniedException {
        if (exerciseSetId == null || userId == null) {
            throw new IllegalArgumentException("Invalid exercise set data");
        }

        ExerciseSet exerciseSet = eSRepo.findById(exerciseSetId).orElseThrow(
                () -> new ResourceNotFoundException("Set does not exist"));

        Exercise exercise = eRepo.findById(exerciseSet.getExercise().getId()).orElseThrow(
                () -> new ResourceNotFoundException("Exercise does not exist"));

        if (!exercise.getWorkout().getId().equals(userId)) {
            throw new AccessDeniedException("User does not have access to this Exercise user_id = ");
        }

        return eSMapper.toDTO(exerciseSet);

    }

    @Override
    public List<ExerciseSetDTO> getExerciseSetsByExerciseId(Long exerciseId, Long userId) throws AccessDeniedException {
        if (exerciseId == null || userId == null) {
            throw new IllegalArgumentException("Invalid exercise set data");
        }

        Exercise exercise = eRepo.findById(exerciseId).orElseThrow(
                () -> new ResourceNotFoundException("Exercise does not exist"));

        if (!exercise.getWorkout().getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User does not have access to this Exercise");
        }

        return eSMapper.toDtoList(exercise.getSets());
    }

    @Override
    public ExerciseSetDTO updateExerciseSet(Long userId, ExerciseSetDTO exerciseSetDTO) throws AccessDeniedException {

        if (exerciseSetDTO == null || userId == null) {
            throw new IllegalArgumentException("Invalid exercise set data");
        }

        ExerciseSet exerciseSet = eSRepo.findById(exerciseSetDTO.getExerciseId()).orElseThrow(
                () -> new ResourceNotFoundException("Set does not exist"));

        Exercise exercise = eRepo.findById(exerciseSetDTO.getExerciseId()).orElseThrow(
                () -> new ResourceNotFoundException("Exercise does not exist"));

        if (!exercise.getWorkout().getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User does not have access to this Exercise uid = "
                    + exercise.getWorkout().getUser().getId());
        }

        ExerciseSet updatedExerciseSet = mergeExerciseSet(exerciseSetDTO, exerciseSet);

        updatedExerciseSet.setExercise(exercise);

        return eSMapper.toDTO(eSRepo.save(updatedExerciseSet));

    }

    private ExerciseSet mergeExerciseSet(ExerciseSetDTO exerciseSetDTO, ExerciseSet existingExerciseSet) {
        // Update value if provided
        if (exerciseSetDTO.getValue() != null) {
            existingExerciseSet.setValue(exerciseSetDTO.getValue());
        }

        // Check and update isTimeBased
        if (exerciseSetDTO.getIsTimeBased() != null) {
            existingExerciseSet.setIsTimeBased(exerciseSetDTO.getIsTimeBased());

            // If time-based is set to true, set weight to 0
            if (Boolean.TRUE.equals(exerciseSetDTO.getIsTimeBased())) {
                existingExerciseSet.setWeight(0.0);
            }
        }

        // Update weight only if it's provided and not null
        // And only if the exercise is not time-based
        if (exerciseSetDTO.getWeight() != null &&
                (existingExerciseSet.getIsTimeBased() == null ||
                        !existingExerciseSet.getIsTimeBased())) {
            existingExerciseSet.setWeight(exerciseSetDTO.getWeight());
        }

        return existingExerciseSet;
    }

    @Override
    public void deleteExerciseSet(Long exerciseSetId, Long userId) throws AccessDeniedException {

        ExerciseSet exerciseSet = eSRepo.findById(exerciseSetId).orElseThrow(
                () -> new ResourceNotFoundException("Set does not exist"));

        Exercise exercise = eRepo.findById(exerciseSet.getExercise().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));

        // Verify user owns the exercise through workout
        if (!exercise.getWorkout().getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User not authorized to delete this exercise");
        }

        eSRepo.delete(exerciseSet);
    }

    @Override
    public ExerciseSetDTO updateCompletionStatus(Long setId, Boolean completed, Long userId)
            throws AccessDeniedException {
        if (setId == null || completed == null || userId == null) {
            throw new IllegalArgumentException("Invalid input data");
        }

        ExerciseSet exerciseSet = eSRepo.findById(setId).orElseThrow(
                () -> new ResourceNotFoundException("Set does not exist"));

        Exercise exercise = exerciseSet.getExercise();

        if (!exercise.getWorkout().getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User does not have access to this Exercise");
        }

        exerciseSet.setCompleted(completed);
        return eSMapper.toDTO(eSRepo.save(exerciseSet));
    }

    @Override
    public int getCompletedSetsCount(Long exerciseId, Long userId) throws AccessDeniedException {
        if (exerciseId == null || userId == null) {
            throw new IllegalArgumentException("Invalid input data");
        }

        Exercise exercise = eRepo.findById(exerciseId).orElseThrow(
                () -> new ResourceNotFoundException("Exercise does not exist"));

        if (!exercise.getWorkout().getUser().getId().equals(userId)) {
            throw new AccessDeniedException("User does not have access to this Exercise");
        }

        return (int) exercise.getSets().stream()
                .filter(set -> Boolean.TRUE.equals(set.getCompleted()))
                .count();
    }
}
