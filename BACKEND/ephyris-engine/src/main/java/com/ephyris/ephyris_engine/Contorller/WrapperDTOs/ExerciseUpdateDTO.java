package com.ephyris.ephyris_engine.Contorller.WrapperDTOs;

import com.ephyris.ephyris_engine.DataTransferObject.ExerciseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseUpdateDTO {
    Long userId;
    ExerciseDTO exerciseDTO;
}
