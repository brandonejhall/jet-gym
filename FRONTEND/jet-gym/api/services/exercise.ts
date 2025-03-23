import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import { 
  ExerciseDTO, 
  ExerciseCreateDTO, 
  ExerciseUpdateDTO, 
  ExerciseDeleteDTO,
  ExerciseSuggestionDTO 
} from '../types';

export const exerciseService = {
  createExercise: (data: ExerciseCreateDTO) =>
    apiClient.post<ExerciseDTO>(endpoints.exercise.create, data),
    
  updateExercise: (data: ExerciseUpdateDTO) =>
    apiClient.put<void>(endpoints.exercise.update, data),
    
  deleteExercise: (data: ExerciseDeleteDTO) =>
    apiClient.delete<void>(endpoints.exercise.delete, data),
    
  getSuggestions: (input: string, userId: string) =>
    apiClient.get<ExerciseSuggestionDTO[]>(
      `${endpoints.exercise.suggestions}?input=${input}`,
      { headers: { 'User-Id': userId } }
    ),
    
  getByWorkout: (workoutId: string, userId: string) =>
    apiClient.get<ExerciseDTO[]>(
      endpoints.exercise.getByWorkout(workoutId),
      { params: { userId } }
    ),
};
