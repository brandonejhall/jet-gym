import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  Alert,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WorkoutDTO } from '@/api/types';
import { workoutService } from '../api/services/workout';
import { CacheService } from '../api/services/cacheservice';

interface WorkoutCardProps {
  workout: WorkoutDTO;
  onPress: (workout: WorkoutDTO) => void;
  onDelete: (workoutId: number) => void;
}

interface WorkoutListProps {
  workouts: WorkoutDTO[];
  onWorkoutPress: (workout: WorkoutDTO) => void;
  onDeleteWorkout: (workoutId: number) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onPress, onDelete }) => {
  const handleDeletePress = async () => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
            try {
              const userId = await CacheService.getItem<string>('userId');
              if (!userId) throw new Error('User ID not found');
              await workoutService.deleteWorkout({ userId: parseInt(userId), workoutId: workout.id ?? 0 });
              onDelete(workout.id || 0);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete workout.');
            }
          }
        },
      ]
    );
  };

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteAction}
      onPress={handleDeletePress}
    >
      <MaterialCommunityIcons name="delete" size={24} color="white" />
      <Text style={styles.deleteActionText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(workout)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.workoutName}>{workout.name}</Text>
          </View>
          <Text style={styles.workoutDate}>{new Date(workout.date || '').toLocaleDateString()}</Text>
        </View>

        <View
          style={[
            styles.pill,
            workout.completed ? styles.completedPill : styles.inProgressPill,
          ]}
        >
          <Text style={styles.pillText}>
            {workout.completed ? 'Completed' : 'In Progress'}
          </Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.exerciseCount}>
            <MaterialCommunityIcons name="dumbbell" size={16} color="#7f8c8d" />
            <Text style={styles.exerciseCountText}>
              {workout.exercises?.length || 0} exercises
            </Text>
          </View>
          <MaterialCommunityIcons 
            name="chevron-right" 
            size={20} 
            color="#95a5a6" 
          />
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const WorkoutList: React.FC<WorkoutListProps> = ({ workouts, onWorkoutPress, onDeleteWorkout }) => {
  return (
    <FlatList
      data={workouts}
      keyExtractor={(item) => (item.id || 0).toString()}
      renderItem={({ item }) => (
        <WorkoutCard
          workout={item}
          onPress={onWorkoutPress}
          onDelete={onDeleteWorkout}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  workoutDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginTop: 6,
    marginBottom: 12,
  },
  completedPill: {
    backgroundColor: '#27ae60', // green
  },
  inProgressPill: {
    backgroundColor: '#e74c3c', // red
  },
  pillText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseCountText: {
    marginLeft: 6,
    color: '#7f8c8d',
    fontSize: 14,
  },
  deleteAction: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '90%',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'column',
  },
  deleteActionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});

export default WorkoutList;