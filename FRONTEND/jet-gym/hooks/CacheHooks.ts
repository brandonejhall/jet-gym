import { useState, useEffect } from 'react';
import { CacheService } from '../api/services/cacheservice';

/**
 * Hook for using cached data with fetching
 */
export function useCachedData<T>(key: string, fetchFn: () => Promise<T>, initialValue?: T) {
  const [data, setData] = useState<T | undefined>(initialValue);
  const [loading, setLoading] = useState(true);

  const fetchData = async (forceRefresh = false) => {
    setLoading(true);
    try {
      if (forceRefresh) {
        const freshData = await fetchFn();
        setData(freshData);
        await CacheService.setItem(key, freshData);
      } else {
        const result = await CacheService.getOrFetch(key, fetchFn);
        setData(result);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [key]);

  return [data, loading, fetchData] as const;
}

/**
 * Hook for managing writable cached data
 */
export function useCachedState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialValue() {
      setLoading(true);
      const cachedValue = await CacheService.getItem<T>(key);
      if (cachedValue !== null) {
        setValue(cachedValue);
      }
      setLoading(false);
    }
    
    loadInitialValue();
  }, [key]);

  const updateValue = async (newValue: T) => {
    setValue(newValue);
    await CacheService.setItem(key, newValue);
  };

  return [value, updateValue, loading] as const;
}