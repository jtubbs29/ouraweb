import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MetricCardProps } from '../../types';

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit = '',
  icon,
  trend = 'neutral',
  trendValue = 0,
  color = 'primary'
}) => {
  const getColorClasses = (colorType: string) => {
    switch (colorType) {
      case 'success':
        return 'border-success-200 bg-success-50';
      case 'warning':
        return 'border-warning-200 bg-warning-50';
      case 'error':
        return 'border-error-200 bg-error-50';
      default:
        return 'border-primary-200 bg-primary-50';
    }
  };

  const getValueColorClasses = (colorType: string) => {
    switch (colorType) {
      case 'success':
        return 'text-success-700';
      case 'warning':
        return 'text-warning-700';
      case 'error':
        return 'text-error-700';
      default:
        return 'text-primary-700';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-success-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-error-600" />;
      default:
        return <Minus className="h-3 w-3 text-slate-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-success-600';
      case 'down':
        return 'text-error-600';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <motion.div
      className="metric-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {icon && (
            <div className={`p-2 rounded-lg ${getColorClasses(color)}`}>
              {React.cloneElement(icon as React.ReactElement, {
                className: `h-5 w-5 ${getValueColorClasses(color)}`
              })}
            </div>
          )}
          <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        </div>
        
        {/* Trend indicator */}
        {trendValue > 0 && (
          <div className="flex items-center space-x-1">
            {getTrendIcon()}
            <span className={`text-xs font-medium ${getTrendColor()}`}>
              {trendValue}%
            </span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-baseline space-x-2">
        <span className={`text-3xl font-bold ${getValueColorClasses(color)}`}>
          {typeof value === 'number' ? Math.round(value) : value}
        </span>
        {unit && (
          <span className="text-sm font-medium text-slate-500">{unit}</span>
        )}
      </div>

      {/* Progress bar for scores */}
      {typeof value === 'number' && value <= 100 && (
        <div className="mt-4">
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                color === 'success' ? 'bg-success-500' :
                color === 'warning' ? 'bg-warning-500' :
                color === 'error' ? 'bg-error-500' :
                'bg-primary-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0</span>
            <span>100</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MetricCard;