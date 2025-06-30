package com.ephyris.ephyris_engine.DataTransferObject;

import java.util.Map;

public class MuscleVolumeDTO {
    private Map<String, Double> muscleVolumes;
    private double totalVolume;

    // Default constructor
    public MuscleVolumeDTO() {
    }

    // Constructor with all fields
    public MuscleVolumeDTO(Map<String, Double> muscleVolumes, double totalVolume) {
        this.muscleVolumes = muscleVolumes;
        this.totalVolume = totalVolume;
    }

    // Getters and Setters
    public Map<String, Double> getMuscleVolumes() {
        return muscleVolumes;
    }

    public void setMuscleVolumes(Map<String, Double> muscleVolumes) {
        this.muscleVolumes = muscleVolumes;
    }

    public double getTotalVolume() {
        return totalVolume;
    }

    public void setTotalVolume(double totalVolume) {
        this.totalVolume = totalVolume;
    }
}