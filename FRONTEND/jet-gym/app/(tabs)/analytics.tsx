import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TimeFilter } from '../../types';
import TimeFilterComponent from '../../components/TimeFilter';
import AIInsightsSection from '../../components/analytics/AIInsightsSection';
import MetricsSection from '../../components/analytics/MetricsSection';
import ProgressCharts from '../../components/analytics/ProgressCharts';
import ExerciseAnalysis from '../../components/analytics/ExerciseAnalysis';
import { 
  mockMetrics, 
  mockAIInsights, 
  mockExerciseProgress, 
  mockProgressChartData,
  mockStrengthProgress 
} from '../../data/mockAnalytics';
import { workoutService } from '../../api/services/workout';
import { exerciseService } from '../../api/services/exercise';

export default function AnalyticsScreen() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const userId = 'current-user-id'; // You'll need to get this from your auth context

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const workouts = await workoutService.getUserWorkouts(userId);
      
      // Process workout data for analytics
      // For now, we'll fall back to mock data since the actual data processing
      // logic would depend on your specific requirements
      
      // setMetrics(processedMetrics);
      // setProgressChartData(processedChartData);
      // etc.
      
    } catch (error) {
      console.error('Failed to load analytics:', error);
      // Fall back to mock data
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [timeFilter]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading your fitness insights...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Fitness Analytics</Text>
        <TouchableOpacity onPress={onRefresh}>
          <MaterialCommunityIcons name="refresh" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>

      <TimeFilterComponent selected={timeFilter} onSelect={setTimeFilter} />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <AIInsightsSection 
          timeFilter={timeFilter} 
          insights={mockAIInsights}
        />
        <MetricsSection 
          timeFilter={timeFilter} 
          metrics={mockMetrics}
        />
        <ProgressCharts 
          timeFilter={timeFilter}
          progressData={mockProgressChartData}
          strengthData={mockStrengthProgress}
        />
        <ExerciseAnalysis 
          timeFilter={timeFilter}
          exerciseProgress={mockExerciseProgress}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    color: '#2c3e50',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
  },
});