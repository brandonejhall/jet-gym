package com.ephyris.ephyris_engine.DataTransferObject;

public class WeeklyVolumeDTO {
    private String week;
    private double volume;
    private double changeFromPreviousWeek;

    // Default constructor
    public WeeklyVolumeDTO() {
    }

    // Constructor with all fields
    public WeeklyVolumeDTO(String week, double volume, double changeFromPreviousWeek) {
        this.week = week;
        this.volume = volume;
        this.changeFromPreviousWeek = changeFromPreviousWeek;
    }

    // Getters and Setters
    public String getWeek() {
        return week;
    }

    public void setWeek(String week) {
        this.week = week;
    }

    public double getVolume() {
        return volume;
    }

    public void setVolume(double volume) {
        this.volume = volume;
    }

    public double getChangeFromPreviousWeek() {
        return changeFromPreviousWeek;
    }

    public void setChangeFromPreviousWeek(double changeFromPreviousWeek) {
        this.changeFromPreviousWeek = changeFromPreviousWeek;
    }
}