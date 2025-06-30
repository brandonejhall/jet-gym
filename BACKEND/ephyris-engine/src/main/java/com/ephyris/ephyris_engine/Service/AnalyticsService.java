package com.ephyris.ephyris_engine.Service;

import com.ephyris.ephyris_engine.DataTransferObject.ConsistencyInsightDTO;
import com.ephyris.ephyris_engine.DataTransferObject.PersonalRecordDTO;
import com.ephyris.ephyris_engine.DataTransferObject.WeeklyVolumeDTO;
import com.ephyris.ephyris_engine.DataTransferObject.MuscleVolumeDTO;
import java.util.Map;
import java.util.List;

public interface AnalyticsService {
    // TODO: Create a method to get the number of workouts done per week of the
    // current year
    // I think I would need to use the WorkoutRepository to get the number of
    // workouts done per week of the current year and it should
    // should range 7 weeks from the current week.
    Map<Integer, Long> getWorkoutsPerWeekOfYear(Long userId, int weeksBack);

    // Get comprehensive consistency insight data
    ConsistencyInsightDTO getConsistencyInsight(Long userId, int weeksBack);

    // Get daily workout data for the current week
    List<Integer> getDailyWorkoutsForCurrentWeek(Long userId);

    // Get personal records for all exercises
    List<PersonalRecordDTO> getPersonalRecords(Long userId);

    // Get weekly training volume data
    List<WeeklyVolumeDTO> getWeeklyVolume(Long userId, int weeksBack);

    // Get muscle group volume data
    MuscleVolumeDTO getMuscleGroupVolume(Long userId);
}