package com.ephyris.ephyris_engine.Contorller;

import com.ephyris.ephyris_engine.Contorller.WrapperDTOs.*;
import com.ephyris.ephyris_engine.DataTransferObject.ExerciseSetDTO;
import com.ephyris.ephyris_engine.Service.Impl.ExerciseSetServiceImplementation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
@RequestMapping("/api/sets")
@Controller
public class ExerciseSetController {

    private ExerciseSetServiceImplementation exerciseSetService;

    public ExerciseSetController(ExerciseSetServiceImplementation exerciseSetService) {
        this.exerciseSetService = exerciseSetService;
    }

    @PostMapping("/create")
    public ResponseEntity<Object> createSet(@RequestBody ExerciseSetCreateDTO exerciseSetCreateDTO)
            throws AccessDeniedException {

        ExerciseSetDTO newExerciseSet = exerciseSetService.createExerciseSet(
                exerciseSetCreateDTO.getExerciseSetDTO(),
                exerciseSetCreateDTO.getUserId());

        return new ResponseEntity<Object>(newExerciseSet, HttpStatus.CREATED);

    }

    @GetMapping("/exerciseSets/{exerciseId}")
    public ResponseEntity<Object> getExerciseSets(@PathVariable Long exerciseId, @RequestParam Long userId)
            throws AccessDeniedException {
        List<ExerciseSetDTO> sets = exerciseSetService.getExerciseSetsByExerciseId(exerciseId, userId);

        return new ResponseEntity<Object>(sets, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<Object> updateExerciseSet(@RequestBody ExerciseSetUpdateDTO exerciseSetUpdateDTO)
            throws AccessDeniedException {
        exerciseSetService.updateExerciseSet(exerciseSetUpdateDTO.getUserId(),
                exerciseSetUpdateDTO.getExerciseSetDTO());

        return new ResponseEntity<Object>("Exercise Updated", HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    ResponseEntity<Object> deleteExercise(@RequestBody ExerciseSetDeleteDTO exerciseSetDeleteDTO)
            throws AccessDeniedException {
        exerciseSetService
                .deleteExerciseSet(exerciseSetDeleteDTO.getExerciseSetId(),
                        exerciseSetDeleteDTO.getUserId());

        return new ResponseEntity<Object>("Set Deleted Successfully", HttpStatus.OK);
    }

}
