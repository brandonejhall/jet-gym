import { apiClient } from '../client';
import { endpoints } from '../endpoints';
import { CacheService } from './cacheservice';
import { ConsistencyInsight } from '../../types/analytics';

const ANALYTICS_CACHE_KEY = 'analytics';
const WORKOUTS_PER_WEEK_CACHE_KEY = 'workoutsPerWeek';
const CONSISTENCY_INSIGHT_CACHE_KEY = 'consistencyInsight';
const PERSONAL_RECORDS_CACHE_KEY = 'personalRecords';
const WEEKLY_VOLUME_CACHE_KEY = 'weeklyVolume';
const MUSCLE_VOLUME_CACHE_KEY = 'muscleVolume';

export interface WorkoutsPerWeekData {
  [weekNumber: number]: number;
}

export interface PersonalRecord {
  exercise: string;
  weight: number;
  reps: number;
  date: string;
  isNewPR: boolean;
}

export interface WeeklyVolume {
  week: string;
  volume: number;
  changeFromPreviousWeek: number;
}

export interface MuscleVolume {
  muscleVolumes: { [muscleGroup: string]: number };
  totalVolume: number;
}

export const analyticsService = {
  getWeeklyWorkoutCounts: async (userId: number, weeksBack: number = 7): Promise<WorkoutsPerWeekData> => {
    try {
      // Try to get from cache first
      const cachedData = await CacheService.getItem<WorkoutsPerWeekData>(`${WORKOUTS_PER_WEEK_CACHE_KEY}_${userId}_${weeksBack}`);
      if (cachedData) {
        return cachedData;
      }

      // If not in cache, fetch from API
      const response = await apiClient.get<WorkoutsPerWeekData>(
        `${endpoints.analytics.workoutsPerWeek}/${userId}?weeksBack=${weeksBack}`
      );

      // Store in cache
      await CacheService.setItem(`${WORKOUTS_PER_WEEK_CACHE_KEY}_${userId}_${weeksBack}`, response);
      
      return response;
    } catch (error) {
      console.error('Error fetching weekly workout counts:', error);
      throw error;
    }
  },

  getWorkoutsPerWeek: async (userId: number, weeksBack: number = 7): Promise<WorkoutsPerWeekData> => {
    try {
      // Try to get from cache first
      const cachedData = await CacheService.getItem<WorkoutsPerWeekData>(`${WORKOUTS_PER_WEEK_CACHE_KEY}_${userId}_${weeksBack}`);
      if (cachedData) {
        return cachedData;
      }

      // If not in cache, fetch from API
      const response = await apiClient.get<WorkoutsPerWeekData>(
        `${endpoints.analytics.workoutsPerWeek}/${userId}?weeksBack=${weeksBack}`
      );

      // Store in cache
      await CacheService.setItem(`${WORKOUTS_PER_WEEK_CACHE_KEY}_${userId}_${weeksBack}`, response);
      
      return response;
    } catch (error) {
      console.error('Error fetching workouts per week analytics:', error);
      throw error;
    }
  },

  getConsistencyInsight: async (userId: number, weeksBack: number = 7): Promise<ConsistencyInsight> => {
    try {
      // Try to get from cache first
      const cachedData = await CacheService.getItem<ConsistencyInsight>(`${CONSISTENCY_INSIGHT_CACHE_KEY}_${userId}_${weeksBack}`);
      if (cachedData) {
        return cachedData;
      }

      // If not in cache, fetch from API
      const response = await apiClient.get<ConsistencyInsight>(
        `${endpoints.analytics.consistencyInsight}/${userId}?weeksBack=${weeksBack}`
      );

      // Store in cache
      await CacheService.setItem(`${CONSISTENCY_INSIGHT_CACHE_KEY}_${userId}_${weeksBack}`, response);
      
      return response;
    } catch (error) {
      console.error('Error fetching consistency insight:', error);
      throw error;
    }
  },

  getPersonalRecords: async (userId: number): Promise<PersonalRecord[]> => {
    try {
      // Try to get from cache first
      const cachedData = await CacheService.getItem<PersonalRecord[]>(`${PERSONAL_RECORDS_CACHE_KEY}_${userId}`);
      if (cachedData) {
        return cachedData;
      }

      // If not in cache, fetch from API
      const response = await apiClient.get<PersonalRecord[]>(
        `${endpoints.analytics.personalRecords}/${userId}`
      );

      // Store in cache
      await CacheService.setItem(`${PERSONAL_RECORDS_CACHE_KEY}_${userId}`, response);
      
      return response;
    } catch (error) {
      console.error('Error fetching personal records:', error);
      throw error;
    }
  },

  getWeeklyVolume: async (userId: number, weeksBack: number = 7): Promise<WeeklyVolume[]> => {
    try {
      // Try to get from cache first
      const cachedData = await CacheService.getItem<WeeklyVolume[]>(`${WEEKLY_VOLUME_CACHE_KEY}_${userId}_${weeksBack}`);
      if (cachedData) {
        return cachedData;
      }

      // If not in cache, fetch from API
      const response = await apiClient.get<WeeklyVolume[]>(
        `${endpoints.analytics.weeklyVolume}/${userId}?weeksBack=${weeksBack}`
      );

      // Store in cache
      await CacheService.setItem(`${WEEKLY_VOLUME_CACHE_KEY}_${userId}_${weeksBack}`, response);
      
      return response;
    } catch (error) {
      console.error('Error fetching weekly volume:', error);
      throw error;
    }
  },

  getMuscleVolume: async (userId: number): Promise<MuscleVolume> => {
    try {
      // Try to get from cache first
      const cachedData = await CacheService.getItem<MuscleVolume>(`${MUSCLE_VOLUME_CACHE_KEY}_${userId}`);
      if (cachedData) {
        return cachedData;
      }

      // If not in cache, fetch from API
      const response = await apiClient.get<MuscleVolume>(
        `${endpoints.analytics.muscleVolume}/${userId}`
      );

      // Store in cache
      await CacheService.setItem(`${MUSCLE_VOLUME_CACHE_KEY}_${userId}`, response);
      
      return response;
    } catch (error) {
      console.error('Error fetching muscle volume:', error);
      throw error;
    }
  },

  // Clear analytics cache
  clearAnalyticsCache: async () => {
    await CacheService.removeItem(ANALYTICS_CACHE_KEY);
    // Note: In a more sophisticated implementation, you might want to track all analytics keys
    // For now, we'll just clear the main analytics cache
  },

  // Refresh analytics data (clear cache and fetch fresh data)
  refreshAnalytics: async (userId: number, weeksBack: number = 7): Promise<WorkoutsPerWeekData> => {
    await analyticsService.clearAnalyticsCache();
    return await analyticsService.getWorkoutsPerWeek(userId, weeksBack);
  },

  // Helper method to get cached analytics data
  getCachedAnalytics: () => CacheService.getItem<WorkoutsPerWeekData>(ANALYTICS_CACHE_KEY),
};
