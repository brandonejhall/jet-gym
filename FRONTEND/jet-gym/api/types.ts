export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }

export interface WorkoutDTO {
  id?: number;
  userId: number;
  name: string;
  notes: string;
  duration: number;
  date: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  exercises?: ExerciseDTO[];
}

export interface WorkoutUpdateDTO {
  workoutId: number;
  userId: number;
  workoutDTO: WorkoutDTO;
}

export interface WorkoutDeleteDTO {
  userId: number;
  workoutId: number;
}

export interface ExerciseDTO {
  id?: number;
  workoutId: number;
  name: string;
  muscleGroup: string;
  canonicalName: string;
  normalizedName: string;
  sets?: ExerciseSetDTO[];
}

export interface ExerciseCreateDTO {
  userId: string;
  exercise: ExerciseDTO;
}

export interface ExerciseUpdateDTO {
  userId: string;
  exerciseDTO: ExerciseDTO;
}

export interface ExerciseDeleteDTO {
  userId: string;
  exerciseId: string;
}

export interface ExerciseSuggestionDTO {
  name: string;
  canonicalName: string;
  isHistorical: boolean;
}

export interface ExerciseSetDTO {
  id?: number;
  exerciseId: number;
  value: number;
  isTimeBased: boolean;
  weight: number;
  completed: boolean;
}

export interface ExerciseSetCreateDTO {
  userId: string;
  exerciseSetDTO: ExerciseSetDTO;
}

export interface ExerciseSetUpdateDTO {
  userId: string;
  exerciseSetDTO: ExerciseSetDTO;
}

export interface ExerciseSetDeleteDTO {
  userId: string;
  exerciseSetId: string;
}