package com.ephyris.ephyris_engine.Contorller;

import com.ephyris.ephyris_engine.Config.createWorkoutResponse;
import com.ephyris.ephyris_engine.Contorller.WrapperDTOs.WorkoutDeleteDTO;
import com.ephyris.ephyris_engine.Contorller.WrapperDTOs.WorkoutUpdateDTO;
import com.ephyris.ephyris_engine.DataTransferObject.WorkoutDTO;
import com.ephyris.ephyris_engine.Repository.WorkoutRepository;
import com.ephyris.ephyris_engine.Service.Impl.WorkoutServiceImplementation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/workout")
@Controller
public class WorkoutController {
    WorkoutServiceImplementation workoutService;
    WorkoutRepository wRepo;

    public WorkoutController(WorkoutServiceImplementation workoutService, WorkoutRepository wRepo) {

        this.workoutService = workoutService;

        this.wRepo = wRepo;
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createWorkout(@RequestBody WorkoutDTO workoutDTO) throws AccessDeniedException {
        WorkoutDTO newWorkout = workoutService.createWorkout(workoutDTO, workoutDTO.getUserId());

        createWorkoutResponse cwResponse = new createWorkoutResponse();

        cwResponse.setNewWorkout(newWorkout);
        return new ResponseEntity<Object>(cwResponse, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Object> updateWorkout(@RequestBody WorkoutUpdateDTO workoutUpdateDTO)
            throws AccessDeniedException {

        workoutService.updateWorkout(workoutUpdateDTO.getWorkoutId(),
                workoutUpdateDTO.getUserId(),
                workoutUpdateDTO.getWorkoutDTO());
        return new ResponseEntity<Object>("Workout Updated", HttpStatus.OK);

    }

    @GetMapping("/userWorkouts/{id}")
    public ResponseEntity<Object> getUserWorkouts(@PathVariable Long id) throws AccessDeniedException {

        List<WorkoutDTO> workouts = workoutService.getWorkoutsByUserId(id);

        return new ResponseEntity<Object>(workouts, HttpStatus.OK);
    }

    @GetMapping("/userWorkouts/{id}/{period}")
    public ResponseEntity<Object> getUserWorkoutsByPeriod(@PathVariable Long id, @PathVariable String period)
            throws AccessDeniedException {
        List<WorkoutDTO> workouts = workoutService.getWorkoutsByPeriod(id, period);
        return new ResponseEntity<Object>(workouts, HttpStatus.OK);
    }

    @DeleteMapping("/deleteWorkout")
    public ResponseEntity<Object> deleteWorkout(@RequestBody WorkoutDeleteDTO workoutDelete)
            throws AccessDeniedException {

        workoutService.deleteWorkout(workoutDelete.getWorkoutId(), workoutDelete.getUserId());

        return new ResponseEntity<>("Workout Deleted", HttpStatus.OK);
    }

}
