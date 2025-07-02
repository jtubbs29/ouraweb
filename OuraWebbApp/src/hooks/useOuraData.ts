import { useState, useEffect } from 'react';
import { OuraSleepData, OuraReadinessData, OuraDailyActivityData, DateRange } from '../types';
import { filterDataByDateRange } from '../utils/dataHelpers';
import { subDays } from 'date-fns';

interface OuraDataState {
  sleepData: OuraSleepData[];
  readinessData: OuraReadinessData[];
  activityData: OuraDailyActivityData[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

interface FilteredOuraData {
  sleepData: OuraSleepData[];
  readinessData: OuraReadinessData[];
  activityData: OuraDailyActivityData[];
}

export const useOuraData = (dateRange?: DateRange) => {
  const [data, setData] = useState<OuraDataState>({
    sleepData: [],
    readinessData: [],
    activityData: [],
    isLoading: true,
    error: null,
    lastUpdated: null
  });

  // Default date range: last 30 days
  const defaultDateRange: DateRange = {
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    label: 'Last 30 days'
  };

  const currentDateRange = dateRange || defaultDateRange;

  useEffect(() => {
    const loadOuraData = () => {
      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }));

        // Import the embedded data directly
        import('../data/oura_2024_2025_data.json').then(module => {
          const combinedData = module.default as any;
          if (!combinedData.sleep?.data || !combinedData.readiness?.data || !combinedData.activity?.data) {
            throw new Error('Invalid data format - missing required data arrays');
          }

          setData({
            sleepData: combinedData.sleep.data || [],
            readinessData: combinedData.readiness.data || [],
            activityData: combinedData.activity.data || [],
            isLoading: false,
            error: null,
            lastUpdated: combinedData.lastUpdated || null
          });

          console.log('✅ Oura data loaded successfully:', {
            sleep: combinedData.sleep.data.length,
            readiness: combinedData.readiness.data.length,
            activity: combinedData.activity.data.length
          });
        }).catch(error => {
          console.error('❌ Error loading Oura data:', error);
          setData(prev => ({
            ...prev,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to load data'
          }));
        });

      } catch (error) {
        console.error('❌ Error loading Oura data:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load data'
        }));
      }
    };

    loadOuraData();
  }, []);

  // Filter data based on date range with error handling
  const filteredData: FilteredOuraData = (() => {
    try {
      // Validate date range
      if (!currentDateRange || !currentDateRange.startDate || !currentDateRange.endDate) {
        console.warn('useOuraData: Invalid date range, returning unfiltered data');
        return {
          sleepData: data.sleepData || [],
          readinessData: data.readinessData || [],
          activityData: data.activityData || []
        };
      }

      // Check if date range is valid (start date before end date)
      if (currentDateRange.startDate > currentDateRange.endDate) {
        console.warn('useOuraData: Start date is after end date, swapping dates');
        const correctedDateRange = {
          ...currentDateRange,
          startDate: currentDateRange.endDate,
          endDate: currentDateRange.startDate
        };
        
        return {
          sleepData: filterDataByDateRange(data.sleepData, correctedDateRange),
          readinessData: filterDataByDateRange(data.readinessData, correctedDateRange),
          activityData: filterDataByDateRange(data.activityData, correctedDateRange)
        };
      }

      return {
        sleepData: filterDataByDateRange(data.sleepData, currentDateRange),
        readinessData: filterDataByDateRange(data.readinessData, currentDateRange),
        activityData: filterDataByDateRange(data.activityData, currentDateRange)
      };
    } catch (error) {
      console.error('useOuraData: Error filtering data by date range:', error);
      // Return unfiltered data on error
      return {
        sleepData: data.sleepData || [],
        readinessData: data.readinessData || [],
        activityData: data.activityData || []
      };
    }
  })();

  // Calculate stats with error handling
  const stats = (() => {
    try {
      const sleepDays = filteredData.sleepData?.length || 0;
      const readinessDays = filteredData.readinessData?.length || 0;
      const activityDays = filteredData.activityData?.length || 0;
      
      return {
        totalDays: Math.max(sleepDays, readinessDays, activityDays),
        sleepDays,
        readinessDays,
        activityDays
      };
    } catch (error) {
      console.error('useOuraData: Error calculating stats:', error);
      return {
        totalDays: 0,
        sleepDays: 0,
        readinessDays: 0,
        activityDays: 0
      };
    }
  })();

  return {
    ...data,
    filteredData,
    dateRange: currentDateRange,
    stats
  };
};