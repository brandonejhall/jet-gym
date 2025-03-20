package com.ephyris.ephyris_engine.Service;

import com.ephyris.ephyris_engine.Contorller.WrapperDTOs.LoginUserDto;
import com.ephyris.ephyris_engine.DataTransferObject.UserDTO;
import com.ephyris.ephyris_engine.Entity.User;


import java.util.List;
import java.util.Optional;

public interface UserService {
    void createUser(UserDTO user);
    UserDTO getUserById(Long userId);

    Optional<UserDTO> getUserByEmail(String userEmail);
    List<UserDTO> getAllUsers();
    void deleteUser(Long userId);

    User login(LoginUserDto user);

    boolean userExists(String Email);
}
