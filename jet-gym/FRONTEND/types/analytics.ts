export interface MetricData {
  value: number;
  trend: string;
  isPositive: boolean;
}

export interface Metrics {
  totalWorkouts: MetricData;
  weeklyFrequency: MetricData;
  avgDuration: MetricData;
  personalRecords: MetricData;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }>;
}

export interface AIInsight {
  id: string;
  title: string;
  observation: string;
  recommendation: string;
  icon: AIInsightIcon;
  color: string;
}

export type TimeFilter = 'week' | 'month' | 'year' | 'all';

export type TrendDirection = 'up' | 'down' | 'stable';

export interface ExerciseProgress {
  id: string;
  name: string;
  frequency: number;
  improvement: number;
  lastWeight: string;
  trend: TrendDirection;
}

export interface AIInsightsSectionProps {
  timeFilter: TimeFilter;
  insights: AIInsight[];
}

export interface MetricsSectionProps {
  timeFilter: TimeFilter;
  metrics: Metrics;
}

export interface ProgressChartsProps {
  timeFilter: TimeFilter;
  progressData: ChartData;
  strengthData: ChartData;
}

export interface ExerciseAnalysisProps {
  timeFilter: TimeFilter;
  exerciseProgress: ExerciseProgress[];
}

export interface ExerciseCardProps {
  exercise: ExerciseProgress;
  index: number;
}

export type MetricIcon = 
  | 'dumbbell'
  | 'calendar-check'
  | 'clock-outline'
  | 'trophy';

export interface MetricCardProps {
  title: string;
  value: number | string;
  trend: string;
  isPositive: boolean;
  icon: MetricIcon;
}

export type AIInsightIcon = 
  | 'trending-up'
  | 'alert-circle'
  | 'lightbulb-on'
  | 'robot'
  | 'calendar-check'
  | 'scale-balance'
  | 'battery-charging';