import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProgressChartsProps } from '../../types';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const volumeData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    data: [20, 45, 28, 80, 99, 43, 50],
  }],
};

const muscleGroupData = {
  labels: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms'],
  datasets: [{
    data: [20, 45, 28, 80, 99],
  }],
};

export default function ProgressCharts({ timeFilter, progressData, strengthData }: ProgressChartsProps) {
  const [selectedMetric, setSelectedMetric] = useState('volume');

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Progress Charts</Text>
        <View style={styles.metricSelector}>
          <TouchableOpacity
            style={[
              styles.metricButton,
              selectedMetric === 'volume' && styles.metricButtonActive
            ]}
            onPress={() => setSelectedMetric('volume')}
          >
            <Text style={[
              styles.metricButtonText,
              selectedMetric === 'volume' && styles.metricButtonTextActive
            ]}>Volume</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.metricButton,
              selectedMetric === 'weight' && styles.metricButtonActive
            ]}
            onPress={() => setSelectedMetric('weight')}
          >
            <Text style={[
              styles.metricButtonText,
              selectedMetric === 'weight' && styles.metricButtonTextActive
            ]}>Weight</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Weekly Progress</Text>
        <LineChart
          data={volumeData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Muscle Group Focus</Text>
        <BarChart
          data={muscleGroupData}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          style={styles.chart}
          showValuesOnTopOfBars
          yAxisLabel=""
          yAxisSuffix=""
        />
      </View>
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
  metricSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    padding: 4,
  },
  metricButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  metricButtonActive: {
    backgroundColor: '#3498db',
  },
  metricButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  metricButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 16,
  },
});