import { Metrics, AIInsight, ExerciseProgress, ChartData, AIInsightIcon } from '../../types';

export const mockMetrics: Metrics = {
  totalWorkouts: {
    value: 24,
    trend: '+4 vs last period',
    isPositive: true
  },
  weeklyFrequency: {
    value: 3.5,
    trend: '+0.5 vs last period',
    isPositive: true
  },
  avgDuration: {
    value: 52,
    trend: '-3 minutes vs last period',
    isPositive: false
  },
  personalRecords: {
    value: 5,
    trend: '+2 vs last period',
    isPositive: true
  }
};

export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    title: 'Workout Consistency',
    observation: 'You workout most consistently on Mondays and Wednesdays',
    recommendation: 'Consider adding a Friday session to optimize your routine',
    icon: 'calendar-check' as AIInsightIcon,
    color: '#3498db'
  },
  {
    id: '2',
    title: 'Recovery Notice',
    observation: 'Your chest exercises frequency has been high this week',
    recommendation: 'Consider focusing on legs or back tomorrow to allow chest muscles to recover.',
    icon: 'alert-circle' as const,
    color: '#FF9800'
  }
];

export const mockExerciseProgress: ExerciseProgress[] = [
  {
    id: '1',
    name: 'Bench Press',
    frequency: 12,
    improvement: 15,
    lastWeight: '80kg',
    trend: 'up' as const
  },
  {
    id: '2',
    name: 'Deadlift',
    frequency: 8,
    improvement: 25,
    lastWeight: '120kg',
    trend: 'up' as const
  },
  {
    id: '3',
    name: 'Squats',
    frequency: 10,
    improvement: -5,
    lastWeight: '90kg',
    trend: 'down' as const
  }
];

export const mockProgressChartData: ChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      data: [60, 45, 0, 50, 65, 40, 55], // workout duration in minutes
      color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
      strokeWidth: 2
    }
  ]
};

export const mockStrengthProgress: ChartData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      data: [80, 82.5, 85, 87.5], // bench press weight progression
      color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
      strokeWidth: 2
    }
  ]
}; 