import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width - 32;

interface WorkoutConsistencyChartProps {
  data: { [weekNumber: number]: number };
  isLoading?: boolean;
}

export default function WorkoutConsistencyChart({ data, isLoading = false }: WorkoutConsistencyChartProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="calendar-check" size={24} color="#3498db" />
          <Text style={styles.title}>Workout Consistency</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading consistency data...</Text>
        </View>
      </View>
    );
  }

  // Convert data to chart format
  const weeks = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
  const chartData = {
    labels: weeks.map(week => `W${week}`),
    datasets: [{
      data: weeks.map(week => data[parseInt(week)] || 0),
    }],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 10,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      strokeWidth: 1,
      stroke: '#e1e8ed',
    },
    propsForVerticalLabels: {
      fontSize: 10,
      color: '#7f8c8d',
    },
    propsForHorizontalLabels: {
      fontSize: 10,
      color: '#7f8c8d',
    },
  };

  const totalWorkouts = Object.values(data).reduce((sum, count) => sum + count, 0);
  const averageWorkouts = weeks.length > 0 ? totalWorkouts / weeks.length : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="calendar-check" size={24} color="#3498db" />
        <Text style={styles.title}>Workout Consistency</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalWorkouts}</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{averageWorkouts.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg/Week</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Weekly Workout Frequency</Text>
        <BarChart
          data={chartData}
          width={screenWidth - 32}
          height={200}
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero={true}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1}
          showBarTops={true}
          showValuesOnTopOfBars={true}
        />
        <Text style={styles.chartSubtitle}>Number of workouts per week</Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 12,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  chartContainer: {
    marginBottom: 8,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 4,
  },
}); 