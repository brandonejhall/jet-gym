import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ExerciseAnalysisProps, ExerciseCardProps } from '../../../types';
import { TrendDirection } from '../../../types/analytics';

const exercises = [
  {
    id: '1',
    name: 'Bench Press',
    frequency: 12,
    improvement: 15,
    lastWeight: '185 lbs',
    trend: 'up',
  },
  {
    id: '2',
    name: 'Squats',
    frequency: 10,
    improvement: 20,
    lastWeight: '225 lbs',
    trend: 'up',
  },
  {
    id: '3',
    name: 'Deadlift',
    frequency: 8,
    improvement: -5,
    lastWeight: '275 lbs',
    trend: 'down',
  },
  {
    id: '4',
    name: 'Pull Ups',
    frequency: 15,
    improvement: 25,
    lastWeight: 'Body Weight',
    trend: 'up',
  },
];

const getTrendIcon = (trend: TrendDirection) => {
  switch (trend) {
    case 'up': return 'trending-up' as const;
    case 'down': return 'trending-down' as const;
    case 'stable': return 'trending-neutral' as const;
  }
};

const ExerciseCard = ({ exercise, index }: ExerciseCardProps) => (
  <Animated.View 
    entering={FadeInUp.delay(index * 100)}
    style={styles.exerciseCard}
  >
    <View style={styles.exerciseHeader}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <View style={[
        styles.trendBadge,
        { backgroundColor: exercise.trend === 'up' ? '#e8f8f5' : '#fdedec' }
      ]}>
        <MaterialCommunityIcons
          name={getTrendIcon(exercise.trend)}
          size={20}
          color={exercise.trend === 'up' ? '#27ae60' : '#e74c3c'}
        />
        <Text style={[
          styles.improvementText,
          { color: exercise.trend === 'up' ? '#27ae60' : '#e74c3c' }
        ]}>
          {exercise.improvement}%
        </Text>
      </View>
    </View>
    
    <View style={styles.exerciseStats}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Frequency</Text>
        <Text style={styles.statValue}>{exercise.frequency}x</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Last Weight</Text>
        <Text style={styles.statValue}>{exercise.lastWeight}</Text>
      </View>
    </View>
  </Animated.View>
);

export default function ExerciseAnalysis({ timeFilter, exerciseProgress }: ExerciseAnalysisProps) {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Exercise Analysis</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#3498db" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.exerciseList}>
        {exerciseProgress.map((exercise, index) => (
          <ExerciseCard key={exercise.id} exercise={exercise} index={index} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
  exerciseList: {
    paddingHorizontal: 16,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  improvementText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  exerciseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
});