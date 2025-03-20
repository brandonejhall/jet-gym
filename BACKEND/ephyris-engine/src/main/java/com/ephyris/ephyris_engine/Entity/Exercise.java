package com.ephyris.ephyris_engine.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "exercises")
@Getter
@Setter
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    // Optional reference to canonical exercise
    @ManyToOne(fetch = FetchType.LAZY)
    private CanonicalExercise canonicalExercise;

    @ManyToOne
    @JoinColumn(name = "workout_id", nullable = false)
    private Workout workout;

    @OneToMany(mappedBy = "exercise", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ExerciseSet> sets = new ArrayList<>();

    @Column(nullable = true)
    private String muscleGroup;
    // For fuzzy matching against user history
    @Column
    private String normalizedName;

    @PrePersist
    @PreUpdate
    private void prepareNormalizedName() {
        this.normalizedName = name.toLowerCase().replaceAll("\\s+", "");
    }
}
