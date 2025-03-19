package com.ephyris.ephyris_engine.Entity;


import lombok.Data;
import jakarta.persistence.*;
import java.time.LocalDate;


@Entity
@Table(name = "meals")
@Data
public class Meal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "meal_type", nullable = false)
    private String mealType;  // e.g., Breakfast, Lunch, Dinner, Snack

    @Column(nullable = false)
    private int calories;

    @Column(nullable = true)
    private double protein;

    @Column(nullable = false)
    private LocalDate date;
}
