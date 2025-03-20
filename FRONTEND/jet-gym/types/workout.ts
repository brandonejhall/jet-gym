export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'legs' 
  | 'shoulders' 
  | 'arms' 
  | 'core' 
  | 'cardio';

export interface Set {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  notes?: string;
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroups?: MuscleGroup[];
  sets?: Set[];
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  exercises?: Exercise[];
  duration?: number;
  notes?: string;
}