import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RecoveryInsight as RecoveryInsightType } from '../../../types/analytics';

interface Props {
  data: RecoveryInsightType;
}

export default function RecoveryInsight({ data }: Props) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overworked': return '#e74c3c';
      case 'optimal': return '#27ae60';
      case 'underworked': return '#f39c12';
      default: return '#7f8c8d';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="battery-charging" size={24} color="#27ae60" />
        <Text style={styles.title}>{data.title}</Text>
      </View>

      <Text style={styles.summary}>{data.summary}</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Volume Change</Text>
          <View style={[
            styles.statBadge,
            { backgroundColor: data.volumeChange > 20 ? '#ffeaea' : '#e8f8f5' }
          ]}>
            <Text style={[
              styles.statValue,
              { color: data.volumeChange > 20 ? '#e74c3c' : '#27ae60' }
            ]}>
              {data.volumeChange > 0 ? '+' : ''}{data.volumeChange}%
            </Text>
          </View>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Rest Days Change</Text>
          <View style={[
            styles.statBadge,
            { backgroundColor: data.restDaysChange < 0 ? '#ffeaea' : '#e8f8f5' }
          ]}>
            <Text style={[
              styles.statValue,
              { color: data.restDaysChange < 0 ? '#e74c3c' : '#27ae60' }
            ]}>
              {data.restDaysChange > 0 ? '+' : ''}{data.restDaysChange}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.muscleGroupsContainer}>
        <Text style={styles.sectionTitle}>Muscle Group Status</Text>
        {data.muscleGroups.map((group) => (
          <View key={group.name} style={styles.muscleGroupItem}>
            <Text style={styles.muscleGroupName}>{group.name}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(group.status)}20` }
            ]}>
              <Text style={[
                styles.statusText,
                { color: getStatusColor(group.status) }
              ]}>
                {group.status}
              </Text>
              {group.warning && (
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={16}
                  color={getStatusColor(group.status)}
                  style={styles.warningIcon}
                />
              )}
            </View>
          </View>
        ))}
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 12,
  },
  summary: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    marginHorizontal: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  statBadge: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  muscleGroupsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  muscleGroupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  muscleGroupName: {
    fontSize: 14,
    color: '#2c3e50',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  warningIcon: {
    marginLeft: 4,
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