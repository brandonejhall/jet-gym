package com.ephyris.ephyris_engine.Service.Impl;

import com.ephyris.ephyris_engine.Repository.WorkoutRepository;
import com.ephyris.ephyris_engine.Repository.ExerciseRepository;
import com.ephyris.ephyris_engine.Repository.ExerciseSetRepository;
import com.ephyris.ephyris_engine.Entity.Workout;
import com.ephyris.ephyris_engine.Entity.Exercise;
import com.ephyris.ephyris_engine.Entity.ExerciseSet;
import com.ephyris.ephyris_engine.Service.AnalyticsService;
import com.ephyris.ephyris_engine.DataTransferObject.ConsistencyInsightDTO;
import com.ephyris.ephyris_engine.DataTransferObject.PersonalRecordDTO;
import com.ephyris.ephyris_engine.DataTransferObject.WeeklyVolumeDTO;
import com.ephyris.ephyris_engine.DataTransferObject.MuscleVolumeDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsServiceImplementation implements AnalyticsService {

    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;
    private final ExerciseSetRepository exerciseSetRepository;

    public AnalyticsServiceImplementation(WorkoutRepository workoutRepository,
            ExerciseRepository exerciseRepository,
            ExerciseSetRepository exerciseSetRepository) {
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
        this.exerciseSetRepository = exerciseSetRepository;
    }

    @Override
    public Map<Integer, Long> getWorkoutsPerWeekOfYear(Long userId, int weeksBack) {
        LocalDate now = LocalDate.now();
        LocalDate start = now.minusWeeks(weeksBack - 1).with(java.time.DayOfWeek.MONDAY);
        LocalDate end = now;

        List<Workout> workouts = workoutRepository.findByUserIdAndDateBetween(userId, start, end);

        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        Map<Integer, Long> weekToCount = new LinkedHashMap<>();

        for (int i = 0; i < weeksBack; i++) {
            int week = now.minusWeeks(i).get(weekFields.weekOfWeekBasedYear());
            weekToCount.put(week, 0L);
        }

        for (Workout workout : workouts) {
            int week = workout.getDate().get(weekFields.weekOfWeekBasedYear());
            weekToCount.put(week, weekToCount.getOrDefault(week, 0L) + 1);
        }

        return weekToCount;
    }

    @Override
    public ConsistencyInsightDTO getConsistencyInsight(Long userId, int weeksBack) {
        LocalDate now = LocalDate.now();
        LocalDate start = now.minusWeeks(weeksBack - 1).with(java.time.DayOfWeek.MONDAY);
        LocalDate end = now;

        List<Workout> workouts = workoutRepository.findByUserIdAndDateBetween(userId, start, end);

        // Calculate weekly frequency
        List<Integer> weeklyFrequency = calculateWeeklyFrequency(workouts, weeksBack);

        // Calculate daily workouts for current week
        List<Integer> dailyWorkouts = getDailyWorkoutsForCurrentWeek(userId);

        // Calculate streak days
        int streakDays = calculateStreakDays(workouts);

        // Calculate consistency score
        int consistencyScore = calculateConsistencyScore(weeklyFrequency);

        // Calculate percentile (simplified - in a real app, this would compare against
        // other users)
        int percentile = calculatePercentile(consistencyScore);

        // Generate insights and recommendations
        String summary = generateSummary(weeklyFrequency, streakDays);
        String patternFindings = analyzePatterns(workouts);
        String recommendation = generateRecommendation(weeklyFrequency, streakDays);

        return new ConsistencyInsightDTO(
                "Consistency Report",
                summary,
                percentile,
                streakDays,
                patternFindings,
                recommendation,
                weeklyFrequency,
                dailyWorkouts,
                consistencyScore);
    }

    private List<Integer> calculateWeeklyFrequency(List<Workout> workouts, int weeksBack) {
        LocalDate now = LocalDate.now();
        List<Integer> frequency = new ArrayList<>();

        for (int i = 0; i < weeksBack; i++) {
            LocalDate weekStart = now.minusWeeks(i).with(java.time.DayOfWeek.MONDAY);
            LocalDate weekEnd = weekStart.plusDays(6);

            long count = workouts.stream()
                    .filter(w -> !w.getDate().isBefore(weekStart) && !w.getDate().isAfter(weekEnd))
                    .count();

            frequency.add(0, (int) count); // Add to beginning to maintain chronological order
        }

        return frequency;
    }

    private int calculateStreakDays(List<Workout> workouts) {
        if (workouts.isEmpty())
            return 0;

        // Sort workouts by date in descending order
        workouts.sort((w1, w2) -> w2.getDate().compareTo(w1.getDate()));

        LocalDate currentDate = LocalDate.now();
        int streak = 0;

        // Check consecutive days backwards from today
        while (true) {
            LocalDate checkDate = currentDate.minusDays(streak);
            boolean hasWorkout = workouts.stream()
                    .anyMatch(w -> w.getDate().equals(checkDate));

            if (hasWorkout) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    }

    private int calculateConsistencyScore(List<Integer> weeklyFrequency) {
        if (weeklyFrequency.isEmpty())
            return 0;

        // Calculate average workouts per week
        double avg = weeklyFrequency.stream()
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        // Calculate variance
        double variance = weeklyFrequency.stream()
                .mapToDouble(freq -> Math.pow(freq - avg, 2))
                .average()
                .orElse(0.0);

        // Consistency score based on average frequency and low variance
        int score = (int) Math.min(100, (avg * 20) + (50 - Math.sqrt(variance) * 10));
        return Math.max(0, score);
    }

    private int calculatePercentile(int consistencyScore) {
        // Simplified percentile calculation
        // In a real application, this would compare against other users' scores
        if (consistencyScore >= 90)
            return 10;
        else if (consistencyScore >= 80)
            return 20;
        else if (consistencyScore >= 70)
            return 30;
        else if (consistencyScore >= 60)
            return 40;
        else if (consistencyScore >= 50)
            return 50;
        else if (consistencyScore >= 40)
            return 60;
        else if (consistencyScore >= 30)
            return 70;
        else if (consistencyScore >= 20)
            return 80;
        else
            return 90;
    }

    private String generateSummary(List<Integer> weeklyFrequency, int streakDays) {
        if (weeklyFrequency.isEmpty()) {
            return "No workout data available for analysis.";
        }

        double avgWorkouts = weeklyFrequency.stream()
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        if (avgWorkouts >= 4) {
            return String.format("You've maintained a consistent %.0f-day workout pattern for %d weeks straight.",
                    avgWorkouts, weeklyFrequency.size());
        } else if (avgWorkouts >= 2) {
            return String.format("You're building a good foundation with %.0f workouts per week on average.",
                    avgWorkouts);
        } else {
            return "You're getting started with your fitness journey. Consistency will help you see better results.";
        }
    }

    private String analyzePatterns(List<Workout> workouts) {
        if (workouts.size() < 2) {
            return "Not enough data to identify patterns yet.";
        }

        // Analyze day of week patterns
        Map<java.time.DayOfWeek, Long> dayCounts = workouts.stream()
                .collect(Collectors.groupingBy(w -> w.getDate().getDayOfWeek(), Collectors.counting()));

        java.time.DayOfWeek mostFrequentDay = dayCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(java.time.DayOfWeek.MONDAY);

        return String.format("You're most consistent on %s. Try to maintain this pattern for better results.",
                mostFrequentDay.toString().toLowerCase());
    }

    private String generateRecommendation(List<Integer> weeklyFrequency, int streakDays) {
        if (weeklyFrequency.isEmpty()) {
            return "Start with 2-3 workouts per week to build a consistent routine.";
        }

        double avgWorkouts = weeklyFrequency.stream()
                .mapToInt(Integer::intValue)
                .average()
                .orElse(0.0);

        if (avgWorkouts >= 4) {
            return "Great consistency! Consider adding variety to your workouts to prevent plateaus.";
        } else if (avgWorkouts >= 2) {
            return "Try to increase to 3-4 workouts per week for optimal results.";
        } else {
            return "Aim for at least 2-3 workouts per week to build momentum and see progress.";
        }
    }

    @Override
    public List<Integer> getDailyWorkoutsForCurrentWeek(Long userId) {
        LocalDate now = LocalDate.now();
        LocalDate startOfWeek = now.with(java.time.DayOfWeek.SUNDAY);
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        List<Workout> workouts = workoutRepository.findByUserIdAndDateBetween(userId, startOfWeek, endOfWeek);

        List<Integer> dailyWorkouts = new ArrayList<>();

        // Generate data for each day of the current week (Sunday to Saturday)
        for (int i = 0; i < 7; i++) {
            LocalDate day = startOfWeek.plusDays(i);
            long count = workouts.stream()
                    .filter(w -> w.getDate().equals(day))
                    .count();
            dailyWorkouts.add((int) count);
        }

        return dailyWorkouts;
    }

    @Override
    public List<PersonalRecordDTO> getPersonalRecords(Long userId) {
        // Get all workouts for the user first
        List<Workout> workouts = workoutRepository.findByUserId(userId);
        List<PersonalRecordDTO> personalRecords = new ArrayList<>();

        // Group exercises by name to find the best set for each exercise
        Map<String, List<Exercise>> exercisesByName = new HashMap<>();

        for (Workout workout : workouts) {
            List<Exercise> exercises = exerciseRepository.findAll().stream()
                    .filter(e -> e.getWorkout().getId().equals(workout.getId()))
                    .collect(Collectors.toList());

            for (Exercise exercise : exercises) {
                exercisesByName.computeIfAbsent(exercise.getName(), k -> new ArrayList<>()).add(exercise);
            }
        }

        for (Map.Entry<String, List<Exercise>> entry : exercisesByName.entrySet()) {
            String exerciseName = entry.getKey();
            List<Exercise> exerciseList = entry.getValue();

            // Get all sets for this exercise
            List<ExerciseSet> allSets = new ArrayList<>();
            for (Exercise exercise : exerciseList) {
                List<ExerciseSet> sets = exerciseSetRepository.findAll().stream()
                        .filter(set -> set.getExercise().getId().equals(exercise.getId()))
                        .collect(Collectors.toList());
                allSets.addAll(sets);
            }

            // Find the best set (highest weight * reps)
            Optional<ExerciseSet> bestSet = allSets.stream()
                    .filter(set -> set.getWeight() != null && set.getValue() != null && !set.getIsTimeBased())
                    .max(Comparator.comparingDouble(set -> set.getWeight() * set.getValue()));

            if (bestSet.isPresent()) {
                ExerciseSet set = bestSet.get();
                personalRecords.add(new PersonalRecordDTO(
                        exerciseName,
                        set.getWeight(),
                        set.getValue(),
                        set.getExercise().getWorkout().getDate(),
                        false // TODO: Implement logic to detect if this is a new PR
                ));
            }
        }

        return personalRecords;
    }

    @Override
    public List<WeeklyVolumeDTO> getWeeklyVolume(Long userId, int weeksBack) {
        LocalDate now = LocalDate.now();
        List<WeeklyVolumeDTO> weeklyVolumes = new ArrayList<>();

        for (int i = 0; i < weeksBack; i++) {
            LocalDate weekStart = now.minusWeeks(i).with(java.time.DayOfWeek.MONDAY);
            LocalDate weekEnd = weekStart.plusDays(6);

            // Get workouts for this week
            List<Workout> weekWorkouts = workoutRepository.findByUserIdAndDateBetween(userId, weekStart, weekEnd);

            // Calculate total volume for the week
            double weeklyVolume = 0.0;
            for (Workout workout : weekWorkouts) {
                List<Exercise> exercises = exerciseRepository.findAll().stream()
                        .filter(e -> e.getWorkout().getId().equals(workout.getId()))
                        .collect(Collectors.toList());

                for (Exercise exercise : exercises) {
                    List<ExerciseSet> sets = exerciseSetRepository.findAll().stream()
                            .filter(set -> set.getExercise().getId().equals(exercise.getId()))
                            .collect(Collectors.toList());

                    for (ExerciseSet set : sets) {
                        if (set.getWeight() != null && set.getValue() != null && !set.getIsTimeBased()) {
                            weeklyVolume += set.getWeight() * set.getValue();
                        }
                    }
                }
            }

            // Calculate change from previous week
            double changeFromPrevious = 0.0;
            if (i > 0) {
                LocalDate prevWeekStart = now.minusWeeks(i - 1).with(java.time.DayOfWeek.MONDAY);
                LocalDate prevWeekEnd = prevWeekStart.plusDays(6);
                List<Workout> prevWeekWorkouts = workoutRepository.findByUserIdAndDateBetween(userId, prevWeekStart,
                        prevWeekEnd);

                double prevWeeklyVolume = 0.0;
                for (Workout workout : prevWeekWorkouts) {
                    List<Exercise> exercises = exerciseRepository.findAll().stream()
                            .filter(e -> e.getWorkout().getId().equals(workout.getId()))
                            .collect(Collectors.toList());

                    for (Exercise exercise : exercises) {
                        List<ExerciseSet> sets = exerciseSetRepository.findAll().stream()
                                .filter(set -> set.getExercise().getId().equals(exercise.getId()))
                                .collect(Collectors.toList());

                        for (ExerciseSet set : sets) {
                            if (set.getWeight() != null && set.getValue() != null && !set.getIsTimeBased()) {
                                prevWeeklyVolume += set.getWeight() * set.getValue();
                            }
                        }
                    }
                }

                if (prevWeeklyVolume > 0) {
                    changeFromPrevious = ((weeklyVolume - prevWeeklyVolume) / prevWeeklyVolume) * 100;
                }
            }

            String weekLabel = "W" + (weeksBack - i);
            weeklyVolumes.add(0, new WeeklyVolumeDTO(weekLabel, weeklyVolume, changeFromPrevious));
        }

        return weeklyVolumes;
    }

    @Override
    public MuscleVolumeDTO getMuscleGroupVolume(Long userId) {
        LocalDate now = LocalDate.now();
        LocalDate fourWeeksAgo = now.minusWeeks(4);

        // Get workouts from the last 4 weeks
        List<Workout> workouts = workoutRepository.findByUserIdAndDateBetween(userId, fourWeeksAgo, now);

        Map<String, Double> muscleVolumes = new HashMap<>();
        double totalVolume = 0.0;

        for (Workout workout : workouts) {
            List<Exercise> exercises = exerciseRepository.findAll().stream()
                    .filter(e -> e.getWorkout().getId().equals(workout.getId()))
                    .collect(Collectors.toList());

            for (Exercise exercise : exercises) {
                String muscleGroup = exercise.getMuscleGroup();
                if (muscleGroup == null || muscleGroup.isEmpty()) {
                    muscleGroup = "Other";
                }

                List<ExerciseSet> sets = exerciseSetRepository.findAll().stream()
                        .filter(set -> set.getExercise().getId().equals(exercise.getId()))
                        .collect(Collectors.toList());

                for (ExerciseSet set : sets) {
                    if (set.getWeight() != null && set.getValue() != null && !set.getIsTimeBased()) {
                        double volume = set.getWeight() * set.getValue();
                        muscleVolumes.merge(muscleGroup, volume, Double::sum);
                        totalVolume += volume;
                    }
                }
            }
        }

        return new MuscleVolumeDTO(muscleVolumes, totalVolume);
    }
}
