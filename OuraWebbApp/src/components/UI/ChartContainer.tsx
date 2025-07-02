import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChartContainerProps } from '../../types';

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  data,
  height = 300,
  color = '#0ea5e9',
  type = 'line'
}) => {
  const colors = {
    primary: '#0ea5e9',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    oura: '#d946ef'
  };

  const chartColor = colors[color as keyof typeof colors] || color;

  // Validate and sanitize data
  const validData = React.useMemo(() => {
    try {
      if (!Array.isArray(data)) {
        console.warn('ChartContainer: Data is not an array:', data);
        return [];
      }

      return data.filter(item => {
        if (!item || typeof item !== 'object') {
          console.warn('ChartContainer: Invalid data item:', item);
          return false;
        }

        // Check for required properties based on chart type
        if (type === 'pie') {
          return typeof item.value === 'number' && !isNaN(item.value) && item.date;
        } else {
          return typeof item.value === 'number' && !isNaN(item.value) && item.date;
        }
      });
    } catch (error) {
      console.error('ChartContainer: Error validating data:', error);
      return [];
    }
  }, [data, type]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <p className="text-sm text-slate-600">
            <span className="font-medium" style={{ color: chartColor }}>
              {payload[0].value}
            </span>
          </p>
          {payload[0].payload.label && (
            <p className="text-xs text-slate-500">{payload[0].payload.label}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: validData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              fill="url(#areaGradient)"
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill={chartColor}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'pie':
        const COLORS = [
          colors.primary,
          colors.success,
          colors.warning,
          colors.error,
          colors.oura
        ];
        
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percentage }) => `${name}: ${percentage || value}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );

      default: // line chart
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={3}
              dot={{ fill: chartColor, strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, stroke: chartColor, strokeWidth: 2 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: chartColor }}
          />
          <span className="text-sm text-slate-500">
            {validData.length} data points
          </span>
        </div>
      </div>

      <div style={{ height: height }}>
        {validData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-slate-500 font-medium">No data available</p>
              <p className="text-sm text-slate-400">
                {data.length === 0 
                  ? 'No data for this period' 
                  : `${data.length - validData.length} invalid data points filtered out`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChartContainer;