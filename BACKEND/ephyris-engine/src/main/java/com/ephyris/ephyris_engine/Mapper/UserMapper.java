package com.ephyris.ephyris_engine.Mapper;

import com.ephyris.ephyris_engine.Entity.User;
import org.mapstruct.*;
import com.ephyris.ephyris_engine.DataTransferObject.UserDTO;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface UserMapper {

    @Mapping(target = "workouts", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "membershipStatus", defaultValue = "free")
    UserDTO toDTO(User user);

    @Mapping(target = "workouts", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    User toEntity(UserDTO dto);

    @Named("toDTOWithoutPassword")
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "workouts", ignore = true)
    UserDTO toDTOWithoutPassword(User user);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "workouts", ignore = true)
    void updateUserFromDTO(UserDTO userDTO, @MappingTarget User user);

    List<UserDTO> toDTOList(List<User> users);

    List<User> toEntityList(List<UserDTO> userDTOs);
}
