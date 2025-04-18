import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WorkoutDTO } from '@/api/types';

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
  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>, dragX: Animated.AnimatedInterpolation<number>) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => onDelete(workout.id || 0)}
      >
        <Animated.View
          style={[
            styles.deleteActionContent,
            { transform: [{ translateX: trans }] },
          ]}
        >
          <MaterialCommunityIcons name="delete" size={24} color="white" />
          <Text style={styles.deleteActionText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(workout)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            {workout.completed && (
              <View style={styles.completedTag}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#27ae60" />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            )}
          </View>
          <Text style={styles.workoutDate}>{workout.date}</Text>
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
  completedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  completedText: {
    color: '#27ae60',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  workoutDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
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
    alignItems: 'flex-end',
    marginBottom: 12,
    borderRadius: 12,
  },
  deleteActionContent: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});

export default WorkoutList;