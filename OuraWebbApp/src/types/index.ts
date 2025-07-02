// Oura API v2 Data Types
export interface OuraSleepData {
  id: string;
  contributors: {
    deep_sleep: number;
    efficiency: number;
    latency: number;
    rem_sleep: number;
    restfulness: number;
    timing: number;
    total_sleep: number;
  };
  day: string;
  score: number;
  timestamp: string;
}

export interface OuraSleepSession {
  id: string;
  bedtime_end: string;
  bedtime_start: string;
  day: string;
  deep_sleep_duration: number;
  efficiency: number;
  heart_rate: {
    interval: number;
    items: number[];
    timestamp: string;
  };
  hrv: {
    interval: number;
    items: number[];
    timestamp: string;
  };
  latency: number;
  light_sleep_duration: number;
  low_battery_alert: boolean;
  lowest_heart_rate: number;
  movement_30_sec: string;
  period: number;
  readiness: {
    contributors: {
      activity_balance: number;
      body_temperature: number;
      hrv_balance: number;
      previous_day_activity: number;
      previous_night_recovery: number;
      recovery_index: number;
      resting_heart_rate: number;
      sleep_balance: number;
    };
    score: number;
    temperature_deviation: number;
    temperature_trend_deviation: number;
  };
  rem_sleep_duration: number;
  restless_periods: number;
  sleep_phase_5_min: string;
  sleep_score_delta: number;
  time_in_bed: number;
  total_sleep_duration: number;
  type: string;
}

export interface OuraReadinessData {
  id: string;
  contributors: {
    activity_balance: number;
    body_temperature: number;
    hrv_balance: number;
    previous_day_activity: number;
    previous_night_recovery: number;
    recovery_index: number;
    resting_heart_rate: number;
    sleep_balance: number;
  };
  day: string;
  score: number;
  temperature_deviation: number;
  temperature_trend_deviation: number;
  timestamp: string;
}

export interface OuraDailyActivityData {
  id: string;
  class_5_min: string;
  score: number;
  active_calories: number;
  average_met_minutes: number;
  contributors: {
    meet_daily_targets: number;
    move_every_hour: number;
    recovery_time: number;
    stay_active: number;
    training_frequency: number;
    training_volume: number;
  };
  equivalent_walking_distance: number;
  high_activity_met_minutes: number;
  high_activity_time: number;
  inactivity_alerts: number;
  low_activity_met_minutes: number;
  low_activity_time: number;
  medium_activity_met_minutes: number;
  medium_activity_time: number;
  met: {
    interval: number;
    items: number[];
    timestamp: string;
  };
  meters_to_target: number;
  non_wear_time: number;
  resting_time: number;
  sedentary_met_minutes: number;
  sedentary_time: number;
  steps: number;
  target_calories: number;
  target_meters: number;
  total_calories: number;
  day: string;
  timestamp: string;
}

export interface OuraHeartRateData {
  bpm: number;
  source: string;
  timestamp: string;
}

// App-specific types
export interface DateRange {
  startDate: Date;
  endDate: Date;
  label: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface SleepStageData {
  stage: 'deep' | 'light' | 'rem' | 'awake';
  duration: number;
  percentage: number;
}

export interface ReadinessContributors {
  activityBalance: number;
  bodyTemperature: number;
  hrvBalance: number;
  previousDayActivity: number;
  previousNightRecovery: number;
  recoveryIndex: number;
  restingHeartRate: number;
  sleepBalance: number;
}

export interface DashboardSummary {
  sleepScore: number;
  readinessScore: number;
  activityScore: number;
  sleepDuration: number;
  sleepEfficiency: number;
  restingHeartRate: number;
  hrvScore: number;
  bodyTemperature: number;
  steps: number;
  activeCalories: number;
}

// Authentication types
export interface AuthState {
  isAuthenticated: boolean;
  sessionTimeout: number;
}

// Component props types
export interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

export interface ChartContainerProps {
  title: string;
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  type?: 'line' | 'bar' | 'area' | 'pie';
}

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}