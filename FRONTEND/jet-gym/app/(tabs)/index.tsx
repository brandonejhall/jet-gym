import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AnalyticsWidget from '../../components/AnalyticsWidget';
import WeeklyStreak from '../../components/WeeklyStreak';
import Sidebar from '../../components/Sidebar';
import { router } from 'expo-router';
import { CacheService } from '@/api/services/cacheservice';
import { UserData, WorkoutDTO } from '@/api/types';
import { authService } from '../../api/services/auth';
import MonthlyWorkoutCalendar from '../../components/MonthlyWorkoutCalendar';

const emptyWorkoutData = {
  totalSets: 0,
  totalReps: 0,
  name: "No recent workouts",
  date: "Start your first workout!"
};

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [lastWorkout, setLastWorkout] = useState(emptyWorkoutData);
  const [loading, setLoading] = useState(false);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [userData, setUserData] = useState<UserData | null>(null);
  const userId = 'current-user-id'; // You'll need to get this from your auth context

  const getLastMonday = () => {
    const today = new Date();
    const day = today.getDay();
    // Calculate days to subtract to get to Monday (1)
    // Sunday = 0, Monday = 1, Tuesday = 2, etc.
    const daysToSubtract = day === 0 ? 6 : day - 1; // If Sunday, subtract 6 to get to Monday
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysToSubtract);
    // Set time to start of day in local timezone
    lastMonday.setHours(0, 0, 0, 0);
    return lastMonday;
  };

  const loadLastWorkout = async () => {
    try {
      setLoading(true);
      const workouts = await authService.getWorkouts();
      if (workouts && workouts.length > 0) {
        // Sort workouts by date in descending order (most recent first) to ensure we get the latest
        const sortedWorkouts = workouts.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB.getTime() - dateA.getTime(); // Descending order
        });
        
        const latest = sortedWorkouts[0];
        
        // Fix timezone issue by using date-only parsing like in WorkoutList
        const dateString = latest.date?.slice(0, 10); // "2025-06-30"
        const [year, month, day] = dateString.split('-');
        const localDate = new Date(Number(year), Number(month) - 1, Number(day));
        
        setLastWorkout({
          totalSets: latest.exercises?.reduce((acc: number, ex: any) => acc + (ex.sets?.length || 0), 0) || 0,
          totalReps: latest.exercises?.reduce((acc: number, ex: any) => 
            acc + (ex.sets?.reduce((s: number, set: any) => s + set.value, 0) || 0), 0) || 0,
          name: latest.name,
          date: localDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })
        });
      } else {
        setLastWorkout(emptyWorkoutData);
      }
    } catch (error) {
      console.error('Failed to load last workout:', error);
      setLastWorkout(emptyWorkoutData);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    const user: UserData | null = await CacheService.getItem('userData');
    setUserData(user);
  }

  const calculateDaysCompleted = async () => {
    try {
      const workouts = await authService.getWorkouts();
      if (workouts && workouts.length > 0) {
        const lastMonday = getLastMonday();
        const lastMondayStr = lastMonday.toLocaleDateString('en-CA'); // YYYY-MM-DD format
        
        const completedDays = workouts
          .filter(workout => {
            // Use date-only comparison to avoid timezone issues
            const workoutDateStr = workout.date?.slice(0, 10);
            return workoutDateStr >= lastMondayStr && workout.completed;
          })
          .map(workout => {
            // Fix timezone issue by using local date parsing like in WorkoutList
            const dateString = workout.date?.slice(0, 10); // "2025-06-30"
            const [year, month, day] = dateString.split('-');
            const localDate = new Date(Number(year), Number(month) - 1, Number(day));
            
            // Convert Sunday = 0 to Sunday = 6, and shift all other days back by 1
            const dayOfWeek = localDate.getDay();
            const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            return adjustedDay;
          });
        
        setCompletedDays(completedDays);
        
        // Calculate current streak
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 7; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          const checkDateStr = checkDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format
          
          if (workouts.some(workout => {
            const workoutDateStr = workout.date?.slice(0, 10);
            return workoutDateStr === checkDateStr && workout.completed;
          })) {
            streak++;
          } else {
            break;
          }
        }
        
        setCurrentStreak(streak);
      } else {
        setCompletedDays([]);
        setCurrentStreak(0);
      }
    } catch (error) {
      console.error('Failed to calculate completed days:', error);
      setCompletedDays([]);
      setCurrentStreak(0);
    }
  };

  useFocusEffect(useCallback(() => {
    loadLastWorkout();
    loadUserData();
    calculateDaysCompleted();
  }, []));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {userData?.name}</Text>
            <Text style={styles.subGreeting}>Ready for today's workout?</Text>
          </View>
          <TouchableOpacity
            onPress={() => setSidebarVisible(true)}
            style={styles.menuButton}
          >
            <MaterialCommunityIcons name="menu" size={24} color="#2c3e50" />
          </TouchableOpacity>
        </View>

        <AnalyticsWidget lastWorkout={lastWorkout} />
        <WeeklyStreak completedDays={completedDays} currentStreak={currentStreak} />
        <MonthlyWorkoutCalendar />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => router.push('/workouts')}
          >
            <Text style={styles.startButtonText}>Start Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Sidebar 
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    padding: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subGreeting: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 4,
  },
  startButton: {
    backgroundColor: '#3498db',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  content: {
    paddingTop: 20,
  },
});