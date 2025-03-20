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

const WorkoutCard = ({ workout, onPress, onDelete }) => {
  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
    });

    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={onDelete}
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
        onPress={onPress}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDate}>{workout.date}</Text>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.exerciseCount}>
            <MaterialCommunityIcons name="dumbbell" size={16} color="#7f8c8d" />
            <Text style={styles.exerciseCountText}>
              {workout.exercises.length} exercises
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

export default function WorkoutList({ workouts, onWorkoutPress, onDeleteWorkout }) {
  return (
    <FlatList
      data={workouts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <WorkoutCard
          workout={item}
          onPress={() => onWorkoutPress(item)}
          onDelete={() => onDeleteWorkout(item.id)}
        />
      )}
      contentContainerStyle={styles.list}
    />
  );
}

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
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
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