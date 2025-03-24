// Debug logging
console.log('DEV_ENDPOINT:', process.env.EXPO_PUBLIC_DEV_ENDPOINT);
console.log('PROD_ENDPOINT:', process.env.EXPO_PUBLIC_PROD_ENDPOINT);
console.log('Is Dev?:', __DEV__);

if (!process.env.EXPO_PUBLIC_DEV_ENDPOINT || !process.env.EXPO_PUBLIC_PROD_ENDPOINT) {
  console.warn('Environment variables not properly loaded');
}

export const API_URL = __DEV__ 
  ? process.env.EXPO_PUBLIC_DEV_ENDPOINT
  : process.env.EXPO_PUBLIC_PROD_ENDPOINT;

// Debug logging
console.log('Using API_URL:', API_URL);