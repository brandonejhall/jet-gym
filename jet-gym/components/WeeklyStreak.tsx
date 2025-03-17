import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface WeeklyStreakProps {
  completedDays: number[];
  currentStreak: number;
}

const DAYS = [
  { key: 'mon', label: 'M' },
  { key: 'tue', label: 'T' },
  { key: 'wed', label: 'W' },
  { key: 'thu', label: 'T' },
  { key: 'fri', label: 'F' },
  { key: 'sat', label: 'S' },
  { key: 'sun', label: 'S' },
];

export default function WeeklyStreak({ completedDays, currentStreak }: WeeklyStreakProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weekly Progress</Text>
        <View style={styles.streakContainer}>
          <MaterialCommunityIcons name="fire" size={20} color="#e74c3c" />
          <Text style={styles.streakText}>{currentStreak} day streak</Text>
        </View>
      </View>

      <View style={styles.daysContainer}>
        {DAYS.map((day, index) => (
          <View key={day.key} style={styles.dayWrapper}>
            <Text style={styles.dayLabel}>{day.label}</Text>
            <View style={[
              styles.dayIndicator,
              completedDays.includes(index) && styles.completedDay
            ]} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    marginLeft: 4,
    color: '#2c3e50',
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dayWrapper: {
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  dayIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ecf0f1',
  },
  completedDay: {
    backgroundColor: '#3498db',
  },
});