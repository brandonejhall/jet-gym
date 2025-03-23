import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    // Handle 401 (Unauthorized)
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // Handle navigation to login if needed
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Generic API methods
export const apiClient = {
  get: <T>(url: string, params?: any) => api.get<any, T>(url, { params }),
  post: <T>(url: string, data?: any) => api.post<any, T>(url, data),
  put: <T>(url: string, data?: any) => api.put<any, T>(url, data),
  patch: <T>(url: string, data?: any) => api.patch<any, T>(url, data),
  delete: <T>(url: string, data?: any) => api.delete<any, T>(url, data),
};
