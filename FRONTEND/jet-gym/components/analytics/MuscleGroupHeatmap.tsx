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

  // Filter out invalid data
  const validMuscleGroups = Object.entries(data.muscleVolumes)
    .filter(([muscleGroup, volume]) => 
      muscleGroup && 
      typeof volume === 'number' && 
      !isNaN(volume) && 
      volume > 0
    );

  if (validMuscleGroups.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="human" size={24} color="#9b59b6" />
          <Text style={styles.title}>Muscle Group Volume</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="account-outline" size={48} color="#bdc3c7" />
          <Text style={styles.emptyText}>No valid muscle group data</Text>
          <Text style={styles.emptySubtext}>Complete workouts with weight and reps to see distribution</Text>
        </View>
      </View>
    );
  }

  // Sort muscle groups by volume
  const muscleGroups = validMuscleGroups.sort(([, a], [, b]) => b - a);
  const maxVolume = Math.max(...muscleGroups.map(([, volume]) => volume));

  // Calculate percentages and total volume
  const totalVolume = muscleGroups.reduce((sum, [, volume]) => sum + volume, 0);
  const getPercentage = (volume: number) => {
    return totalVolume > 0 ? ((volume / totalVolume) * 100).toFixed(1) : '0';
  };

  // Generate insights
  const getInsights = () => {
    const insights = [];
    
    if (muscleGroups.length === 1) {
      insights.push(`You focused on ${muscleGroups[0][0].toLowerCase()} training this period`);
    } else if (muscleGroups.length > 1) {
      const topGroup = muscleGroups[0];
      const topPercentage = parseFloat(getPercentage(topGroup[1]));
      
      if (topPercentage > 40) {
        insights.push(`${topGroup[0]} is your primary focus (${topPercentage}% of volume)`);
      } else if (topPercentage > 25) {
        insights.push(`Good balance with ${topGroup[0]} leading (${topPercentage}% of volume)`);
      } else {
        insights.push("Well-balanced training across muscle groups");
      }
      
      // Check for undertrained groups
      const lowVolumeGroups = muscleGroups.filter(([, volume]) => {
        const percentage = parseFloat(getPercentage(volume));
        return percentage < 10;
      });
      
      if (lowVolumeGroups.length > 0) {
        insights.push(`Consider adding more ${lowVolumeGroups.map(([group]) => group.toLowerCase()).join(', ')} training`);
      }
    }
    
    return insights;
  };

  const insights = getInsights();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="human" size={24} color="#9b59b6" />
        <Text style={styles.title}>Muscle Group Volume</Text>
        <View style={styles.totalVolume}>
          <Text style={styles.totalVolumeText}>{totalVolume.toLocaleString()}</Text>
          <Text style={styles.totalVolumeLabel}>lbs</Text>
        </View>
      </View>

      {/* Detailed breakdown */}
      <View style={styles.breakdownContainer}>
        <Text style={styles.breakdownTitle}>Volume Breakdown</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.breakdownScroll}
        >
          {muscleGroups.map(([muscleGroup, volume]) => {
            const percentage = getPercentage(volume);
            const intensity = volume / maxVolume;
            
            return (
              <View key={muscleGroup} style={styles.breakdownItem}>
                <View style={styles.breakdownHeader}>
                  <Text style={styles.muscleGroupName}>
                    {muscleGroup.replace(/([A-Z])/g, ' $1').trim()}
                  </Text>
                  <Text style={styles.volumeValue}>{volume.toLocaleString()} lbs</Text>
                </View>
                <View style={styles.percentageBar}>
                  <View 
                    style={[
                      styles.percentageFill,
                      { 
                        width: `${percentage}%` as any,
                        backgroundColor: `rgba(155, 89, 182, ${Math.max(0.3, intensity)})`
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.percentageText}>{percentage}%</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Visual heatmap */}
      <View style={styles.heatmapSection}>
        <Text style={styles.heatmapTitle}>Volume Distribution</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.heatmapContainer}>
            {muscleGroups.map(([muscleGroup, volume]) => {
              const intensity = volume / maxVolume;
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
      </View>

      {/* Insights */}
      {insights.length > 0 && (
        <View style={styles.insightsContainer}>
          <Text style={styles.insightsTitle}>Training Insights</Text>
          {insights.map((insight, index) => (
            <View key={index} style={styles.insightItem}>
              <MaterialCommunityIcons name="lightbulb-outline" size={16} color="#f39c12" />
              <Text style={styles.insightText}>{insight}</Text>
            </View>
          ))}
        </View>
      )}

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
  breakdownContainer: {
    marginBottom: 20,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  breakdownScroll: {
    paddingRight: 16,
  },
  breakdownItem: {
    marginRight: 16,
    minWidth: 120,
  },
  breakdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  muscleGroupName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  volumeValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9b59b6',
  },
  percentageBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  percentageFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentageText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  heatmapSection: {
    marginBottom: 20,
  },
  heatmapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
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
  muscleGroupLabel: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '500',
  },
  insightsContainer: {
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  insightsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
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