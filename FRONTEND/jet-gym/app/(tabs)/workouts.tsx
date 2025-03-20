import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WorkoutList from '../../components/WorkoutList';
import WorkoutModal from '../../components/WorkoutModal';
import TimeFilter from '../../components/TimeFilter';
import { Workout, TimeFilter as TimeFilterType } from '../../../types';

// Mock data structure
const mockWorkouts = [
  {
    id: '1',
    name: 'Morning Power Session',
    date: '2024-03-17',
    exercises: [
      {
        id: '1',
        name: 'Bench Press',
        sets: [
          { id: '1', weight: 185, reps: 8, completed: true },
          { id: '2', weight: 185, reps: 8, completed: true },
          { id: '3', weight: 185, reps: 6, completed: true },
        ],
      },
      {
        id: '2',
        name: 'Barbell Row',
        sets: [
          { id: '1', weight: 165, reps: 10, completed: true },
          { id: '2', weight: 165, reps: 10, completed: true },
          { id: '3', weight: 165, reps: 8, completed: true },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Leg Day',
    date: '2024-03-15',
    exercises: [
      {
        id: '1',
        name: 'Squats',
        sets: [
          { id: '1', weight: 225, reps: 8, completed: true },
          { id: '2', weight: 225, reps: 8, completed: true },
        ],
      },
    ],
  },
];

export default function WorkoutManagementScreen() {
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('week');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts);

  const handleDeleteWorkout = (workoutId: string) => {
    setWorkouts(workouts.filter(w => w.id !== workoutId));
  };

  const handleAddWorkout = () => {
    const newWorkout: Workout = {
      id: String(Date.now()),
      name: 'New Workout',
      date: new Date().toISOString().split('T')[0],
      exercises: [],
    };
    setWorkouts([newWorkout, ...workouts]);
    setSelectedWorkout(newWorkout);
  };

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