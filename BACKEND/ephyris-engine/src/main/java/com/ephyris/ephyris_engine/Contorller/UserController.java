package com.ephyris.ephyris_engine.Contorller;

import com.ephyris.ephyris_engine.Config.ApiResponse;
import com.ephyris.ephyris_engine.Config.LoginResponse;
import com.ephyris.ephyris_engine.Contorller.WrapperDTOs.LoginUserDto;
import com.ephyris.ephyris_engine.DataTransferObject.UserDTO;
import com.ephyris.ephyris_engine.DataTransferObject.WorkoutDTO;
import com.ephyris.ephyris_engine.Entity.User;
import com.ephyris.ephyris_engine.Service.Impl.JwtService;
import com.ephyris.ephyris_engine.Service.Impl.UserServiceImplementation;
import com.ephyris.ephyris_engine.Service.Impl.ExerciseServiceImplementation;
import com.ephyris.ephyris_engine.Service.Impl.ExerciseSetServiceImplementation;
import com.ephyris.ephyris_engine.Service.Impl.WorkoutServiceImplementation;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import com.ephyris.ephyris_engine.Mapper.UserMapper;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@Controller
public class UserController {

    private final JwtService jwtService;
    private final UserServiceImplementation userImpl;
    private final WorkoutServiceImplementation wService;

    private final UserMapper userMapper;

    public UserController(JwtService jwtService, UserServiceImplementation userImpl,
            WorkoutServiceImplementation wService, ExerciseServiceImplementation eService,
            ExerciseSetServiceImplementation eSetService, UserMapper userMapper) {
        this.jwtService = jwtService;
        this.userImpl = userImpl;
        this.wService = wService;
        this.userMapper = userMapper;
    }

    @GetMapping("/index")
    public ResponseEntity<Object> home() {
        return new ResponseEntity<Object>("Welcome to the index page!", HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@Valid @RequestBody UserDTO request) {
        try {
            boolean userExist = userImpl.userExists(request.getEmail());
            if (!userExist) {
                userImpl.createUser(request);
                ApiResponse response = new ApiResponse("User registered successfully", HttpStatus.CREATED.value());
                return new ResponseEntity<>(response, HttpStatus.CREATED);

            } else {
                ApiResponse response = new ApiResponse("Email already in use", HttpStatus.CONFLICT.value());
                return new ResponseEntity<>(response, HttpStatus.CONFLICT);
            }

        } catch (Exception e) {
            ApiResponse response = new ApiResponse("Failed to register user: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginUserDto request) throws AccessDeniedException {
        User authenticatedUser = userImpl.login(request);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        List<WorkoutDTO> workouts = wService.getWorkoutsByUserId(authenticatedUser.getId());

        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(jwtToken);
        loginResponse.setExpiresIn(jwtService.getExpirationTime());
        loginResponse.setUserData(userMapper.toDTOWithoutPassword(authenticatedUser));
        loginResponse.setWorkouts(workouts);

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logout(@Valid @RequestBody UserDTO request) {
        return new ResponseEntity<>("logout successful", HttpStatus.OK);
    };

}
