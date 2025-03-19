package com.ephyris.ephyris_engine.Contorller.WrapperDTOs;

import com.ephyris.ephyris_engine.DataTransferObject.ExerciseSetDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseSetUpdateDTO {
    Long userId;
    ExerciseSetDTO exerciseSetDTO;
}
