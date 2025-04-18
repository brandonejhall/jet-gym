import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import { LoginRequest, AuthResponse } from '../types';
import { CacheService } from './cacheservice';
import { workoutService } from './workout';

const TOKEN_CACHE_KEY = 'token';
const USER_DATA_CACHE_KEY = 'userData';
const WORKOUTS_CACHE_KEY = 'workouts';
const USER_ID = 'userId';
export const authService = {
    login: async (data: LoginRequest) => {
      const response = await apiClient.post<AuthResponse>(endpoints.auth.login, data);
      // Store the token and user data in cache
      await CacheService.setItem(TOKEN_CACHE_KEY, response.token);
      await CacheService.setItem(USER_DATA_CACHE_KEY, response.userData);
      await CacheService.setItem(USER_ID, response.userData.id);
      
      // Fetch and store workouts after successful login
      const workouts = await workoutService.getUserWorkouts(response.userData.id);
      await CacheService.setItem(WORKOUTS_CACHE_KEY, workouts);
      
      return response;
    },
      
    register: async (data: any) => {
      const response = await apiClient.post<AuthResponse>(endpoints.auth.register, data);
      // Store the token in cache
      await CacheService.setItem(TOKEN_CACHE_KEY, response.token);
      return response;
    },
      
    logout: async () => {
      await apiClient.post<void>(endpoints.auth.logout);
      // Remove token and user data from cache
      await CacheService.removeItem(TOKEN_CACHE_KEY);
      await CacheService.removeItem(USER_DATA_CACHE_KEY);
      await CacheService.removeItem(WORKOUTS_CACHE_KEY);
    },

    // Helper method to get token
    getToken: () => CacheService.getItem<string>(TOKEN_CACHE_KEY),
    
    // Helper method to get user data
    getUserData: () => CacheService.getItem<any>(USER_DATA_CACHE_KEY),
    
    // Helper method to get workouts
    getWorkouts: () => CacheService.getItem<any[]>(WORKOUTS_CACHE_KEY),
};
  