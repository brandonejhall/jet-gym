package com.ephyris.ephyris_engine.Repository;

import com.ephyris.ephyris_engine.Entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MealRepository extends JpaRepository<Meal,Long> {
}
