import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import { 
  ExerciseSetDTO, 
  ExerciseSetCreateDTO, 
  ExerciseSetUpdateDTO, 
  ExerciseSetDeleteDTO 
} from '../types';
import { CacheService } from './cacheservice';
import { WorkoutDTO } from '../types';

export const exerciseSetService = {
  createSet: (data: ExerciseSetCreateDTO) =>
    apiClient.post<ExerciseSetDTO>(endpoints.sets.create, data),
    
  updateSet: (data: ExerciseSetUpdateDTO) =>
    apiClient.put<void>(endpoints.sets.update, data),
    
  deleteSet: async (data: ExerciseSetDeleteDTO) => {
    await apiClient.delete<void>(endpoints.sets.delete, data);
    // TODO: Optimize this later. For now, fetch and cache all workouts after deleting a set (inefficient)
    const workouts = await apiClient.get<WorkoutDTO[]>(endpoints.workout.getUserWorkouts(data.userId));
    await CacheService.setItem('workouts', workouts);
  },
    
  getByExercise: (exerciseId: string, userId: string) =>
    apiClient.get<ExerciseSetDTO[]>(
      endpoints.sets.getByExercise(exerciseId),
      { params: { userId } }
    ),
};
