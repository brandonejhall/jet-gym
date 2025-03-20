package com.ephyris.ephyris_engine.Contorller.WrapperDTOs;


import com.ephyris.ephyris_engine.DataTransferObject.WorkoutDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutUpdateDTO {

    private Long workoutId;
    private Long userId;
    private WorkoutDTO workoutDTO;
}
