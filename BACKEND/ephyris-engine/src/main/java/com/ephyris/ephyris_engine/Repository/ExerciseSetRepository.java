package com.ephyris.ephyris_engine.Repository;

import com.ephyris.ephyris_engine.Entity.ExerciseSet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExerciseSetRepository extends JpaRepository<ExerciseSet,Long> {

    Optional<ExerciseSet> findById(Long aLong);
}
