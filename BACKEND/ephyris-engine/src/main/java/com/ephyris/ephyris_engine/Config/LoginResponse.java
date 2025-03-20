package com.ephyris.ephyris_engine.Config;

import com.ephyris.ephyris_engine.DataTransferObject.WorkoutDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.ephyris.ephyris_engine.DataTransferObject.UserDTO;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {

    private String token;

    private long expiresIn;

    private UserDTO userData;

    private List<WorkoutDTO> workouts;

}
