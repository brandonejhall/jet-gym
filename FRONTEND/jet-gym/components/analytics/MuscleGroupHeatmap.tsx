import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface MuscleVolume {
  muscleVolumes: { [muscleGroup: string]: number };
  totalVolume: number;
}

interface MuscleGroupHeatmapProps {
  data: MuscleVolume;
  isLoading?: boolean;
}

export default function MuscleGroupHeatmap({ data, isLoading = false }: MuscleGroupHeatmapProps) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="human" size={24} color="#9b59b6" />
          <Text style={styles.title}>Muscle Group Volume</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading muscle group data...</Text>
        </View>
      </View>
    );
  }

  if (!data || !data.muscleVolumes || Object.keys(data.muscleVolumes).length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="human" size={24} color="#9b59b6" />
          <Text style={styles.title}>Muscle Group Volume</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="account-outline" size={48} color="#bdc3c7" />
          <Text style={styles.emptyText}>No muscle group data</Text>
          <Text style={styles.emptySubtext}>Complete workouts to see volume distribution</Text>
        </View>
      </View>
    );
  }

  // Calculate color intensity based on volume
  const getColorIntensity = (volume: number, maxVolume: number) => {
    if (maxVolume === 0) return 0.1;
    const intensity = volume / maxVolume;
    return Math.max(0.1, Math.min(1, intensity));
  };

  // Sort muscle groups by volume
  const muscleGroups = Object.entries(data.muscleVolumes)
    .sort(([, a], [, b]) => b - a);

  const maxVolume = Math.max(...Object.values(data.muscleVolumes));

  // Calculate percentages
  const totalVolume = data.totalVolume;
  const getPercentage = (volume: number) => {
    return totalVolume > 0 ? ((volume / totalVolume) * 100).toFixed(1) : '0';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="human" size={24} color="#9b59b6" />
        <Text style={styles.title}>Muscle Group Volume</Text>
        <View style={styles.totalVolume}>
          <Text style={styles.totalVolumeText}>{data.totalVolume.toLocaleString()}</Text>
          <Text style={styles.totalVolumeLabel}>lbs</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.heatmapContainer}>
          {muscleGroups.map(([muscleGroup, volume]) => {
            const intensity = getColorIntensity(volume, maxVolume);
            const percentage = getPercentage(volume);
            
            return (
              <View key={muscleGroup} style={styles.muscleGroupBlock}>
                <View 
                  style={[
                    styles.volumeBlock,
                    { 
                      backgroundColor: `rgba(155, 89, 182, ${intensity})`,
                      borderColor: intensity > 0.7 ? '#8e44ad' : 'transparent',
                      borderWidth: intensity > 0.7 ? 2 : 0,
                    }
                  ]}
                >
                  <Text style={[
                    styles.volumeText,
                    { color: intensity > 0.5 ? 'white' : '#2c3e50' }
                  ]}>
                    {volume.toLocaleString()}
                  </Text>
                  <Text style={[
                    styles.percentageText,
                    { color: intensity > 0.5 ? 'rgba(255,255,255,0.8)' : '#7f8c8d' }
                  ]}>
                    {percentage}%
                  </Text>
                </View>
                <Text style={styles.muscleGroupLabel}>
                  {muscleGroup.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Volume Intensity</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBlock, { backgroundColor: 'rgba(155, 89, 182, 0.2)' }]} />
            <Text style={styles.legendText}>Low</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBlock, { backgroundColor: 'rgba(155, 89, 182, 0.5)' }]} />
            <Text style={styles.legendText}>Medium</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBlock, { backgroundColor: 'rgba(155, 89, 182, 0.8)' }]} />
            <Text style={styles.legendText}>High</Text>
          </View>
        </View>
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
    flex: 1,
  },
  totalVolume: {
    alignItems: 'flex-end',
  },
  totalVolumeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#9b59b6',
  },
  totalVolumeLabel: {
    fontSize: 12,
    color: '#7f8c8d',
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
  heatmapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    minWidth: 300,
  },
  muscleGroupBlock: {
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
    minWidth: 80,
  },
  volumeBlock: {
    width: 80,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  volumeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  percentageText: {
    fontSize: 10,
    marginTop: 2,
  },
  muscleGroupLabel: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '500',
  },
  legendContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e8ed',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    alignItems: 'center',
  },
  legendBlock: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginBottom: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
}); 