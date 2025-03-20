package com.ephyris.ephyris_engine.DataTransferObject;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutDTO {
    private Long id;
    private Long userId; // foreign key reference to User
    private String name;
    private String notes;
    private Integer duration;
    private LocalDate date;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean completed;
    private List<ExerciseDTO> exercises; // List of associated exercises
}