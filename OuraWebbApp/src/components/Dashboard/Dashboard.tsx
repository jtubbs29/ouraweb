import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Target, 
  Activity, 
  Heart, 
  Footprints,
  Flame,
  TrendingUp
} from 'lucide-react';
import { useOuraData } from '../../hooks/useOuraData';
import { createDashboardSummary, getScoreColor } from '../../utils/dataHelpers';
import DateRangeSelector, { DateRange } from '../DateRange/DateRangeSelector';
import MetricCard from '../UI/MetricCard';
import ChartContainer from '../UI/ChartContainer';
import LoadingSpinner from '../UI/LoadingSpinner';
import { subDays } from 'date-fns';

const Dashboard: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    label: 'Last 30 days'
  });

  const { 
    filteredData, 
    isLoading, 
    error, 
    stats,
    lastUpdated 
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
          <p className="text-error-600 mb-4">Error loading data: {error}</p>
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

  const summary = createDashboardSummary(
    filteredData.sleepData,
    filteredData.readinessData,
    filteredData.activityData
  );

  // Prepare chart data
  const sleepChartData = filteredData.sleepData.slice(-14).map(item => ({
    date: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.score,
    label: `Sleep Score: ${item.score}`
  }));

  const readinessChartData = filteredData.readinessData.slice(-14).map(item => ({
    date: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.score,
    label: `Readiness Score: ${item.score}`
  }));

  const activityChartData = filteredData.activityData.slice(-14).map(item => ({
    date: new Date(item.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.score,
    label: `Activity Score: ${item.score}`
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
              Health Dashboard
            </h1>
            <p className="text-slate-600">
              Your personalized Oura Ring insights for {selectedDateRange.label.toLowerCase()}
            </p>
          </div>
          
          <DateRangeSelector 
            selectedRange={selectedDateRange}
            onRangeChange={setSelectedDateRange}
          />
        </div>

        {/* Data Stats */}
        <div className="flex items-center space-x-6 text-sm text-slate-600">
          <span>📊 {stats.totalDays} days of data</span>
          <span>😴 {stats.sleepDays} sleep records</span>
          <span>🎯 {stats.readinessDays} readiness records</span>
          <span>🏃 {stats.activityDays} activity records</span>
          {lastUpdated && (
            <span>🔄 Updated {new Date(lastUpdated).toLocaleDateString()}</span>
          )}
        </div>
      </motion.div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Sleep Score"
          value={summary.sleepScore}
          icon={<Moon />}
          color={getScoreColor(summary.sleepScore) as 'primary' | 'success' | 'warning' | 'error'}
        />
        
        <MetricCard
          title="Readiness Score"
          value={summary.readinessScore}
          icon={<Target />}
          color={getScoreColor(summary.readinessScore) as 'primary' | 'success' | 'warning' | 'error'}
        />
        
        <MetricCard
          title="Activity Score"
          value={summary.activityScore}
          icon={<Activity />}
          color={getScoreColor(summary.activityScore) as 'primary' | 'success' | 'warning' | 'error'}
        />
        
        <MetricCard
          title="Sleep Duration"
          value={`${Math.floor(summary.sleepDuration / 60)}h ${summary.sleepDuration % 60}m`}
          icon={<Moon />}
          color="primary"
        />
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Resting Heart Rate"
          value={summary.restingHeartRate}
          unit="bpm"
          icon={<Heart />}
          color="primary"
        />
        
        <MetricCard
          title="Sleep Efficiency"
          value={summary.sleepEfficiency}
          unit="%"
          icon={<TrendingUp />}
          color={getScoreColor(summary.sleepEfficiency) as 'primary' | 'success' | 'warning' | 'error'}
        />
        
        <MetricCard
          title="Daily Steps"
          value={summary.steps.toLocaleString()}
          icon={<Footprints />}
          color="success"
        />
        
        <MetricCard
          title="Active Calories"
          value={summary.activeCalories}
          unit="cal"
          icon={<Flame />}
          color="warning"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartContainer
          title="Sleep Score Trend (Last 14 Days)"
          data={sleepChartData}
          type="area"
          color="primary"
          height={300}
        />
        
        <ChartContainer
          title="Readiness Score Trend (Last 14 Days)"
          data={readinessChartData}
          type="line"
          color="success"
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Activity Score Trend (Last 14 Days)"
          data={activityChartData}
          type="bar"
          color="warning"
          height={300}
        />
        
        {/* Quick insights */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            💡 Quick Insights
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-700">Average Sleep Score</p>
                <p className="text-xs text-slate-600">
                  Your sleep score of {summary.sleepScore} is {
                    summary.sleepScore >= 85 ? 'excellent' :
                    summary.sleepScore >= 70 ? 'good' :
                    summary.sleepScore >= 50 ? 'fair' : 'needs improvement'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-700">Daily Activity</p>
                <p className="text-xs text-slate-600">
                  You're averaging {summary.steps.toLocaleString()} steps per day
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-warning-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-slate-700">Recovery Status</p>
                <p className="text-xs text-slate-600">
                  Your readiness score of {summary.readinessScore} indicates {
                    summary.readinessScore >= 85 ? 'optimal recovery' :
                    summary.readinessScore >= 70 ? 'good recovery' :
                    'you may need more rest'
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

export default Dashboard;