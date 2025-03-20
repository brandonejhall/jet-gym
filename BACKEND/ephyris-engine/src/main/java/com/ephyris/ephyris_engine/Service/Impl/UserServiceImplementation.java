package com.ephyris.ephyris_engine.Service.Impl;

import com.ephyris.ephyris_engine.Contorller.WrapperDTOs.LoginUserDto;
import com.ephyris.ephyris_engine.DataTransferObject.UserDTO;
import com.ephyris.ephyris_engine.Entity.User;
import com.ephyris.ephyris_engine.Repository.UserRepository;
import com.ephyris.ephyris_engine.Service.UserService;
import com.ephyris.ephyris_engine.Mapper.UserMapper;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ephyris.ephyris_engine.Config.ResourceNotFoundException;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImplementation implements UserService {

    private final UserRepository userRepository;
    private final UserMapper uMapper;

    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    public UserServiceImplementation(UserRepository userRepository, UserMapper uMapper, PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.uMapper = uMapper;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
    }

    @Override
    public void createUser(UserDTO DTO) {

        if (userRepository.findByEmail(DTO.getEmail()).isPresent()) {
            throw new ResourceNotFoundException("User already exists with email: " + DTO.getEmail());
        }

        DTO.setPassword(passwordEncoder.encode(DTO.getPassword()));

        User user = uMapper.toEntity(DTO);

        userRepository.save(user);

    }

    @Override
    public UserDTO getUserById(Long userId) {

        // Verify input
        if (userId == null) {
            throw new IllegalArgumentException("Invalid Input Data");
        }

        User user = userRepository.findUserById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User does not exist"));

        return uMapper.toDTO(user);

    }

    @Override
    public Optional<UserDTO> getUserByEmail(String userEmail) {
        @SuppressWarnings("unused")
        UserDTO foundUserDTO = new UserDTO();

        if (userRepository.findByEmail(userEmail).isPresent()) {

            User foundUser = userRepository.findByEmail(userEmail).get();

            return Optional.of(uMapper.toDTOWithoutPassword(foundUser));
        }

        return Optional.empty();
    }

    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();

        return uMapper.toDTOList(users);
    }

    @Override
    public void deleteUser(Long userId) {
        if (userRepository.existsById(userId)) {
            userRepository.deleteById(userId);
        } else {
            throw new EntityNotFoundException("User with ID " + userId + " does not exist.");
        }
    }

    @Override
    public boolean userExists(String Email) {
        return userRepository.findByEmail(Email).isPresent();
    }

    @Override
    public User login(LoginUserDto user) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        user.getPassword()));

        return userRepository.findByEmail(user.getEmail())
                .orElseThrow();
    }
}
