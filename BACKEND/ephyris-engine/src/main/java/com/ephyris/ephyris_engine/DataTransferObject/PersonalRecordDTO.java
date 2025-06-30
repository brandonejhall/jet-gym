package com.ephyris.ephyris_engine.DataTransferObject;

import java.time.LocalDate;

public class PersonalRecordDTO {
    private String exercise;
    private double weight;
    private int reps;
    private LocalDate date;
    private boolean isNewPR;

    // Default constructor
    public PersonalRecordDTO() {
    }

    // Constructor with all fields
    public PersonalRecordDTO(String exercise, double weight, int reps, LocalDate date, boolean isNewPR) {
        this.exercise = exercise;
        this.weight = weight;
        this.reps = reps;
        this.date = date;
        this.isNewPR = isNewPR;
    }

    // Getters and Setters
    public String getExercise() {
        return exercise;
    }

    public void setExercise(String exercise) {
        this.exercise = exercise;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public boolean isNewPR() {
        return isNewPR;
    }

    public void setNewPR(boolean newPR) {
        isNewPR = newPR;
    }
}