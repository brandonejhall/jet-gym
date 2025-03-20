package com.ephyris.ephyris_engine.Mapper;

import com.ephyris.ephyris_engine.DataTransferObject.ExerciseDTO;
import com.ephyris.ephyris_engine.Entity.Exercise;
import com.ephyris.ephyris_engine.Entity.Workout;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {
        ExerciseSetMapper.class }, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ExerciseMapper {

    @Mapping(source = "workoutId", target = "workout.id")
    @Mapping(source = "sets", target = "sets")
    @Mapping(target = "canonicalExercise", ignore = true)
    @Mapping(target = "normalizedName", expression = "java(dto.getName().toLowerCase().replaceAll(\"\\\\s+\", \"\"))")
    Exercise toEntity(ExerciseDTO dto);

    @Mapping(source = "workout.id", target = "workoutId")
    @Mapping(source = "sets", target = "sets")
    @Mapping(source = "canonicalExercise.name", target = "canonicalName")
    ExerciseDTO toDto(Exercise entity);

    @AfterMapping
    default void linkExerciseSets(@MappingTarget Exercise exercise) {
        if (exercise.getSets() != null) {
            exercise.getSets().forEach(set -> set.setExercise(exercise));
        }
    }

    default Workout map(Long workoutId) {
        if (workoutId == null) {
            return null;
        }
        Workout workout = new Workout();
        workout.setId(workoutId);
        return workout;
    }

    List<ExerciseDTO> toDtoList(List<Exercise> exercises);

    List<Exercise> toEntityList(List<ExerciseDTO> exercises);

}
