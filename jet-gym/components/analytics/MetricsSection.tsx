import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MetricsSectionProps, MetricCardProps } from '../../types';

const metrics = {
  totalWorkouts: {
    value: 24,
    trend: '+3',
    isPositive: true,
  },
  weeklyFrequency: {
    value: '4.2',
    trend: '+0.5',
    isPositive: true,
  },
  avgDuration: {
    value: '52',
    trend: '-3',
    isPositive: false,
  },
  personalRecords: {
    value: 8,
    trend: '+2',
    isPositive: true,
  },
};

const MetricCard = ({ title, value, trend, isPositive, icon }: MetricCardProps) => (
  <Animated.View 
    entering={FadeIn}
    style={styles.metricCard}
  >
    <View style={styles.metricHeader}>
      <MaterialCommunityIcons name={icon} size={24} color="#3498db" />
      <View style={[styles.trendBadge, { backgroundColor: isPositive ? '#e8f8f5' : '#fdedec' }]}>
        <Text style={[styles.trendText, { color: isPositive ? '#27ae60' : '#e74c3c' }]}>
          {trend}
        </Text>
      </View>
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricTitle}>{title}</Text>
  </Animated.View>
);

export default function MetricsSection({ timeFilter, metrics }: MetricsSectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Key Metrics</Text>
      <View style={styles.metricsGrid}>
        <MetricCard
          title="Total Workouts"
          value={metrics.totalWorkouts.value}
          trend={metrics.totalWorkouts.trend}
          isPositive={metrics.totalWorkouts.isPositive}
          icon="dumbbell"
        />
        <MetricCard
          title="Weekly Frequency"
          value={metrics.weeklyFrequency.value}
          trend={metrics.weeklyFrequency.trend}
          isPositive={metrics.weeklyFrequency.isPositive}
          icon="calendar-check"
        />
        <MetricCard
          title="Avg Duration (min)"
          value={metrics.avgDuration.value}
          trend={metrics.avgDuration.trend}
          isPositive={metrics.avgDuration.isPositive}
          icon="clock-outline"
        />
        <MetricCard
          title="Personal Records"
          value={metrics.personalRecords.value}
          trend={metrics.personalRecords.trend}
          isPositive={metrics.personalRecords.isPositive}
          icon="trophy"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
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
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});