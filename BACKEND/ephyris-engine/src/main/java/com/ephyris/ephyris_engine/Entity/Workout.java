package com.ephyris.ephyris_engine.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "workouts")
@Getter
@Setter
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "workout_name", nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = true)
    private String notes;

    @Column(nullable = true)
    private Integer duration;

    @OneToMany(mappedBy = "workout", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Exercise> exercises;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "completed")
    private Boolean completed = false;

    @PrePersist
    public void prePersist() {
        this.date = LocalDate.now();
    }
}