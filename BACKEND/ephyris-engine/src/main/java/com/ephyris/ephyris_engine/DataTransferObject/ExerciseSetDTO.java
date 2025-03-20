package com.ephyris.ephyris_engine.DataTransferObject;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseSetDTO {
    private Long id;
    private Long exerciseId;
    private Integer value;
    private Boolean isTimeBased;
    private Double weight;
    private Boolean completed;
}
