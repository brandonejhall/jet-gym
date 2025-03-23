import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import { 
  ExerciseSetDTO, 
  ExerciseSetCreateDTO, 
  ExerciseSetUpdateDTO, 
  ExerciseSetDeleteDTO 
} from '../types';

export const exerciseSetService = {
  createSet: (data: ExerciseSetCreateDTO) =>
    apiClient.post<ExerciseSetDTO>(endpoints.sets.create, data),
    
  updateSet: (data: ExerciseSetUpdateDTO) =>
    apiClient.put<void>(endpoints.sets.update, data),
    
  deleteSet: (data: ExerciseSetDeleteDTO) =>
    apiClient.delete<void>(endpoints.sets.delete, data),
    
  getByExercise: (exerciseId: string, userId: string) =>
    apiClient.get<ExerciseSetDTO[]>(
      endpoints.sets.getByExercise(exerciseId),
      { params: { userId } }
    ),
};
