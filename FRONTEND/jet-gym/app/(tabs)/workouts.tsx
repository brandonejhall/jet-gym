import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WorkoutList from '../../components/WorkoutList';
import WorkoutModal from '../../components/WorkoutModal';
import TimeFilter from '../../components/TimeFilter';
import { Workout, TimeFilter as TimeFilterType } from '../../types';
import { workoutService } from '../../api/services/workout';
import { exerciseService } from '../../api/services/exercise';
import { WorkoutDTO } from '@/api/types';
import { CacheService } from '@/api/services/cacheservice';

// Mock data structure


export default function WorkoutManagementScreen() {
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('week');
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDTO | null>(null);
  const [workouts, setWorkouts] = useState<WorkoutDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = 1; // Changed to number to match DTO type

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const response: WorkoutDTO[] | null = await CacheService.getItem('workouts');
      setWorkouts(response || []);
    } catch (error) {
      console.error('Failed to load workouts:', error);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkout = async (workoutId: number) => {
    try {
      await workoutService.deleteWorkout({ userId, workoutId });
      setWorkouts(workouts.filter(w => w.id !== workoutId));
    } catch (error) {
      console.error('Failed to delete workout:', error);
    }
  };

  const handleAddWorkout = async () => {
    const newWorkout: WorkoutDTO = {
      userId,
      name: 'New Workout',
      date: new Date().toISOString(),
      notes: '',
      duration: 0,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      completed: false,
      exercises: []
    };

    try {
      const response = await workoutService.createWorkout(newWorkout);
      if (response) {
        setWorkouts([response, ...workouts]);
        setSelectedWorkout(response);
      }
    } catch (error) {
      console.error('Failed to create workout:', error);
      // Fallback to mock behavior
      const mockNewWorkout = {
        id: Date.now(),
        ...newWorkout
      };
      setWorkouts([mockNewWorkout, ...workouts]);
      setSelectedWorkout(mockNewWorkout);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <TimeFilter selected={timeFilter} onSelect={setTimeFilter} />
        
        <WorkoutList
          workouts={workouts}
          onWorkoutPress={setSelectedWorkout}
          onDeleteWorkout={handleDeleteWorkout}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddWorkout}
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>

        <WorkoutModal
          visible={!!selectedWorkout}
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
          onSave={(updatedWorkout) => {
            setWorkouts(workouts.map(w => 
              w.id === updatedWorkout.id ? updatedWorkout : w
            ));
            setSelectedWorkout(null);
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});