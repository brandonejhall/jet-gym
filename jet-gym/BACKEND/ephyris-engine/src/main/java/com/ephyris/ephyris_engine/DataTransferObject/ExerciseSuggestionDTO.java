package com.ephyris.ephyris_engine.DataTransferObject;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class ExerciseSuggestionDTO {
    private String name;
    private String canonicalName;
    private boolean isHistorical; // indicates if it's from user history

}
