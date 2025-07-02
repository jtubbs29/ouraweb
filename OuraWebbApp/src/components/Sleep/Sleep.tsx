import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Clock, 
  Activity, 
  TrendingUp,
  Eye,
  Battery
} from 'lucide-react';
import { useOuraData } from '../../hooks/useOuraData';
import { 
  getScoreColor, 
  sleepDataToChartPoints,
  calculateAverageScore,
  formatDuration
} from '../../utils/dataHelpers';
import DateRangeSelector, { DateRange } from '../DateRange/DateRangeSelector';
import MetricCard from '../UI/MetricCard';
import ChartContainer from '../UI/ChartContainer';
import LoadingSpinner from '../UI/LoadingSpinner';
import { subDays } from 'date-fns';

const Sleep: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    label: 'Last 30 days'
  });

  const { 
    filteredData, 
    isLoading, 
    error, 
    stats 
  } = useOuraData(selectedDateRange);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-error-600 mb-4">Error loading sleep data: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const sleepData = filteredData.sleepData;
  
  if (sleepData.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Moon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-600 mb-2">No Sleep Data</h2>
          <p className="text-slate-500">No sleep data available for the selected date range.</p>
        </div>
      </div>
    );
  }

  // Calculate averages and metrics
  const avgSleepScore = calculateAverageScore(sleepData.map(d => d.score));
  const avgDeepSleep = calculateAverageScore(sleepData.map(d => d.contributors.deep_sleep));
  const avgRemSleep = calculateAverageScore(sleepData.map(d => d.contributors.rem_sleep));
  const avgLightSleep = 100 - avgDeepSleep - avgRemSleep;
  const avgEfficiency = calculateAverageScore(sleepData.map(d => d.contributors.efficiency));
  const avgLatency = calculateAverageScore(sleepData.map(d => d.contributors.latency));
  const avgTotalSleep = calculateAverageScore(sleepData.map(d => d.contributors.total_sleep));

  // Prepare chart data
  const sleepScoreChart = sleepDataToChartPoints(sleepData);
  
  const sleepStagesChart = [
    { date: 'Deep Sleep', value: avgDeepSleep, label: `${avgDeepSleep}% Deep Sleep` },
    { date: 'REM Sleep', value: avgRemSleep, label: `${avgRemSleep}% REM Sleep` },
    { date: 'Light Sleep', value: avgLightSleep, label: `${avgLightSleep}% Light Sleep` }
  ];

  const efficiencyChart = sleepData.slice(-14).map(item => ({
    date: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.contributors.efficiency,
    label: `Efficiency: ${item.contributors.efficiency}%`
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              😴 Sleep Analysis
            </h1>
            <p className="text-slate-600">
              Detailed insights into your sleep patterns for {selectedDateRange.label.toLowerCase()}
            </p>
          </div>
          
          <DateRangeSelector 
            selectedRange={selectedDateRange}
            onRangeChange={setSelectedDateRange}
          />
        </div>

        {/* Data Stats */}
        <div className="flex items-center space-x-6 text-sm text-slate-600">
          <span>🌙 {stats.sleepDays} nights analyzed</span>
          <span>⭐ Avg Score: {avgSleepScore}</span>
          <span>⏰ Avg Duration: {formatDuration(avgTotalSleep)}</span>
          <span>📊 Avg Efficiency: {avgEfficiency}%</span>
        </div>
      </motion.div>

      {/* Main Sleep Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Sleep Score"
          value={avgSleepScore}
          icon={<Moon />}
          color={getScoreColor(avgSleepScore) as 'primary' | 'success' | 'warning' | 'error'}
        />
        
        <MetricCard
          title="Sleep Duration"
          value={formatDuration(avgTotalSleep)}
          icon={<Clock />}
          color="primary"
        />
        
        <MetricCard
          title="Sleep Efficiency"
          value={avgEfficiency}
          unit="%"
          icon={<TrendingUp />}
          color={getScoreColor(avgEfficiency) as 'primary' | 'success' | 'warning' | 'error'}
        />
        
        <MetricCard
          title="Sleep Latency"
          value={avgLatency}
          unit="min"
          icon={<Eye />}
          color={avgLatency <= 15 ? 'success' : avgLatency <= 30 ? 'warning' : 'error'}
        />
      </div>

      {/* Sleep Stages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard
          title="Deep Sleep"
          value={avgDeepSleep}
          unit="%"
          icon={<Battery />}
          color={avgDeepSleep >= 20 ? 'success' : avgDeepSleep >= 15 ? 'warning' : 'error'}
        />
        
        <MetricCard
          title="REM Sleep"
          value={avgRemSleep}
          unit="%"
          icon={<Activity />}
          color={avgRemSleep >= 20 ? 'success' : avgRemSleep >= 15 ? 'warning' : 'error'}
        />
        
        <MetricCard
          title="Light Sleep"
          value={avgLightSleep}
          unit="%"
          icon={<Moon />}
          color="primary"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartContainer
          title="Sleep Score Over Time"
          data={sleepScoreChart}
          type="area"
          color="primary"
          height={350}
        />
        
        <ChartContainer
          title="Sleep Stages Distribution"
          data={sleepStagesChart}
          type="pie"
          color="primary"
          height={350}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Sleep Efficiency Trend (Last 14 Days)"
          data={efficiencyChart}
          type="line"
          color="success"
          height={300}
        />
        
        {/* Sleep Insights */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            💡 Sleep Insights
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-700">Sleep Quality</p>
                <p className="text-xs text-slate-600">
                  Your average sleep score of {avgSleepScore} is {
                    avgSleepScore >= 85 ? 'excellent - you\'re getting restorative sleep' :
                    avgSleepScore >= 70 ? 'good - consistent sleep patterns' :
                    avgSleepScore >= 50 ? 'fair - room for improvement' : 
                    'poor - consider sleep hygiene improvements'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-700">Deep Sleep</p>
                <p className="text-xs text-slate-600">
                  {avgDeepSleep}% deep sleep is {
                    avgDeepSleep >= 20 ? 'excellent for recovery' :
                    avgDeepSleep >= 15 ? 'good for most adults' :
                    'below optimal - focus on sleep quality'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-700">Sleep Efficiency</p>
                <p className="text-xs text-slate-600">
                  {avgEfficiency}% efficiency indicates {
                    avgEfficiency >= 85 ? 'optimal time in bed usage' :
                    avgEfficiency >= 75 ? 'good sleep consolidation' :
                    'room to improve sleep continuity'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-error-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-700">Sleep Latency</p>
                <p className="text-xs text-slate-600">
                  Taking {avgLatency} minutes to fall asleep is {
                    avgLatency <= 15 ? 'excellent - quick sleep onset' :
                    avgLatency <= 30 ? 'normal for most people' :
                    'longer than ideal - consider relaxation techniques'
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Sleep;