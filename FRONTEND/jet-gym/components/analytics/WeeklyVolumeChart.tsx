import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width - 32;

interface WeeklyVolume {
  week: string;
  volume: number;
  changeFromPreviousWeek: number;
}

interface WeeklyVolumeChartProps {
  data: WeeklyVolume[];
  isLoading?: boolean;
}

export default function WeeklyVolumeChart({ data, isLoading = false }: WeeklyVolumeChartProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="trending-up" size={24} color="#27ae60" />
          <Text style={styles.title}>Weekly Volume</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading volume data...</Text>
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="trending-up" size={24} color="#27ae60" />
          <Text style={styles.title}>Weekly Volume</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="chart-line" size={48} color="#bdc3c7" />
          <Text style={styles.emptyText}>No volume data available</Text>
          <Text style={styles.emptySubtext}>Complete workouts to see your volume trends</Text>
        </View>
      </View>
    );
  }

  // Filter out invalid data and create meaningful week labels
  const validData = data.filter(item => 
    item && 
    typeof item.volume === 'number' && 
    !isNaN(item.volume) && 
    item.volume >= 0
  );

  if (validData.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="trending-up" size={24} color="#27ae60" />
          <Text style={styles.title}>Weekly Volume</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="chart-line" size={48} color="#bdc3c7" />
          <Text style={styles.emptyText}>No valid volume data</Text>
          <Text style={styles.emptySubtext}>Complete workouts with weight and reps to see trends</Text>
        </View>
      </View>
    );
  }

  // Sort data chronologically - backend now provides proper date range labels
  const sortedData = [...validData].sort((a, b) => {
    // Since backend now returns date ranges like "Jul 1-7", we can sort by week order
    // The backend returns data in chronological order, so we can use the array index
    return 0; // Keep original order from backend
  });

  const chartData = {
    labels: sortedData.map(item => item.week), // Use the date range labels directly from backend
    datasets: [{
      data: sortedData.map(item => item.volume),
    }],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})`,
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

  // Calculate meaningful stats
  const totalVolume = sortedData.reduce((sum, item) => sum + item.volume, 0);
  const averageVolume = sortedData.length > 0 ? totalVolume / sortedData.length : 0;
  const latestData = sortedData[sortedData.length - 1];
  const latestChange = latestData ? latestData.changeFromPreviousWeek : 0;

  // Generate contextual insights
  const getInsights = () => {
    const insights = [];
    
    if (sortedData.length > 0) {
      const latestVolume = latestData.volume;
      const previousVolume = sortedData.length > 1 ? sortedData[sortedData.length - 2].volume : 0;
      
      if (latestVolume > 0) {
        if (previousVolume > 0) {
          const change = ((latestVolume - previousVolume) / previousVolume) * 100;
          if (change > 10) {
            insights.push("Great progress! Volume increased significantly");
          } else if (change > 0) {
            insights.push("Steady progress with volume increase");
          } else if (change > -10) {
            insights.push("Slight decrease in volume - consider recovery");
          } else {
            insights.push("Volume decreased - check your training plan");
          }
        } else {
          insights.push("Starting your volume tracking journey");
        }
      }
    }
    
    return insights;
  };

  const insights = getInsights();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="trending-up" size={24} color="#27ae60" />
        <Text style={styles.title}>Weekly Volume</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalVolume.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Volume</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{averageVolume.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Avg/Week</Text>
        </View>
        <View style={styles.statItem}>
          <View style={styles.changeContainer}>
            {latestChange !== 0 ? (
              <>
                <MaterialCommunityIcons 
                  name={latestChange >= 0 ? "trending-up" : "trending-down"} 
                  size={16} 
                  color={latestChange >= 0 ? "#27ae60" : "#e74c3c"} 
                />
                <Text style={[
                  styles.changeText, 
                  { color: latestChange >= 0 ? "#27ae60" : "#e74c3c" }
                ]}>
                  {Math.abs(latestChange).toFixed(1)}%
                </Text>
              </>
            ) : (
              <Text style={[styles.changeText, { color: "#7f8c8d" }]}>New</Text>
            )}
          </View>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
      </View>

      {insights.length > 0 && (
        <View style={styles.insightsContainer}>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightItem}>
              <MaterialCommunityIcons name="lightbulb-outline" size={16} color="#f39c12" />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Volume Trend</Text>
        <LineChart
          data={chartData}
          width={screenWidth - 32}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          fromZero={true}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={1}
        />
        <Text style={styles.chartSubtitle}>Total volume per week (lbs)</Text>
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 12,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 4,
    textAlign: 'center',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#27ae60',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  insightsContainer: {
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
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