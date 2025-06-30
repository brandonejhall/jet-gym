package com.ephyris.ephyris_engine.Contorller;

import com.ephyris.ephyris_engine.Service.Impl.AnalyticsServiceImplementation;
import com.ephyris.ephyris_engine.DataTransferObject.ConsistencyInsightDTO;
import com.ephyris.ephyris_engine.DataTransferObject.PersonalRecordDTO;
import com.ephyris.ephyris_engine.DataTransferObject.WeeklyVolumeDTO;
import com.ephyris.ephyris_engine.DataTransferObject.MuscleVolumeDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@Controller
public class AnalyticsController {

    private final AnalyticsServiceImplementation analyticsService;

    public AnalyticsController(AnalyticsServiceImplementation analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/workouts-per-week/{userId}")
    public ResponseEntity<Object> getWorkoutsPerWeek(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "7") int weeksBack) {

        try {
            Map<Integer, Long> workoutsPerWeek = analyticsService.getWorkoutsPerWeekOfYear(userId, weeksBack);
            return new ResponseEntity<Object>(workoutsPerWeek, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Object>("Error retrieving analytics data: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/consistency-insight/{userId}")
    public ResponseEntity<Object> getConsistencyInsight(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "7") int weeksBack) {

        try {
            ConsistencyInsightDTO consistencyInsight = analyticsService.getConsistencyInsight(userId, weeksBack);
            return new ResponseEntity<Object>(consistencyInsight, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Object>("Error retrieving consistency insight: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/daily-workouts/{userId}")
    public ResponseEntity<Object> getDailyWorkoutsForCurrentWeek(@PathVariable Long userId) {
        try {
            List<Integer> dailyWorkouts = analyticsService.getDailyWorkoutsForCurrentWeek(userId);
            return new ResponseEntity<Object>(dailyWorkouts, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Object>("Error retrieving daily workouts: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/personal-records/{userId}")
    public ResponseEntity<Object> getPersonalRecords(@PathVariable Long userId) {
        try {
            List<PersonalRecordDTO> personalRecords = analyticsService.getPersonalRecords(userId);
            return new ResponseEntity<Object>(personalRecords, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Object>("Error retrieving personal records: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/weekly-volume/{userId}")
    public ResponseEntity<Object> getWeeklyVolume(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "7") int weeksBack) {
        try {
            List<WeeklyVolumeDTO> weeklyVolume = analyticsService.getWeeklyVolume(userId, weeksBack);
            return new ResponseEntity<Object>(weeklyVolume, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Object>("Error retrieving weekly volume: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/muscle-volume/{userId}")
    public ResponseEntity<Object> getMuscleGroupVolume(@PathVariable Long userId) {
        try {
            MuscleVolumeDTO muscleVolume = analyticsService.getMuscleGroupVolume(userId);
            return new ResponseEntity<Object>(muscleVolume, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<Object>("Error retrieving muscle volume: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}