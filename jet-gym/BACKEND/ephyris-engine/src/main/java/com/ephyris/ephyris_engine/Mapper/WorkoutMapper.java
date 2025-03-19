package com.ephyris.ephyris_engine.Mapper;

import com.ephyris.ephyris_engine.DataTransferObject.WorkoutDTO;
import com.ephyris.ephyris_engine.Entity.User;
import com.ephyris.ephyris_engine.Entity.Workout;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {
        ExerciseMapper.class }, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface WorkoutMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "exercises", target = "exercises")
    @Mapping(target = "duration", expression = "java(calculateDuration(workout))")
    @Mapping(target = "completed", defaultValue = "false")
    WorkoutDTO toDTO(Workout workout);

    default Integer calculateDuration(Workout workout) {
        if (workout.getStartTime() != null && workout.getEndTime() != null) {
            return (int) java.time.Duration.between(workout.getStartTime(), workout.getEndTime()).toMinutes();
        }
        return null;
    }

    @AfterMapping
    default void linkSetsDTO(@MappingTarget WorkoutDTO workout) {
        if (workout.getExercises() != null) {
            workout.getExercises().forEach(exercise -> {
                exercise.getSets().forEach(exerciseSet -> exerciseSet.setExerciseId(exercise.getId()));
            });
        }
    }

    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "exercises", target = "exercises")
    @Mapping(target = "startTime", defaultExpression = "java(java.time.LocalDateTime.now())")
    Workout toEntity(WorkoutDTO workoutDTO);

    @AfterMapping
    default void linkExercises(@MappingTarget Workout workout) {
        if (workout.getExercises() != null) {
            workout.getExercises().forEach(exercise -> {
                exercise.setWorkout(workout);
                exercise.getSets().forEach(exerciseSet -> exerciseSet.setExercise(exercise));
            });
        }
    }

    // Helper method to map userId to User entity
    default User map(Long userId) {
        if (userId == null) {
            return null;
        }
        User user = new User();
        user.setId(userId);
        return user;
    }

    // Collection mapping methods
    List<WorkoutDTO> toDTOList(List<Workout> workouts);

    List<Workout> toEntityList(List<WorkoutDTO> workoutDTOs);
}
