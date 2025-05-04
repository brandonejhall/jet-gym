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
    
  updateWorkout: async (data: WorkoutUpdateDTO) => {
    await apiClient.put<void>(endpoints.workout.update, data);
    // After updating workout, fetch updated list and cache it
    const updatedWorkouts = await apiClient.get<WorkoutDTO[]>(endpoints.workout.getUserWorkouts(JSON.stringify(data.userId)));
    await CacheService.setItem(WORKOUTS_CACHE_KEY, updatedWorkouts);
  },
    
  getUserWorkouts: async (userId: string) => {
    const workouts = await apiClient.get<WorkoutDTO[]>(endpoints.workout.getUserWorkouts(userId));
    await CacheService.setItem(WORKOUTS_CACHE_KEY, workouts);
    return workouts;
  },
    
  deleteWorkout: async (data: WorkoutDeleteDTO) => {
    await apiClient.delete<void>(endpoints.workout.delete, data);
    // After deleting workout, fetch updated list and cache it
    const updatedWorkouts = await apiClient.get<WorkoutDTO[]>(endpoints.workout.getUserWorkouts(JSON.stringify(data.userId)));
    await CacheService.setItem(WORKOUTS_CACHE_KEY, updatedWorkouts);
  },

  getWorkoutsByPeriod: async (userId: string, period: string) => {
    const workouts = await apiClient.get<WorkoutDTO[]>(endpoints.workout.getWorkoutsByPeriod(userId, period));
    return workouts;
  },
};
