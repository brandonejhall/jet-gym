package com.ephyris.ephyris_engine.Entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "canonical_exercises")
@Getter
@Setter
public class CanonicalExercise {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(nullable = false, unique = true)
        private String name;

        @ElementCollection
        @CollectionTable(name = "exercise_variations", // Table name for variations
                        joinColumns = @JoinColumn(name = "exercise_id") // Foreign key column
        )
        @Column(name = "variation") // Column name for each entry
        private Set<String> variations = new HashSet<>();

        @ElementCollection
        @CollectionTable(name = "exercise_aliases", // Table name for aliases
                        joinColumns = @JoinColumn(name = "exercise_id") // Foreign key column
        )
        @Column(name = "alias") // Column name for each entry
        private Set<String> aliases = new HashSet<>();

}