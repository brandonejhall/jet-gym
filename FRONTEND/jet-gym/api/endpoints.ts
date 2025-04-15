export const endpoints = {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
    },
    workout: {
      create: '/api/workout/create',
      update: '/api/workout/update',
      getUserWorkouts: (userId: string) => `/api/workout/userWorkouts/${userId}`,
      delete: '/api/workout/deleteWorkout',
      getWorkoutsByPeriod: (userId: string, period: string) => `/api/workout/userWorkouts/${userId}/${period}`,
    },
    exercise: {
      create: '/api/exercise/create',
      update: '/api/exercise/update',
      delete: '/api/exercise/delete',
      suggestions: '/api/exercise/suggestions',
      getByWorkout: (workoutId: string) => `/api/exercise/workoutExercises/${workoutId}`,
    },
    sets: {
      create: '/api/sets/create',
      update: '/api/sets/update',
      delete: '/api/sets/delete',
      getByExercise: (exerciseId: string) => `/api/sets/exerciseSets/${exerciseId}`,
    },

    // Add more endpoints as needed
  };