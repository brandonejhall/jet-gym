import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ConsistencyInsight from './Insights/ConsistencyInsight';
import ProgressInsight from './Insights/ProgressInsight';
import RecoveryInsight from './Insights/RecoveryInsight';
import { MuscleGroupStatus } from '@/types/analytics';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 32;

// Mock data for testing
const mockData = {
  consistencyInsight: {
    title: "Consistency Report",
    summary: "You've maintained a consistent 4-day workout pattern for 3 weeks straight.",
    percentile: 15,
    streakDays: 21,
    patternFindings: "When you miss Mondays, you're 70% more likely to skip Tuesday as well.",
    recommendation: "Try scheduling a shorter backup workout for Monday evenings.",
    weeklyFrequency: [4, 4, 4, 3, 4, 4, 4],
    consistencyScore: 92
  },
  progressInsight: {
    title: "Progressive Overload",
    summary: "Strong progress in squats, plateau detected in bench press.",
    keyExercises: [
      {
        id: 1,
        name: "Squat",
        trend: "increasing",
        weeklyWeights: [185, 190, 195, 200, 205],
        progressRate: 5,
        frequency: 3,
        improvement: 20,
        lastWeight: 205
      },
      {
        id: 2,
        name: "Bench Press",
        trend: "plateau",
        weeklyWeights: [165, 170, 170, 170],
        progressRate: 0,
        frequency: 3,
        improvement: 0,
        lastWeight: 170
      }
    ],
    recommendation: "Consider varying your rep ranges."
  },
  recoveryInsight: {
    title: "Recovery & Balance",
    summary: "Training volume increased but rest days decreased.",
    volumeChange: 30,
    restDaysChange: -50,
    muscleGroups: [
      { name: "Chest", status: "overworked", warning: true },
      { name: "Back", status: "optimal", warning: false },
      { name: "Legs", status: "underworked", warning: true }
    ] as MuscleGroupStatus[],
    recommendation: "Add an additional recovery day between chest workouts.",
    restDayDistribution: [1, 0, 1, 0, 0, 0, 1]
  }
};
const insights = [
  { key: 'consistency', component: ConsistencyInsight, data: mockData.consistencyInsight },
  { key: 'progress', component: ProgressInsight, data: mockData.progressInsight },
  { key: 'recovery', component: RecoveryInsight, data: mockData.recoveryInsight },
];

export default function AIInsightsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const position = event.nativeEvent.contentOffset.x;
    const index = Math.round(position / CARD_WIDTH);
    setActiveIndex(index);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * CARD_WIDTH,
      animated: true,
    });
    setActiveIndex(index);
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="robot" size={24} color="#3498db" />
          <Text style={styles.sectionTitle}>JetGym AI Insights</Text>
        </View>
        <View style={styles.navigationButtons}>
          <TouchableOpacity 
            style={[styles.navButton, activeIndex === 0 && styles.navButtonDisabled]}
            onPress={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
          >
            <MaterialCommunityIcons 
              name="chevron-left" 
              size={24} 
              color={activeIndex === 0 ? "#bdc3c7" : "#3498db"} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navButton, activeIndex === insights.length - 1 && styles.navButtonDisabled]}
            onPress={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === insights.length - 1}
          >
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={24} 
              color={activeIndex === insights.length - 1 ? "#bdc3c7" : "#3498db"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH}
        snapToAlignment="center"
        contentContainerStyle={styles.scrollContent}
      >
        {insights.map((insight, index) => (
          <View key={insight.key} style={styles.insightContainer}>
            <insight.component data={insight.data} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {insights.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
            style={styles.paginationDotContainer}
          >
            <Animated.View style={[
              styles.paginationDot,
              {
                opacity: scrollX.interpolate({
                  inputRange: [
                    (index - 1) * CARD_WIDTH,
                    index * CARD_WIDTH,
                    (index + 1) * CARD_WIDTH,
                  ],
                  outputRange: [0.4, 1, 0.4],
                  extrapolate: 'clamp',
                }),
                transform: [{
                  scale: scrollX.interpolate({
                    inputRange: [
                      (index - 1) * CARD_WIDTH,
                      index * CARD_WIDTH,
                      (index + 1) * CARD_WIDTH,
                    ],
                    outputRange: [1, 1.25, 1],
                    extrapolate: 'clamp',
                  }),
                }],
              },
            ]} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 8,
    marginLeft: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  insightContainer: {
    width: CARD_WIDTH,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  paginationDotContainer: {
    padding: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3498db',
    marginHorizontal: 4,
  },
});