package com.ephyris.ephyris_engine.Mapper;

import com.ephyris.ephyris_engine.DataTransferObject.ExerciseSetDTO;
import com.ephyris.ephyris_engine.Entity.Exercise;
import com.ephyris.ephyris_engine.Entity.ExerciseSet;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ExerciseSetMapper {

    @Mapping(target = "exercise", source = "exerciseId", qualifiedByName = "exerciseIdToExercise")
    @Mapping(target = "completed", defaultValue = "false")
    @Mapping(target = "isTimeBased", defaultValue = "false")
    ExerciseSet toEntity(ExerciseSetDTO dto);

    @Mapping(target = "exerciseId", source = "exercise.id")
    ExerciseSetDTO toDTO(ExerciseSet entity);

    @Named("exerciseIdToExercise")
    default Exercise exerciseIdToExercise(Long exerciseId) {
        if (exerciseId == null) {
            return null;
        }
        Exercise exercise = new Exercise();
        exercise.setId(exerciseId);
        return exercise;
    }

    List<ExerciseSetDTO> toDtoList(List<ExerciseSet> exerciseSets);

    List<ExerciseSet> toEntityList(List<ExerciseSetDTO> exerciseSets);

}
