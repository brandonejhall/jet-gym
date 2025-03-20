package com.ephyris.ephyris_engine.DataTransferObject;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ExerciseDTO {
    private Long id;
    private Long workoutId; // foreign key reference to Workout
    private String name;
    private String muscleGroup;
    private List<ExerciseSetDTO> sets;
    private String canonicalName; // Maps to canonicalExercise.name
    private String normalizedName; // Add this to match entity
}
