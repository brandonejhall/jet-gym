package com.ephyris.ephyris_engine.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "exercise_sets")
@Getter
@Setter
public class ExerciseSet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ToString.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    // For normal sets: number of reps
    // For time-based sets: duration in seconds
    @Column(name = "rep_value", nullable = false)
    private Integer value;

    // Indicates if this is a time-based set
    @Column(nullable = false)
    private Boolean isTimeBased = false;

    @Column(nullable = false)
    private Boolean completed = false;

    // Weight (optional for bodyweight exercises)
    private Double weight = null;

}
