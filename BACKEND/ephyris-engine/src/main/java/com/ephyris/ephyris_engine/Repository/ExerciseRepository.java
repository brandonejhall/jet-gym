package com.ephyris.ephyris_engine.Repository;

import com.ephyris.ephyris_engine.Entity.Exercise;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

        Exercise getExerciseByName(String Exercise);

        @Query("SELECT e FROM Exercise e " +
                        "JOIN e.workout w " +
                        "WHERE w.user.id = :userId " +
                        "AND LOWER(e.normalizedName) = LOWER(:name)" +
                        "ORDER BY e.id DESC LIMIT 1")
        Optional<Exercise> findByUserIdAndNameIgnoreCase(
                        @Param("userId") Long userId,
                        @Param("name") String name);

        @Query("SELECT DISTINCT e.normalizedName FROM Exercise e WHERE e.workout.user.id = :userId")
        List<String> findDistinctExerciseNamesByUserId(@Param("userId") Long userId);

        @Query("SELECT e FROM Exercise e WHERE e.workout.user.id = :userId AND e.muscleGroup = :muscleGroup")
        List<Exercise> findByUserIdAndMuscleGroup(Long userId, String muscleGroup);

        /*
         * 
         * 
         * @Query(value = "SELECT e.* FROM exercise e " +
         * "JOIN workout w ON e.workout_id = w.id " +
         * "WHERE w.user_id = :userId " +
         * "GROUP BY e.id, e.name " +
         * "ORDER BY COUNT(e.id) DESC " +
         * "FETCH FIRST :limit ROWS ONLY", nativeQuery = true)
         * List<Exercise> findMostFrequentByUserId(@Param("userId") Long
         * userId, @Param("limit") int limit);
         * 
         * 
         * 
         * 
         * 
         */

}
