package com.ephyris.ephyris_engine.Contorller.WrapperDTOs;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseSetDeleteDTO {

    private Long userId;
    private Long exerciseSetId;
}
