import { format, isWithinInterval, parseISO } from 'date-fns';
import { 
  OuraSleepData, 
  OuraReadinessData, 
  OuraDailyActivityData, 
  ChartDataPoint,
  DateRange,
  DashboardSummary,
  SleepStageData
} from '../types';

// Filter data by date range with error handling
export const filterDataByDateRange = <T extends { day: string }>(
  data: T[], 
  dateRange: DateRange
): T[] => {
  try {
    // Validate inputs
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('filterDataByDateRange: No data provided or data is not an array');
      return [];
    }
    
    if (!dateRange || !dateRange.startDate || !dateRange.endDate) {
      console.warn('filterDataByDateRange: Invalid date range provided');
      return data; // Return all data if date range is invalid
    }

    return data.filter(item => {
      try {
        // Validate item has day property
        if (!item || typeof item.day !== 'string' || !item.day.trim()) {
          console.warn('filterDataByDateRange: Item missing valid day property', item);
          return false;
        }

        // Parse the date safely
        const itemDate = parseISO(item.day);
        
        // Check if date is valid
        if (isNaN(itemDate.getTime())) {
          console.warn('filterDataByDateRange: Invalid date format:', item.day);
          return false;
        }

        // Check if within interval
        return isWithinInterval(itemDate, {
          start: dateRange.startDate,
          end: dateRange.endDate
        });
      } catch (error) {
        console.warn('filterDataByDateRange: Error processing item:', item, error);
        return false;
      }
    });
  } catch (error) {
    console.error('filterDataByDateRange: Critical error:', error);
    return []; // Return empty array on critical error
  }
};

// Calculate average score with error handling
export const calculateAverageScore = (scores: number[]): number => {
  try {
    if (!Array.isArray(scores) || scores.length === 0) {
      return 0;
    }
    
    // Filter out invalid scores (NaN, null, undefined)
    const validScores = scores.filter(score => 
      typeof score === 'number' && 
      !isNaN(score) && 
      isFinite(score)
    );
    
    if (validScores.length === 0) {
      return 0;
    }
    
    const sum = validScores.reduce((sum, score) => sum + score, 0);
    return Math.round(sum / validScores.length);
  } catch (error) {
    console.error('calculateAverageScore: Error calculating average:', error);
    return 0;
  }
};

// Get score color based on value
export const getScoreColor = (score: number): string => {
  if (score >= 85) return 'success';
  if (score >= 70) return 'primary';
  if (score >= 50) return 'warning';
  return 'error';
};

// Get score status text
export const getScoreStatus = (score: number): string => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
};

// Convert sleep data to chart points with error handling
export const sleepDataToChartPoints = (data: OuraSleepData[]): ChartDataPoint[] => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('sleepDataToChartPoints: No data provided');
      return [];
    }

    return data.reduce((acc: ChartDataPoint[], item) => {
      try {
        if (!item || typeof item.day !== 'string' || typeof item.score !== 'number') {
          console.warn('sleepDataToChartPoints: Invalid item structure:', item);
          return acc;
        }

        const itemDate = parseISO(item.day);
        if (isNaN(itemDate.getTime())) {
          console.warn('sleepDataToChartPoints: Invalid date:', item.day);
          return acc;
        }

        if (isNaN(item.score) || !isFinite(item.score)) {
          console.warn('sleepDataToChartPoints: Invalid score:', item.score);
          return acc;
        }

        acc.push({
          date: format(itemDate, 'MMM d'),
          value: item.score,
          label: `Sleep Score: ${item.score}`
        });
        return acc;
      } catch (error) {
        console.warn('sleepDataToChartPoints: Error processing item:', item, error);
        return acc;
      }
    }, []);
  } catch (error) {
    console.error('sleepDataToChartPoints: Critical error:', error);
    return [];
  }
};

