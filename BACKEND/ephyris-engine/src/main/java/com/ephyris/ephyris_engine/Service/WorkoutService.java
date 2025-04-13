package com.ephyris.ephyris_engine.Service;

import com.ephyris.ephyris_engine.DataTransferObject.WorkoutDTO;

import java.nio.file.AccessDeniedException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface WorkoutService {

        WorkoutDTO createWorkout(WorkoutDTO workoutDTO, Long userId) throws AccessDeniedException;

        WorkoutDTO getWorkoutById(Long workoutId, Long userId) throws AccessDeniedException;

        List<WorkoutDTO> getWorkoutsByUserId(Long userId) throws AccessDeniedException;

        List<WorkoutDTO> getWorkoutsByDateRange(Long userId, LocalDate startDate, LocalDate endDate)
                        throws AccessDeniedException;

        WorkoutDTO updateWorkout(Long id, Long userId, WorkoutDTO workoutDTO) throws AccessDeniedException;

        // Start a workout - records the start time
        WorkoutDTO startWorkout(Long workoutId, Long userId) throws AccessDeniedException;

        // Complete a workout - records the end time and marks as completed
        WorkoutDTO completeWorkout(Long workoutId, Long userId) throws AccessDeniedException;

        // Update workout duration
        WorkoutDTO updateDuration(Long workoutId, Long userId, Integer duration) throws AccessDeniedException;

        // Update workout notes
        WorkoutDTO updateWorkoutNotes(Long workoutId, Long userId, String notes) throws AccessDeniedException;

        List<WorkoutDTO> getWorkoutsByPeriod(Long userId, String period) throws AccessDeniedException;

        void deleteWorkout(Long workoutId, Long userId) throws AccessDeniedException;

        // Get workout statistics
        Map<String, Object> getWorkoutStatistics(Long userId, LocalDate startDate, LocalDate endDate)
                        throws AccessDeniedException;
}
