import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import { 
  ExerciseDTO, 
  ExerciseCreateDTO, 
  ExerciseUpdateDTO, 
  ExerciseDeleteDTO,
  ExerciseSuggestionDTO 
} from '../types';
import { CacheService } from './cacheservice';
import { WorkoutDTO } from '../types';

export const exerciseService = {
  createExercise: (data: ExerciseCreateDTO) =>
    apiClient.post<ExerciseDTO>(endpoints.exercise.create, data),
    
  updateExercise: (data: ExerciseUpdateDTO) =>
    apiClient.put<void>(endpoints.exercise.update, data),
    
  deleteExercise: async (data: ExerciseDeleteDTO) => {
    await apiClient.delete<void>(endpoints.exercise.delete, data);
    // TODO: Optimize this later. For now, fetch and cache all workouts after deleting an exercise (inefficient)
    const workouts = await apiClient.get<WorkoutDTO[]>(endpoints.workout.getUserWorkouts(data.userId));
    await CacheService.setItem('workouts', workouts);
  },
    
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
