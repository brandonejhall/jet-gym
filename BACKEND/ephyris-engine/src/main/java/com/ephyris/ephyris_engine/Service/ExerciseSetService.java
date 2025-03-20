package com.ephyris.ephyris_engine.Service;

import com.ephyris.ephyris_engine.DataTransferObject.ExerciseSetDTO;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface ExerciseSetService {
    ExerciseSetDTO createExerciseSet(ExerciseSetDTO exerciseSetDTO, Long userId) throws AccessDeniedException;

    ExerciseSetDTO getExerciseSetById(Long exerciseSetId, Long userId) throws AccessDeniedException;

    List<ExerciseSetDTO> getExerciseSetsByExerciseId(Long exerciseId, Long userId) throws AccessDeniedException;

    ExerciseSetDTO updateExerciseSet(Long userId, ExerciseSetDTO exerciseSetDTO) throws AccessDeniedException;

    void deleteExerciseSet(Long exerciseSetId, Long userId) throws AccessDeniedException;

    // Add method to update completion status
    ExerciseSetDTO updateCompletionStatus(Long setId, Boolean completed, Long userId) throws AccessDeniedException;

    // Add method to get completed sets count for an exercise
    int getCompletedSetsCount(Long exerciseId, Long userId) throws AccessDeniedException;
}
