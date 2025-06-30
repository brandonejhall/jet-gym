package com.ephyris.ephyris_engine.DataTransferObject;

import java.util.List;

public class ConsistencyInsightDTO {
    private String title;
    private String summary;
    private int percentile;
    private int streakDays;
    private String patternFindings;
    private String recommendation;
    private List<Integer> weeklyFrequency;
    private List<Integer> dailyWorkouts;
    private int consistencyScore;

    // Default constructor
    public ConsistencyInsightDTO() {
    }

    // Constructor with all fields
    public ConsistencyInsightDTO(String title, String summary, int percentile, int streakDays,
            String patternFindings, String recommendation,
            List<Integer> weeklyFrequency, List<Integer> dailyWorkouts, int consistencyScore) {
        this.title = title;
        this.summary = summary;
        this.percentile = percentile;
        this.streakDays = streakDays;
        this.patternFindings = patternFindings;
        this.recommendation = recommendation;
        this.weeklyFrequency = weeklyFrequency;
        this.dailyWorkouts = dailyWorkouts;
        this.consistencyScore = consistencyScore;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public int getPercentile() {
        return percentile;
    }

    public void setPercentile(int percentile) {
        this.percentile = percentile;
    }

    public int getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(int streakDays) {
        this.streakDays = streakDays;
    }

    public String getPatternFindings() {
        return patternFindings;
    }

    public void setPatternFindings(String patternFindings) {
        this.patternFindings = patternFindings;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public List<Integer> getWeeklyFrequency() {
        return weeklyFrequency;
    }

    public void setWeeklyFrequency(List<Integer> weeklyFrequency) {
        this.weeklyFrequency = weeklyFrequency;
    }

    public List<Integer> getDailyWorkouts() {
        return dailyWorkouts;
    }

    public void setDailyWorkouts(List<Integer> dailyWorkouts) {
        this.dailyWorkouts = dailyWorkouts;
    }

    public int getConsistencyScore() {
        return consistencyScore;
    }

    public void setConsistencyScore(int consistencyScore) {
        this.consistencyScore = consistencyScore;
    }
}