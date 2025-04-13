import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AnalyticsWidget from '../../components/AnalyticsWidget';
import WeeklyStreak from '../../components/WeeklyStreak';
import Sidebar from '../../components/Sidebar';
import { router } from 'expo-router';
import { CacheService } from '@/api/services/cacheservice';
import { UserData, WorkoutDTO } from '@/api/types';
import { authService } from '../../api/services/auth';

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
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(today.setDate(diff));
  };

  const loadLastWorkout = async () => {
    try {
      setLoading(true);
      const workouts = await authService.getWorkouts();
      if (workouts && workouts.length > 0) {
        const latest = workouts[0];
        setLastWorkout({
          totalSets: latest.exercises?.reduce((acc: number, ex: any) => acc + (ex.sets?.length || 0), 0) || 0,
          totalReps: latest.exercises?.reduce((acc: number, ex: any) => 
            acc + (ex.sets?.reduce((s: number, set: any) => s + set.value, 0) || 0), 0) || 0,
          name: latest.name,
          date: new Date(latest.date).toLocaleDateString('en-US', {
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
        const completedDays = workouts
          .filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate >= lastMonday && workout.completed;
          })
          .map(workout => new Date(workout.date).getDay());
        setCompletedDays(completedDays);
        
        // Calculate current streak
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 7; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          if (workouts.some(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate.toDateString() === checkDate.toDateString() && workout.completed;
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

  useEffect(() => {
    loadLastWorkout();
    loadUserData();
    calculateDaysCompleted();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={() => router.push('/workouts')}
        >
          <Text style={styles.startButtonText}>Start Workout</Text>
        </TouchableOpacity>
      </View>

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
  content: {
    flex: 1,
    paddingTop: 20,
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
});