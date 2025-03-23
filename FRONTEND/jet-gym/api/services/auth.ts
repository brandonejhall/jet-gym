import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import { LoginRequest, AuthResponse } from '../types';

export const authService = {
    login: (data: LoginRequest) => 
      apiClient.post<AuthResponse>(endpoints.auth.login, data),
      
    register: (data: any) => 
      apiClient.post<AuthResponse>(endpoints.auth.register, data),
      
    logout: () => 
      apiClient.post<void>(endpoints.auth.logout),
  };
  