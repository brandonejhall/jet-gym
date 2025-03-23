import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AnalyticsWidget from '../../components/AnalyticsWidget';
import WeeklyStreak from '../../components/WeeklyStreak';
import Sidebar from '../../components/Sidebar';
import { router } from 'expo-router';
import { workoutService } from '../../api/services/workout';

const mockLastWorkout = {
  totalSets: 24,
  totalReps: 280,
  name: "Upper Body Power",
  date: "March 17, 2024"
};

const mockCompletedDays = [0, 2, 4]; // M, W, F completed
const mockCurrentStreak = 3;

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [lastWorkout, setLastWorkout] = useState(mockLastWorkout);
  const [loading, setLoading] = useState(false);
  const userId = 'current-user-id'; // You'll need to get this from your auth context

  const loadLastWorkout = async () => {
    try {
      setLoading(true);
      const workouts = await workoutService.getUserWorkouts(userId);
      if (workouts && workouts.length > 0) {
        const latest = workouts[0];
        setLastWorkout({
          totalSets: latest.exercises?.reduce((acc, ex) => acc + (ex.sets?.length || 0), 0) || 0,
          totalReps: latest.exercises?.reduce((acc, ex) => 
            acc + (ex.sets?.reduce((s, set) => s + set.value, 0) || 0), 0) || 0,
          name: latest.name,
          date: new Date(latest.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })
        });
      }
    } catch (error) {
      console.error('Failed to load last workout:', error);
      setLastWorkout(mockLastWorkout); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLastWorkout();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Alex</Text>
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
        <WeeklyStreak completedDays={mockCompletedDays} currentStreak={mockCurrentStreak} />
        
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