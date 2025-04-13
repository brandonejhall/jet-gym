import { WorkoutDTO } from '@/api';
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CacheService } from '../api/services/cacheservice';

const CELL_SIZE = 32; // Fixed cell size
const CELL_MARGIN = 1;
const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MonthlyWorkoutCalendar: React.FC = () => {
  const [workouts, setWorkouts] = useState<WorkoutDTO[]>([]);

  useEffect(() => {
    const loadWorkouts = async () => {
      const cachedWorkouts = await CacheService.getItem<WorkoutDTO[]>('workouts');
      if (cachedWorkouts) {
        setWorkouts(cachedWorkouts);
      }
    };
    loadWorkouts();
  }, []);

  const calendarData = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    // Get first day of the month
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startingDayIndex = firstDay.getDay();

    // Get last day of the month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();

    // Calculate number of weeks needed
    const totalWeeks = Math.ceil((startingDayIndex + totalDays) / 7);

    // Generate calendar days array
    const days = Array.from({ length: totalWeeks * 7 }, (_, index) => {
      const dayNumber = index - startingDayIndex + 1;
      const isCurrentMonth = dayNumber > 0 && dayNumber <= totalDays;
      const date = isCurrentMonth 
        ? new Date(currentYear, currentMonth, dayNumber).toISOString().split('T')[0]
        : '';

      return {
        dayNumber: isCurrentMonth ? dayNumber : null,
        date,
        isToday: isCurrentMonth && dayNumber === currentDay,
        hasWorkout: isCurrentMonth && workouts.some(w => 
          w.date.startsWith(date) && w.completed
        )
      };
    });

    return {
      monthName: firstDay.toLocaleString('default', { month: 'long' }).toUpperCase(),
      days,
      totalWeeks
    };
  }, [workouts]);

  const calendarWidth = (CELL_SIZE + CELL_MARGIN * 2) * 7;

  return (
    <View style={styles.container}>
      <Text style={styles.monthTitle}>{calendarData.monthName}</Text>
      
      <View style={styles.calendarContainer}>
        <View style={[styles.weekDays, { width: calendarWidth }]}>
          {DAYS.map((day, index) => (
            <View 
              key={index} 
              style={[styles.dayLabelContainer, { width: CELL_SIZE + CELL_MARGIN * 2 }]}
            >
              <Text style={styles.weekDayLabel}>{day}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.calendar, { width: calendarWidth, height: (CELL_SIZE + CELL_MARGIN * 2) * calendarData.totalWeeks }]}>
          {calendarData.days.map((day, index) => (
            <View
              key={index}
              style={[
                styles.cell,
                {
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  margin: CELL_MARGIN,
                  backgroundColor: day.hasWorkout ? '#4096ff' : '#ebedf0',
                  opacity: day.dayNumber ? 1 : 0.3,
                  borderWidth: day.isToday ? 1 : 0,
                  borderColor: '#4096ff'
                }
              ]}
              accessibilityLabel={day.dayNumber 
                ? `${day.dayNumber} ${calendarData.monthName}${day.hasWorkout ? ', workout completed' : ''}`
                : ''
              }
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  monthTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  calendarContainer: {
    alignItems: 'center',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  dayLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayLabel: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  cell: {
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MonthlyWorkoutCalendar; 