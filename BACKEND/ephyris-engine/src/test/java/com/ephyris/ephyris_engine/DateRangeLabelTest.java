package com.ephyris.ephyris_engine;

import com.ephyris.ephyris_engine.Service.Impl.AnalyticsServiceImplementation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.ephyris.ephyris_engine.Repository.WorkoutRepository;
import com.ephyris.ephyris_engine.Repository.ExerciseRepository;
import com.ephyris.ephyris_engine.Repository.ExerciseSetRepository;

import java.lang.reflect.Method;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

public class DateRangeLabelTest {

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
    void testCreateDateRangeLabel_SameMonth() throws Exception {
        // Test week within same month
        LocalDate startDate = LocalDate.of(2024, 7, 1); // July 1
        LocalDate endDate = LocalDate.of(2024, 7, 7); // July 7

        String label = invokeCreateDateRangeLabel(startDate, endDate);

        assertEquals("Jul 1-7", label);
    }

    @Test
    void testCreateDateRangeLabel_CrossMonth() throws Exception {
        // Test week spanning across months
        LocalDate startDate = LocalDate.of(2024, 7, 29); // July 29
        LocalDate endDate = LocalDate.of(2024, 8, 4); // August 4

        String label = invokeCreateDateRangeLabel(startDate, endDate);

        assertEquals("Jul 29-Aug 4", label);
    }

    @Test
    void testCreateDateRangeLabel_DecemberToJanuary() throws Exception {
        // Test week spanning year boundary
        LocalDate startDate = LocalDate.of(2024, 12, 30); // December 30
        LocalDate endDate = LocalDate.of(2025, 1, 5); // January 5

        String label = invokeCreateDateRangeLabel(startDate, endDate);

        assertEquals("Dec 30-Jan 5", label);
    }

    @Test
    void testCreateDateRangeLabel_SingleDigitDays() throws Exception {
        // Test with single digit days
        LocalDate startDate = LocalDate.of(2024, 3, 1); // March 1
        LocalDate endDate = LocalDate.of(2024, 3, 7); // March 7

        String label = invokeCreateDateRangeLabel(startDate, endDate);

        assertEquals("Mar 1-7", label);
    }

    /**
     * Helper method to invoke the private createDateRangeLabel method
     */
    private String invokeCreateDateRangeLabel(LocalDate startDate, LocalDate endDate) throws Exception {
        Method method = AnalyticsServiceImplementation.class.getDeclaredMethod("createDateRangeLabel", LocalDate.class,
                LocalDate.class);
        method.setAccessible(true);
        return (String) method.invoke(analyticsService, startDate, endDate);
    }
}