// Convert readiness data to chart points with error handling
export const readinessDataToChartPoints = (data: OuraReadinessData[]): ChartDataPoint[] => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('readinessDataToChartPoints: No data provided');
      return [];
    }

    return data.reduce((acc: ChartDataPoint[], item) => {
      try {
        if (!item || typeof item.day !== 'string' || typeof item.score !== 'number') {
          console.warn('readinessDataToChartPoints: Invalid item structure:', item);
          return acc;
        }

        const itemDate = parseISO(item.day);
        if (isNaN(itemDate.getTime())) {
          console.warn('readinessDataToChartPoints: Invalid date:', item.day);
          return acc;
        }

        if (isNaN(item.score) || !isFinite(item.score)) {
          console.warn('readinessDataToChartPoints: Invalid score:', item.score);
          return acc;
        }

        acc.push({
          date: format(itemDate, 'MMM d'),
          value: item.score,
          label: `Readiness Score: ${item.score}`
        });
        return acc;
      } catch (error) {
        console.warn('readinessDataToChartPoints: Error processing item:', item, error);
        return acc;
      }
    }, []);
  } catch (error) {
    console.error('readinessDataToChartPoints: Critical error:', error);
    return [];
  }
};

// Convert activity data to chart points with error handling
export const activityDataToChartPoints = (data: OuraDailyActivityData[]): ChartDataPoint[] => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('activityDataToChartPoints: No data provided');
      return [];
    }

    return data.reduce((acc: ChartDataPoint[], item) => {
      try {
        if (!item || typeof item.day !== 'string' || typeof item.score !== 'number') {
          console.warn('activityDataToChartPoints: Invalid item structure:', item);
          return acc;
        }

        const itemDate = parseISO(item.day);
        if (isNaN(itemDate.getTime())) {
          console.warn('activityDataToChartPoints: Invalid date:', item.day);
          return acc;
        }

        if (isNaN(item.score) || !isFinite(item.score)) {
          console.warn('activityDataToChartPoints: Invalid score:', item.score);
          return acc;
        }

        acc.push({
          date: format(itemDate, 'MMM d'),
          value: item.score,
          label: `Activity Score: ${item.score}`
        });
        return acc;
      } catch (error) {
        console.warn('activityDataToChartPoints: Error processing item:', item, error);
        return acc;
      }
    }, []);
  } catch (error) {
    console.error('activityDataToChartPoints: Critical error:', error);
    return [];
  }
};

// Calculate sleep stages from sleep session data
export const calculateSleepStages = (sleepData: OuraSleepData[]): SleepStageData[] => {
  if (sleepData.length === 0) return [];
  
  // Calculate averages from contributors
  const avgDeep = calculateAverageScore(sleepData.map(d => d.contributors.deep_sleep));
  const avgRem = calculateAverageScore(sleepData.map(d => d.contributors.rem_sleep));
  const avgLight = 100 - avgDeep - avgRem; // Approximate light sleep
  
  const totalSleep = avgDeep + avgRem + avgLight;
  
  return [
    {
      stage: 'deep',
      duration: avgDeep,
      percentage: Math.round((avgDeep / totalSleep) * 100)
    },
    {
      stage: 'rem',
      duration: avgRem,
      percentage: Math.round((avgRem / totalSleep) * 100)
    },
    {
      stage: 'light',
      duration: avgLight,
      percentage: Math.round((avgLight / totalSleep) * 100)
    }
  ];
};

