import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getWeek } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

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

  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });

  // Create data for all 52 weeks
  const fullYearData = Array.from({ length: 52 }, (_, i) => {
    const weekNumber = i + 1;
    return data[weekNumber] || 0;
  });

  const labels = Array.from({ length: 52 }, (_, i) => {
    const week = i + 1;
    // Show label for every 4th week to avoid clutter
    return week % 4 === 1 || week === 1 || week === 52 ? `W${week}` : '';
  });

  const chartData = {
    labels: labels,
    datasets: [{
      data: fullYearData,
    }],
  };
  
  // Find the maximum number of workouts in a week to set the Y-axis scale
  const maxWorkouts = Math.max(...fullYearData, 0);

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
      strokeWidth: 0.5,
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
    barPercentage: 0.5,
  };

  const totalWorkouts = Object.values(data).reduce((sum, count) => sum + count, 0);
  const averageWorkouts = totalWorkouts > 0 ? totalWorkouts / currentWeek : 0;
  
  const chartWidth = 52 * 30; // 52 weeks * 30px per bar

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
        <Text style={styles.chartTitle}>Yearly Workout Frequency</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <BarChart
            data={chartData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            fromZero={true}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1}
            showValuesOnTopOfBars={true}
            segments={maxWorkouts < 4 ? Math.max(1, maxWorkouts) : 4} // Dynamic segments
          />
        </ScrollView>
        <View style={styles.scrollIndicator}>
            <MaterialCommunityIcons name="arrow-left-right" size={12} color="#7f8c8d" />
            <Text style={styles.chartSubtitle}>Scroll to see more weeks</Text>
        </View>
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
    paddingRight: 10
  },
  scrollIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  chartSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginLeft: 4,
  },
}); 