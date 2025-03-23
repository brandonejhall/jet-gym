import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import { WorkoutDTO, WorkoutUpdateDTO, WorkoutDeleteDTO } from '../types';

export const workoutService = {
  createWorkout: (workoutDTO: WorkoutDTO) => 
    apiClient.post<WorkoutDTO>(endpoints.workout.create, workoutDTO),
    
  updateWorkout: (data: WorkoutUpdateDTO) =>
    apiClient.put<void>(endpoints.workout.update, data),
    
  getUserWorkouts: (userId: string) =>
    apiClient.get<WorkoutDTO[]>(endpoints.workout.getUserWorkouts(userId)),
    
  deleteWorkout: (data: WorkoutDeleteDTO) =>
    apiClient.delete<void>(endpoints.workout.delete, data),
};
