

export const API_URL = __DEV__ 
  ? process.env.DEV_ENDPOINT // Local development
  : process.env.PROD_ENDPOINT;   // Production