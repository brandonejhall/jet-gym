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
  id: number;
  name: string;
  trend: string;
  weeklyWeights: number[];
  progressRate: number;
  frequency: number;
  improvement: number;
  lastWeight: number;
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

export interface ConsistencyInsight {
  title: string;
  summary: string;
  percentile: number;
  streakDays: number;
  patternFindings: string;
  recommendation: string;
  weeklyFrequency: number[];
  consistencyScore: number;
}

export interface ProgressInsight {
  title: string;
  summary: string;
  keyExercises: ExerciseProgress[];
  recommendation: string;
}

export type MuscleStatus = "overworked" | "optimal" | "underworked";

export interface MuscleGroupStatus {
  name: string;
  status: MuscleStatus;
  warning: boolean;
}

export interface RecoveryInsight {
  title: string;
  summary: string;
  volumeChange: number;
  restDaysChange: number;
  muscleGroups: MuscleGroupStatus[];
  recommendation: string;
  restDayDistribution: number[];
}

interface InsightComponentMap {
  consistency: { data: ConsistencyInsight };
  progress: { data: ProgressInsight };
  recovery: { data: RecoveryInsight };
}

export interface InsightComponent {
  key: keyof InsightComponentMap;
  component: React.ComponentType<InsightComponentMap[keyof InsightComponentMap]>;
  data: InsightComponentMap[keyof InsightComponentMap]['data'];
}




