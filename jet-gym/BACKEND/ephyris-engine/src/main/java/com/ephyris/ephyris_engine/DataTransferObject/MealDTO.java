package com.ephyris.ephyris_engine.DataTransferObject;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MealDTO {
    private Long id;
    private Long userId; // foreign key reference to User
    private String mealType; // Enum as a string
    private int calories;
    private double protein;
    private LocalDate date;
}
