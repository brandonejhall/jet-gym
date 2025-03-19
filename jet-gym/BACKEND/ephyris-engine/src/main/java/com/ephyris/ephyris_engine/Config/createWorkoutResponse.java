package com.ephyris.ephyris_engine.Config;

import com.ephyris.ephyris_engine.DataTransferObject.WorkoutDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class createWorkoutResponse {
    private WorkoutDTO newWorkout;
}
