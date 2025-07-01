import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface PersonalRecord {
  exercise: string;
  weight: number;
  reps: number;
  date: string;
  isNewPR: boolean;
}

interface PersonalRecordsSectionProps {
  records: PersonalRecord[];
  isLoading?: boolean;
}

export default function PersonalRecordsSection({ records, isLoading = false }: PersonalRecordsSectionProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="trophy" size={24} color="#f39c12" />
          <Text style={styles.title}>Personal Records</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading personal records...</Text>
        </View>
      </View>
    );
  }

  if (!records || records.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="trophy" size={24} color="#f39c12" />
          <Text style={styles.title}>Personal Records</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="trophy-outline" size={48} color="#bdc3c7" />
          <Text style={styles.emptyText}>No personal records yet</Text>
          <Text style={styles.emptySubtext}>Complete workouts to start building your PRs!</Text>
        </View>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    // Parse date using local timezone to avoid timezone issues
    const [year, month, day] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="trophy" size={24} color="#f39c12" />
        <Text style={styles.title}>Personal Records</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{records.length}</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {records.map((record, index) => (
          <View key={`${record.exercise}-${index}`} style={styles.card}>
            {record.isNewPR && (
              <View style={styles.newPRBadge}>
                <Text style={styles.newPRText}>NEW!</Text>
              </View>
            )}
            
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons 
                name="dumbbell" 
                size={20} 
                color="#3498db" 
              />
              <Text style={styles.exerciseName}>{record.exercise}</Text>
            </View>

            <View style={styles.prValue}>
              <Text style={styles.weight}>{record.weight}</Text>
              <Text style={styles.unit}>lbs</Text>
              <Text style={styles.reps}>× {record.reps}</Text>
            </View>

            <View style={styles.cardFooter}>
              <MaterialCommunityIcons name="calendar" size={14} color="#7f8c8d" />
              <Text style={styles.date}>{formatDate(record.date)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
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
    flex: 1,
  },
  badge: {
    backgroundColor: '#f39c12',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  scrollContainer: {
    paddingRight: 16,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    position: 'relative',
  },
  newPRBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  newPRText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
    flex: 1,
  },
  prValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  weight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f39c12',
  },
  unit: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  reps: {
    fontSize: 16,
    color: '#34495e',
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
}); 