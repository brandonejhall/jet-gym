import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AnalyticsWidget({ lastWorkout }) {
  return (
    <View style={styles.container}>
      <Text style={styles.widgetTitle}>Last Workout Stats</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="dumbbell" size={24} color="#3498db" />
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>{lastWorkout.totalSets}</Text>
            <Text style={styles.statLabel}>Sets</Text>
          </View>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons name="repeat" size={24} color="#3498db" />
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>{lastWorkout.totalReps}</Text>
            <Text style={styles.statLabel}>Reps</Text>
          </View>
        </View>
      </View>
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutName}>{lastWorkout.name}</Text>
        <Text style={styles.workoutDate}>{lastWorkout.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#2c3e50',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  statValueContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingLeft: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  workoutInfo: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  workoutDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
});