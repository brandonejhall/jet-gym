package com.ephyris.ephyris_engine.Contorller.WrapperDTOs;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginUserDto {
    String email;
    String password;
}
