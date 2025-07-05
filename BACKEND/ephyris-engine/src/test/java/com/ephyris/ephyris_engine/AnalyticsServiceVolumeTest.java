package com.ephyris.ephyris_engine;

import com.ephyris.ephyris_engine.Entity.ExerciseSet;
import com.ephyris.ephyris_engine.Service.Impl.AnalyticsServiceImplementation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.ephyris.ephyris_engine.Repository.WorkoutRepository;
import com.ephyris.ephyris_engine.Repository.ExerciseRepository;
import com.ephyris.ephyris_engine.Repository.ExerciseSetRepository;

import java.lang.reflect.Method;

import static org.junit.jupiter.api.Assertions.*;

public class AnalyticsServiceVolumeTest {

    @Mock
    private WorkoutRepository workoutRepository;

    @Mock
    private ExerciseRepository exerciseRepository;

    @Mock
    private ExerciseSetRepository exerciseSetRepository;

    private AnalyticsServiceImplementation analyticsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        analyticsService = new AnalyticsServiceImplementation(
                workoutRepository,
                exerciseRepository,
                exerciseSetRepository);
    }

    @Test
    void testCalculateSetVolume_WeightBasedExercise() throws Exception {
        // Test weight-based exercise: Bench Press
        ExerciseSet set = new ExerciseSet();
        set.setValue(10); // 10 reps
        set.setWeight(135.0); // 135 lbs
        set.setIsTimeBased(false);

        double volume = invokeCalculateSetVolume(set);

        // Expected: 135 lbs × 10 reps = 1,350 lbs
        assertEquals(1350.0, volume, 0.01);
    }

    @Test
    void testCalculateSetVolume_BodyweightExercise() throws Exception {
        // Test bodyweight exercise: Push-ups
        ExerciseSet set = new ExerciseSet();
        set.setValue(15); // 15 reps
        set.setWeight(null); // No weight (bodyweight)
        set.setIsTimeBased(false);

        double volume = invokeCalculateSetVolume(set);

        // Expected: 150 lbs (estimated bodyweight) × 0.5 × 15 reps = 1,125 lbs
        assertEquals(1125.0, volume, 0.01);
    }

    @Test
    void testCalculateSetVolume_TimeBasedExercise() throws Exception {
        // Test time-based exercise: Plank
        ExerciseSet set = new ExerciseSet();
        set.setValue(60); // 60 seconds
        set.setWeight(null); // No additional weight
        set.setIsTimeBased(true);

        double volume = invokeCalculateSetVolume(set);

        // Expected: (60 seconds / 60) × 150 lbs × 0.5 = 75 lbs
        assertEquals(75.0, volume, 0.01);
    }

    @Test
    void testCalculateSetVolume_WeightedTimeBasedExercise() throws Exception {
        // Test weighted time-based exercise: Weighted Plank
        ExerciseSet set = new ExerciseSet();
        set.setValue(45); // 45 seconds
        set.setWeight(25.0); // 25 lbs weight vest
        set.setIsTimeBased(true);

        double volume = invokeCalculateSetVolume(set);

        // Expected: (45 seconds / 60) × 25 lbs × 0.5 = 9.375 lbs
        assertEquals(9.375, volume, 0.01);
    }

    @Test
    void testCalculateSetVolume_ZeroReps() throws Exception {
        // Test edge case: zero reps
        ExerciseSet set = new ExerciseSet();
        set.setValue(0);
        set.setWeight(100.0);
        set.setIsTimeBased(false);

        double volume = invokeCalculateSetVolume(set);

        assertEquals(0.0, volume, 0.01);
    }

    @Test
    void testCalculateSetVolume_NullValues() throws Exception {
        // Test edge case: null values
        ExerciseSet set = new ExerciseSet();
        set.setValue(null);
        set.setWeight(null);
        set.setIsTimeBased(false);

        double volume = invokeCalculateSetVolume(set);

        assertEquals(0.0, volume, 0.01);
    }

    /**
     * Helper method to invoke the private calculateSetVolume method
     */
    private double invokeCalculateSetVolume(ExerciseSet set) throws Exception {
        Method method = AnalyticsServiceImplementation.class.getDeclaredMethod("calculateSetVolume", ExerciseSet.class);
        method.setAccessible(true);
        return (double) method.invoke(analyticsService, set);
    }
}