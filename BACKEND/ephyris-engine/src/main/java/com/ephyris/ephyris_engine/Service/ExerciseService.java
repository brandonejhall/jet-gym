package com.ephyris.ephyris_engine.Service;

import com.ephyris.ephyris_engine.DataTransferObject.ExerciseDTO;
import com.ephyris.ephyris_engine.DataTransferObject.ExerciseSuggestionDTO;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface ExerciseService {

    ExerciseDTO createExercise(ExerciseDTO exerciseDTO, Long userId) throws AccessDeniedException;

    ExerciseDTO getExerciseById(Long exerciseId, Long userId) throws AccessDeniedException;

    List<ExerciseDTO> getExercisesByWorkoutId(Long workoutId, Long userId);

    List<ExerciseDTO> getExercisesByMuscleGroup(String muscleGroup, Long userId) throws AccessDeniedException;

    ExerciseDTO updateExercise(Long userId, ExerciseDTO exerciseDTO) throws AccessDeniedException;

    void deleteExercise(Long exerciseId, Long userId) throws AccessDeniedException;

    List<ExerciseSuggestionDTO> getSuggestions(String input, Long userId);

    List<ExerciseDTO> getMostFrequentExercises(Long userId, int limit) throws AccessDeniedException;

}