// Create dashboard summary from all data with error handling
export const createDashboardSummary = (
  sleepData: OuraSleepData[],
  readinessData: OuraReadinessData[],
  activityData: OuraDailyActivityData[]
): DashboardSummary => {
  try {
    // Safely extract scores with validation
    const sleepScores = Array.isArray(sleepData) 
      ? sleepData.filter(d => d && typeof d.score === 'number').map(d => d.score)
      : [];
    const readinessScores = Array.isArray(readinessData) 
      ? readinessData.filter(d => d && typeof d.score === 'number').map(d => d.score)
      : [];
    const activityScores = Array.isArray(activityData) 
      ? activityData.filter(d => d && typeof d.score === 'number').map(d => d.score)
      : [];
    
    // Calculate sleep efficiency and duration averages with validation
    const sleepEfficiencyScores = Array.isArray(sleepData) 
      ? sleepData.filter(d => d && d.contributors && typeof d.contributors.efficiency === 'number')
               .map(d => d.contributors.efficiency)
      : [];
    const sleepDurationScores = Array.isArray(sleepData) 
      ? sleepData.filter(d => d && d.contributors && typeof d.contributors.total_sleep === 'number')
               .map(d => d.contributors.total_sleep)
      : [];
    
    const avgEfficiency = calculateAverageScore(sleepEfficiencyScores);
    const avgTotalSleep = calculateAverageScore(sleepDurationScores);
    
    // Calculate activity metrics with validation
    let avgSteps = 0;
    let avgActiveCalories = 0;
    
    if (Array.isArray(activityData) && activityData.length > 0) {
      const validActivityData = activityData.filter(d => 
        d && 
        typeof d.steps === 'number' && 
        typeof d.active_calories === 'number' &&
        !isNaN(d.steps) && 
        !isNaN(d.active_calories)
      );
      
      if (validActivityData.length > 0) {
        avgSteps = Math.round(validActivityData.reduce((sum, d) => sum + d.steps, 0) / validActivityData.length);
        avgActiveCalories = Math.round(validActivityData.reduce((sum, d) => sum + d.active_calories, 0) / validActivityData.length);
      }
    }
    
    // Calculate readiness metrics with validation
    let avgRestingHR = 0;
    let avgBodyTemp = 0;
    
    if (Array.isArray(readinessData) && readinessData.length > 0) {
      const validRestingHRData = readinessData.filter(d => 
        d && 
        d.contributors && 
        typeof d.contributors.resting_heart_rate === 'number' &&
        !isNaN(d.contributors.resting_heart_rate)
      );
      
      if (validRestingHRData.length > 0) {
        avgRestingHR = Math.round(validRestingHRData.reduce((sum, d) => sum + d.contributors.resting_heart_rate, 0) / validRestingHRData.length);
      }
      
      const validTempData = readinessData.filter(d => 
        d && 
        typeof d.temperature_deviation === 'number' &&
        !isNaN(d.temperature_deviation)
      );
      
      if (validTempData.length > 0) {
        avgBodyTemp = Math.round((validTempData.reduce((sum, d) => sum + d.temperature_deviation, 0) / validTempData.length) * 10) / 10;
      }
    }
    
    const hrvScores = Array.isArray(readinessData) 
      ? readinessData.filter(d => d && d.contributors && typeof d.contributors.hrv_balance === 'number')
                   .map(d => d.contributors.hrv_balance)
      : [];
    const avgHrvBalance = calculateAverageScore(hrvScores);

    return {
      sleepScore: calculateAverageScore(sleepScores),
      readinessScore: calculateAverageScore(readinessScores),
      activityScore: calculateAverageScore(activityScores),
      sleepDuration: avgTotalSleep,
      sleepEfficiency: avgEfficiency,
      restingHeartRate: avgRestingHR,
      hrvScore: avgHrvBalance,
      bodyTemperature: avgBodyTemp,
      steps: avgSteps,
      activeCalories: avgActiveCalories
    };
  } catch (error) {
    console.error('createDashboardSummary: Critical error:', error);
    // Return safe default values
    return {
      sleepScore: 0,
      readinessScore: 0,
      activityScore: 0,
      sleepDuration: 0,
      sleepEfficiency: 0,
      restingHeartRate: 0,
      hrvScore: 0,
      bodyTemperature: 0,
      steps: 0,
      activeCalories: 0
    };
  }
};

// Format duration in hours and minutes
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${Math.round(value)}%`;
};

// Calculate trend between two values
export const calculateTrend = (current: number, previous: number): {
  direction: 'up' | 'down' | 'neutral';
  percentage: number;
} => {
  if (previous === 0) return { direction: 'neutral', percentage: 0 };
  
  const change = ((current - previous) / previous) * 100;
  
  if (Math.abs(change) < 1) return { direction: 'neutral', percentage: 0 };
  
  return {
    direction: change > 0 ? 'up' : 'down',
    percentage: Math.abs(Math.round(change))
  };
};

// Get latest data point
export const getLatestDataPoint = <T extends { day: string }>(data: T[]): T | null => {
  if (data.length === 0) return null;
  return data.sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime())[0];
};

// Group data by week
export const groupDataByWeek = <T extends { day: string }>(data: T[]): { [key: string]: T[] } => {
  return data.reduce((groups, item) => {
    const date = parseISO(item.day);
    const weekStart = format(date, 'yyyy-MM-dd');
    
    if (!groups[weekStart]) {
      groups[weekStart] = [];
    }
    groups[weekStart].push(item);
    
    return groups;
  }, {} as { [key: string]: T[] });
};

// Calculate moving average
export const calculateMovingAverage = (values: number[], windowSize: number = 7): number[] => {
  const result: number[] = [];
  
  for (let i = 0; i <= values.length - windowSize; i++) {
    const window = values.slice(i, i + windowSize);
    const average = window.reduce((sum, val) => sum + val, 0) / windowSize;
    result.push(Math.round(average));
  }
  
  return result;
};