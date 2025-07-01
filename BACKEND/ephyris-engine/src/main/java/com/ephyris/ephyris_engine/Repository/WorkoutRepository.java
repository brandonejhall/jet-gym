package com.ephyris.ephyris_engine.Repository;

import com.ephyris.ephyris_engine.Entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUserId(Long userId);

    List<Workout> findByUserIdOrderByDateDesc(Long userId);

    boolean findByNameAndUserId(String exerciseName, Long userId);

    List<Workout> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    List<Workout> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate startDate, LocalDate endDate);

}
