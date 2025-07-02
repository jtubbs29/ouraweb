import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Heart, 
  Activity, 
  Thermometer,
  TrendingUp,
  Battery,
  Zap,
  Moon
} from 'lucide-react';
import { useOuraData } from '../../hooks/useOuraData';
import { 
  getScoreColor, 
  readinessDataToChartPoints,
  calculateAverageScore
} from '../../utils/dataHelpers';
import DateRangeSelector, { DateRange } from '../DateRange/DateRangeSelector';
import MetricCard from '../UI/MetricCard';
import ChartContainer from '../UI/ChartContainer';
import LoadingSpinner from '../UI/LoadingSpinner';
import { subDays } from 'date-fns';

const Readiness: React.FC = () => {
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
          <p className="text-error-600 mb-4">Error loading readiness data: {error}</p>
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

  const readinessData = filteredData.readinessData;
  
  if (readinessData.length === 0) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-600 mb-2">No Readiness Data</h2>
          <p className="text-slate-500">No readiness data available for the selected date range.</p>
        </div>
      </div>
    );
  }

  // Calculate averages and metrics
  const avgReadinessScore = calculateAverageScore(readinessData.map(d => d.score));
  const avgActivityBalance = calculateAverageScore(readinessData.map(d => d.contributors.activity_balance));
  const avgSleepBalance = calculateAverageScore(readinessData.map(d => d.contributors.sleep_balance));
  const avgHrvBalance = calculateAverageScore(readinessData.map(d => d.contributors.hrv_balance));
  const avgRestingHR = calculateAverageScore(readinessData.map(d => d.contributors.resting_heart_rate));
  const avgRecoveryIndex = calculateAverageScore(readinessData.map(d => d.contributors.recovery_index));
  const avgBodyTemp = readinessData.length > 0
    ? Math.round((readinessData.reduce((sum, d) => sum + d.temperature_deviation, 0) / readinessData.length) * 10) / 10
    : 0;
  const avgPreviousDayActivity = calculateAverageScore(readinessData.map(d => d.contributors.previous_day_activity));

  // Prepare chart data
  const readinessScoreChart = readinessDataToChartPoints(readinessData);
  
  const contributorsChart = [
    { date: 'Activity Balance', value: avgActivityBalance, label: `Activity Balance: ${avgActivityBalance}` },
    { date: 'Sleep Balance', value: avgSleepBalance, label: `Sleep Balance: ${avgSleepBalance}` },
    { date: 'HRV Balance', value: avgHrvBalance, label: `HRV Balance: ${avgHrvBalance}` },
    { date: 'Recovery Index', value: avgRecoveryIndex, label: `Recovery Index: ${avgRecoveryIndex}` },
    { date: 'Previous Day Activity', value: avgPreviousDayActivity, label: `Previous Day Activity: ${avgPreviousDayActivity}` }
  ];

  const hrvChart = readinessData.slice(-14).map(item => ({
    date: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.contributors.hrv_balance,
    label: `HRV Balance: ${item.contributors.hrv_balance}`
  }));

  const tempChart = readinessData.slice(-14).map(item => ({
    date: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.temperature_deviation,
    label: `Temperature Deviation: ${item.temperature_deviation.toFixed(1)}°C`
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
              🎯 Readiness Analysis
            </h1>
            <p className="text-slate-600">
              Recovery and readiness insights for {selectedDateRange.label.toLowerCase()}
            </p>
          </div>
          
          <DateRangeSelector 
            selectedRange={selectedDateRange}
            onRangeChange={setSelectedDateRange}
          />
        </div>

        {/* Data Stats */}
        <div className="flex items-center space-x-6 text-sm text-slate-600">
          <span>🎯 {stats.readinessDays} days analyzed</span>
          <span>⭐ Avg Score: {avgReadinessScore}</span>
          <span>💓 Avg Resting HR: {avgRestingHR} bpm</span>
          <span>🌡️ Avg Temp Deviation: {avgBodyTemp > 0 ? '+' : ''}{avgBodyTemp}°C</span>
        </div>
      </motion.div>

      {/* Main Readiness Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Readiness Score"
          value={avgReadinessScore}
          icon={<Target />}
          color={getScoreColor(avgReadinessScore) as 'primary' | 'success' | 'warning' | 'error'}
        />
        
        <MetricCard
          title="Resting Heart Rate"
          value={avgRestingHR}
          unit="bpm"
          icon={<Heart />}
          color="primary"
        />
        
        <MetricCard
          title="HRV Balance"
          value={avgHrvBalance}
          icon={<Zap />}
          color={getScoreColor(avgHrvBalance) as 'primary' | 'success' | 'warning' | 'error'}
        />
        
        <MetricCard
          title="Body Temperature"
          value={`${avgBodyTemp > 0 ? '+' : ''}${avgBodyTemp}`}
          unit="°C"
          icon={<Thermometer />}
          color={Math.abs(avgBodyTemp) <= 0.5 ? 'success' : Math.abs(avgBodyTemp) <= 1.0 ? 'warning' : 'error'}
        />
      </div>

      {/* Readiness Contributors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Activity Balance"
          value={avgActivityBalance}
          icon={<Activity />}
          color={getScoreColor(avgActivityBalance) as 'primary' | 'success' | 'warning' | 'error'}
        />
        
        <MetricCard
          title="Sleep Balance"
          value={avgSleepBalance}
          icon={<Moon />}
          color={getScoreColor(avgSleepBalance) as 'primary' | 'success' | 'warning' | 'error'}
        />
        
        <MetricCard
          title="Recovery Index"
          value={avgRecoveryIndex}
          icon={<Battery />}
          color={getScoreColor(avgRecoveryIndex) as 'primary' | 'success' | 'warning' | 'error'}
        />
        
        <MetricCard
          title="Previous Day Activity"
          value={avgPreviousDayActivity}
          icon={<TrendingUp />}
          color={getScoreColor(avgPreviousDayActivity) as 'primary' | 'success' | 'warning' | 'error'}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartContainer
          title="Readiness Score Over Time"
          data={readinessScoreChart}
          type="area"
          color="success"
          height={350}
        />
        
        <ChartContainer
          title="Readiness Contributors"
          data={contributorsChart}
          type="bar"
          color="primary"
          height={350}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="HRV Balance Trend (Last 14 Days)"
          data={hrvChart}
          type="line"
          color="oura"
          height={300}
        />
        
        {/* Readiness Insights */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            💡 Recovery Insights
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-700">Readiness Level</p>
                <p className="text-xs text-slate-600">
                  Your readiness score of {avgReadinessScore} indicates {
                    avgReadinessScore >= 85 ? 'optimal recovery - you\'re ready for challenges' :
                    avgReadinessScore >= 70 ? 'good recovery - moderate training is fine' :
                    avgReadinessScore >= 50 ? 'fair recovery - consider lighter activity' : 
                    'poor recovery - prioritize rest and recovery'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-700">HRV Balance</p>
                <p className="text-xs text-slate-600">
                  HRV score of {avgHrvBalance} suggests {
                    avgHrvBalance >= 75 ? 'excellent autonomic nervous system balance' :
                    avgHrvBalance >= 50 ? 'good stress recovery' :
                    'elevated stress levels - consider relaxation techniques'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-700">Activity Balance</p>
                <p className="text-xs text-slate-600">
                  Activity balance of {avgActivityBalance} indicates {
                    avgActivityBalance >= 75 ? 'optimal training load distribution' :
                    avgActivityBalance >= 50 ? 'balanced activity levels' :
                    'activity imbalance - review training intensity'
                  }
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-error-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-700">Temperature</p>
                <p className="text-xs text-slate-600">
                  {Math.abs(avgBodyTemp) <= 0.5 ? 'Normal temperature variation' :
                   Math.abs(avgBodyTemp) <= 1.0 ? 'Slightly elevated temperature - monitor for illness' :
                   'Significant temperature change - may indicate illness or stress'
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

export default Readiness;