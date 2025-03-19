package com.ephyris.ephyris_engine.Repository;

import com.ephyris.ephyris_engine.Entity.CanonicalExercise;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CanonicalExerciseRepository extends JpaRepository<CanonicalExercise, Long> {

    @Query("SELECT c FROM CanonicalExercise c " +
            "WHERE LOWER(REPLACE(c.name, ' ', '')) = LOWER(REPLACE(:name, ' ', ''))")
    Optional<CanonicalExercise> findByNameIgnoreCase(@Param("name") String name);

    @Query("SELECT c FROM CanonicalExercise c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<CanonicalExercise> findByNameContainingIgnoreCase(@Param("query") String query);

    @Query("SELECT c FROM CanonicalExercise c " +
            "WHERE LOWER(REPLACE(c.name, ' ', '')) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR EXISTS (SELECT 1 FROM c.aliases a WHERE LOWER(REPLACE(a, ' ', '')) LIKE LOWER(CONCAT('%', :query, '%'))) " +
            "OR EXISTS (SELECT 1 FROM c.variations v WHERE LOWER(REPLACE(v, ' ', '')) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<CanonicalExercise> findByNameOrVariationOrAliasContainingIgnoreCase(@Param("query") String query);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM CanonicalExercise c " +
            "LEFT JOIN c.variations v " +
            "LEFT JOIN c.aliases a " +
            "WHERE LOWER(c.name) = LOWER(:name) " +
            "OR LOWER(v) = LOWER(:name) " +
            "OR LOWER(a) = LOWER(:name)")
    boolean existsByNameOrVariationOrAliasIgnoreCase(@Param("name") String name);

}
