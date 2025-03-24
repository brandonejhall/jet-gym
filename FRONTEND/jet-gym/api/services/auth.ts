import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import { LoginRequest, AuthResponse } from '../types';
import { CacheService } from './cacheservice';

const TOKEN_CACHE_KEY = 'token';

export const authService = {
    login: async (data: LoginRequest) => {
      const response = await apiClient.post<AuthResponse>(endpoints.auth.login, data);
      // Store the token in cache
      await CacheService.setItem(TOKEN_CACHE_KEY, response.token);
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
      // Remove token from cache
      await CacheService.removeItem(TOKEN_CACHE_KEY);
    },

    // Helper method to get token
    getToken: () => CacheService.getItem<string>(TOKEN_CACHE_KEY),
};
  