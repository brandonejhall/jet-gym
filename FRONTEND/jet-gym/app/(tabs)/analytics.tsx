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
import { analyticsService } from '../../api/services/analytics';
import {
  WorkoutConsistencyChart,
  PersonalRecordsSection,
  WeeklyVolumeChart,
  MuscleGroupHeatmap
} from '../../components/analytics';

interface AnalyticsData {
  workoutConsistency: { [weekNumber: number]: number } | null;
  personalRecords: any[] | null;
  weeklyVolume: any[] | null;
  muscleVolume: any | null;
}

export default function AnalyticsScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    workoutConsistency: null,
    personalRecords: null,
    weeklyVolume: null,
    muscleVolume: null,
  });
  const [error, setError] = useState<string | null>(null);
  
  // For now, using a hardcoded user ID - in a real app, this would come from auth context
  const userId = 1;
  const weeksBack = 7;

  const loadAnalytics = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Load all analytics data in parallel
      const [
        workoutConsistency,
        personalRecords,
        weeklyVolume,
        muscleVolume
      ] = await Promise.all([
        analyticsService.getWeeklyWorkoutCounts(userId, weeksBack).catch(err => {
          console.error('Error fetching workout consistency:', err);
          return null;
        }),
        analyticsService.getPersonalRecords(userId).catch(err => {
          console.error('Error fetching personal records:', err);
          return null;
        }),
        analyticsService.getWeeklyVolume(userId, weeksBack).catch(err => {
          console.error('Error fetching weekly volume:', err);
          return null;
        }),
        analyticsService.getMuscleVolume(userId).catch(err => {
          console.error('Error fetching muscle volume:', err);
          return null;
        }),
      ]);

      setAnalyticsData({
        workoutConsistency,
        personalRecords,
        weeklyVolume,
        muscleVolume,
      });
      
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  }, []);

  if (isLoading && !refreshing) {
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
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <MaterialCommunityIcons name="refresh" size={24} color="#3498db" />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={24} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Workout Consistency Chart */}
        <WorkoutConsistencyChart 
          data={analyticsData.workoutConsistency || {}}
          isLoading={isLoading}
        />

        {/* 2. Personal Records Section */}
        <PersonalRecordsSection 
          records={analyticsData.personalRecords || []}
          isLoading={isLoading}
        />

        {/* 3. Weekly Volume Chart */}
        <WeeklyVolumeChart 
          data={analyticsData.weeklyVolume || []}
          isLoading={isLoading}
        />

        {/* 4. Muscle Group Heatmap */}
        <MuscleGroupHeatmap 
          data={analyticsData.muscleVolume || { muscleVolumes: {}, totalVolume: 0 }}
          isLoading={isLoading}
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
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  refreshButton: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  errorText: {
    marginLeft: 8,
    color: '#e74c3c',
    fontSize: 14,
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});