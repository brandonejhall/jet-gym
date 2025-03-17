export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string;
  membershipStatus: 'free' | 'premium';
  joinDate: string;
}

export interface UserPreferences {
  weightUnit: 'kg' | 'lbs';
  distanceUnit: 'km' | 'mi';
  theme: 'light' | 'dark';
  notifications: boolean;
}