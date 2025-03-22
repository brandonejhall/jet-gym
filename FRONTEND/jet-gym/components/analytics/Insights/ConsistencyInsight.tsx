import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { ConsistencyInsight as ConsistencyInsightType } from '../../../types/analytics';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width - 32; // Accounting for padding

interface Props {
  data: ConsistencyInsightType;
}

export default function ConsistencyInsight({ data }: Props) {
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

  const chartData = {
    labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
    datasets: [{
      data: data.weeklyFrequency,
    }],
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="calendar-check" size={24} color="#3498db" />
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{data.title}</Text>
          <View style={styles.percentileBadge}>
            <Text style={styles.percentileText}>Top {data.percentile}%</Text>
          </View>
        </View>
      </View>

      <Text style={styles.summary}>{data.summary}</Text>

      <View style={styles.streakContainer}>
        <MaterialCommunityIcons name="fire" size={24} color="#e74c3c" />
        <Text style={styles.streakText}>{data.streakDays} Day Streak!</Text>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={180}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
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
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  percentileBadge: {
    backgroundColor: '#e8f8f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  percentileText: {
    color: '#27ae60',
    fontSize: 12,
    fontWeight: '600',
  },
  summary: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 16,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  streakText: {
    marginLeft: 8,
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
  chartContainer: {
    marginBottom: 16,
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