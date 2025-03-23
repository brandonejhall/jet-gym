import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Minimal caching service for React Native apps
 */
export class CacheService {
  /**
   * Save data to cache with optional expiration
   */
  static async setItem(key: string, value: any, expiry: number = 24 * 60 * 60 * 1000): Promise<void> {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        expiry
      };
      await AsyncStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  /**
   * Get data from cache
   */
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      if (!data) return null;

      const item = JSON.parse(data);
      
      // Check if the data has expired
      if (Date.now() - item.timestamp > item.expiry) {
        await AsyncStorage.removeItem(key);
        return null;
      }
      
      return item.value as T;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  /**
   * Remove item from cache
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from cache:', error);
    }
  }

  /**
   * Get data from cache, or fetch it if not available/expired
   */
  static async getOrFetch<T>(key: string, fetchFn: () => Promise<T>, expiry?: number): Promise<T> {
    // Try to get from cache first
    const cachedData = await this.getItem<T>(key);
    
    if (cachedData !== null) {
      return cachedData;
    }
    
    // If not in cache or expired, fetch fresh data
    const freshData = await fetchFn();
    await this.setItem(key, freshData, expiry);
    return freshData;
  }
}