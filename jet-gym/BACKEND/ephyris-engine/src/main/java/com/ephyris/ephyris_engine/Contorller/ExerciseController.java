package com.ephyris.ephyris_engine.Contorller;

import com.ephyris.ephyris_engine.Config.createExerciseResponse;
import com.ephyris.ephyris_engine.Contorller.WrapperDTOs.ExerciseCreateDTO;
import com.ephyris.ephyris_engine.Contorller.WrapperDTOs.ExerciseDeleteDTO;
import com.ephyris.ephyris_engine.Contorller.WrapperDTOs.ExerciseUpdateDTO;
import com.ephyris.ephyris_engine.DataTransferObject.ExerciseDTO;
import com.ephyris.ephyris_engine.DataTransferObject.ExerciseSuggestionDTO;
import com.ephyris.ephyris_engine.Mapper.ExerciseMapper;
import com.ephyris.ephyris_engine.Mapper.ExerciseSetMapper;
import com.ephyris.ephyris_engine.Service.Impl.ExerciseServiceImplementation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/exercise")
@Controller
public class ExerciseController {

    private final ExerciseServiceImplementation exerciseService;

    public ExerciseController(ExerciseServiceImplementation exerciseService, ExerciseSetMapper exerciseSetMapper,
            ExerciseMapper exerciseMapper) {
        this.exerciseService = exerciseService;
    }

    @PostMapping("/create")
    ResponseEntity<Object> createExercise(@RequestBody ExerciseCreateDTO exercise) throws AccessDeniedException {

        ExerciseDTO processedExercise = exerciseService.createExercise(exercise.getExercise(), exercise.getUserId());
        createExerciseResponse exResp = new createExerciseResponse();
        exResp.setNewExercise(processedExercise);
        return new ResponseEntity<Object>(exResp, HttpStatus.CREATED);

    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<ExerciseSuggestionDTO>> getSuggestions(
            @RequestParam String input,
            @RequestHeader("User-Id") Long userId // Assuming user ID comes from header
    ) {
        return ResponseEntity.ok(exerciseService.getSuggestions(input, userId));
    }

    @GetMapping("/workoutExercises/{workoutId}")
    ResponseEntity<Object> getExercisesForWorkout(@PathVariable Long workoutId, @RequestParam Long userId) {

        List<ExerciseDTO> exercises = exerciseService.getExercisesByWorkoutId(workoutId, userId);

        return new ResponseEntity<Object>(exercises, HttpStatus.OK);
    }

    @PutMapping("/update")
    ResponseEntity<Object> updateExercise(@RequestBody ExerciseUpdateDTO exerciseUpdateDTO)
            throws AccessDeniedException {

        exerciseService.updateExercise(exerciseUpdateDTO.getUserId(),
                exerciseUpdateDTO.getExerciseDTO());

        return new ResponseEntity<Object>("Exercise Updated", HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    ResponseEntity<Object> deleteExercise(@RequestBody ExerciseDeleteDTO exerciseDeleteDTO)
            throws AccessDeniedException {
        exerciseService
                .deleteExercise(exerciseDeleteDTO.getExerciseId(),
                        exerciseDeleteDTO.getUserId());

        return new ResponseEntity<Object>("Exercise Deleted", HttpStatus.OK);
    }

}