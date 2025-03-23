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
  id?: string;
  userId: string;
  name: string;
  date: string;
  exercises?: ExerciseDTO[];
}

export interface WorkoutUpdateDTO {
  workoutId: string;
  userId: string;
  workoutDTO: WorkoutDTO;
}

export interface WorkoutDeleteDTO {
  userId: string;
  workoutId: string;
}

export interface ExerciseDTO {
  id?: string;
  workoutId: string;
  name: string;
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
  id: string;
  name: string;
  type?: string;
  muscleGroup?: string;
}

export interface ExerciseSetDTO {
  id?: string;
  exerciseId: string;
  weight: number;
  reps: number;
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