package com.ephyris.ephyris_engine.DataTransferObject;

import com.ephyris.ephyris_engine.Entity.Workout;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    Long id;
    String name;
    String email;
    String password;
    private String profileImage;
    private String membershipStatus; // Add missing field
    List<Workout> workouts;
    LocalDateTime createdAt;
}
