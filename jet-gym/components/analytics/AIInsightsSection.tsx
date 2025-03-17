import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { TimeFilter, AIInsight, AIInsightsSectionProps, AIInsightIcon } from '../../types';

const CARD_WIDTH = Dimensions.get('window').width * 0.8;

const insights = [
  {
    id: '1',
    title: 'Workout Consistency',
    observation: 'You workout most consistently on Mondays and Wednesdays',
    recommendation: 'Consider adding a Friday session to optimize your routine',
    icon: 'calendar-check',
    color: '#3498db',
  },
  {
    id: '2',
    title: 'Strength Progress',
    observation: 'Your bench press has increased 15% in the last month',
    recommendation: 'You might be ready to increase weight by 5-10 lbs',
    icon: 'trending-up',
    color: '#2ecc71',
  },
  {
    id: '3',
    title: 'Recovery Pattern',
    observation: 'You perform better with 48h rest between chest workouts',
    recommendation: 'Maintain this rest pattern for optimal gains',
    icon: 'battery-charging',
    color: '#e74c3c',
  },
  {
    id: '4',
    title: 'Muscle Balance',
    observation: 'Lower body exercises are 20% below target ratio',
    recommendation: 'Add more leg-focused exercises to your routine',
    icon: 'scale-balance',
    color: '#9b59b6',
  },
];

interface InsightCardProps {
  insight: typeof insights[0];
  index: number;
}

const getIcon = (icon: AIInsightIcon): AIInsightIcon => icon;

const InsightCard = ({ insight, index }: InsightCardProps) => (
  <Animated.View 
    entering={FadeInRight.delay(index * 100)}
    style={[styles.insightCard, { borderLeftColor: insight.color }]}
  >
    <View style={styles.insightHeader}>
      <MaterialCommunityIcons 
        name={getIcon(insight.icon)} 
        size={24} 
        color={insight.color} 
      />
      <Text style={styles.insightTitle}>{insight.title}</Text>
    </View>
    <Text style={styles.observation}>{insight.observation}</Text>
    <View style={styles.recommendationContainer}>
      <MaterialCommunityIcons name="lightbulb-on" size={16} color="#f39c12" />
      <Text style={styles.recommendation}>{insight.recommendation}</Text>
    </View>
  </Animated.View>
);

export default function AIInsightsSection({ timeFilter, insights }: AIInsightsSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="robot" size={24} color="#3498db" />
          <Text style={styles.sectionTitle}>JetGym AI Insights</Text>
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#3498db" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {insights.map((insight, index) => (
          <InsightCard key={insight.id} insight={insight} index={index} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionHeader: {
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
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  insightCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 8,
  },
  observation: {
    fontSize: 14,
    color: '#34495e',
    marginBottom: 12,
  },
  recommendationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff9e6',
    padding: 8,
    borderRadius: 8,
  },
  recommendation: {
    fontSize: 13,
    color: '#34495e',
    marginLeft: 6,
    flex: 1,
  },
});