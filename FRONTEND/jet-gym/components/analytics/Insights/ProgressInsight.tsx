import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { ProgressInsight as ProgressInsightType } from '../../../types/analytics';
import { Dimensions } from 'react-native';
import { ExerciseProgress } from '../../../types/analytics';

const screenWidth = Dimensions.get('window').width - 32;

interface Props {
  data: ProgressInsightType;
}

export default function ProgressInsight({ data }: Props) {
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(155, 89, 182, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  const renderExerciseProgress = (exercise: ExerciseProgress) => {
    const chartData = {
      labels: exercise.weeklyWeights.map((_, i) => `W${i + 1}`),
      datasets: [{
        data: exercise.weeklyWeights,
      }],
    };

    const getTrendColor = () => {
      switch (exercise.trend) {
        case 'increasing': return '#27ae60';
        case 'plateau': return '#f39c12';
        case 'decreasing': return '#e74c3c';
        default: return '#7f8c8d';
      }
    };

    return (
      <View key={exercise.name} style={styles.exerciseContainer}>
        <View style={styles.exerciseHeader}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <View style={[styles.trendBadge, { backgroundColor: `${getTrendColor()}20` }]}>
            <MaterialCommunityIcons
              name={exercise.trend === 'increasing' ? 'trending-up' : exercise.trend === 'decreasing' ? 'trending-down' : 'trending-neutral'}
              size={16}
              color={getTrendColor()}
            />
            <Text style={[styles.trendText, { color: getTrendColor() }]}>
              {exercise.progressRate > 0 ? `+${exercise.progressRate}` : exercise.progressRate} lbs/week
            </Text>
          </View>
        </View>

        <LineChart
          data={chartData}
          width={screenWidth - 64}
          height={120}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="chart-line-variant" size={24} color="#9b59b6" />
        <Text style={styles.title}>{data.title}</Text>
      </View>

      <Text style={styles.summary}>{data.summary}</Text>

      <View style={styles.exercisesContainer}>
        {data.keyExercises.map(renderExerciseProgress)}
      </View>

      <View style={styles.recommendationContainer}>
        <MaterialCommunityIcons name="lightbulb-on" size={20} color="#f39c12" />
        <Text style={styles.recommendation}>{data.recommendation}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 12,
  },
  summary: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 16,
  },
  exercisesContainer: {
    marginBottom: 16,
  },
  exerciseContainer: {
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  chart: {
    borderRadius: 16,
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9e6',
    padding: 12,
    borderRadius: 12,
  },
  recommendation: {
    flex: 1,
    marginLeft: 8,
    color: '#34495e',
    fontSize: 14,
  },
});