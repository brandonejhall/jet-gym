package com.ephyris.ephyris_engine.Contorller.WrapperDTOs;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseDeleteDTO {

    private Long userId;
    private Long exerciseId;
}
