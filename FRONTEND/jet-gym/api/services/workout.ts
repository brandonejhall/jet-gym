import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import { WorkoutDTO, WorkoutUpdateDTO, WorkoutDeleteDTO } from '../types';
import { CacheService } from './cacheservice';

const WORKOUTS_CACHE_KEY = 'workouts';

export const workoutService = {
  createWorkout: async (workoutDTO: WorkoutDTO) => {
    const response = await apiClient.post<WorkoutDTO>(endpoints.workout.create, workoutDTO);
    // After creating workout, fetch updated list and cache it
    const updatedWorkouts = await apiClient.get<WorkoutDTO[]>(endpoints.workout.getUserWorkouts(JSON.stringify(workoutDTO.userId)));
    await CacheService.setItem(WORKOUTS_CACHE_KEY, updatedWorkouts);
    return response;
  },
    
  updateWorkout: (data: WorkoutUpdateDTO) =>
    apiClient.put<void>(endpoints.workout.update, data),
    
  getUserWorkouts: (userId: string) =>
    apiClient.get<WorkoutDTO[]>(endpoints.workout.getUserWorkouts(userId)),
    
  deleteWorkout: (data: WorkoutDeleteDTO) =>
    apiClient.delete<void>(endpoints.workout.delete, data),

  getWorkoutsByPeriod: (userId: string, period: string) =>
    apiClient.get<WorkoutDTO[]>(endpoints.workout.getWorkoutsByPeriod(userId, period)),
};
