import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProgressDataPoint, WeightUnit } from '../types/workout';
import { convertWeight, getUnitLabel } from '../utils/unitConversion';

interface ProgressChartProps {
  data: ProgressDataPoint[];
  exerciseName: string;
  isDarkMode: boolean;
  weightUnit: WeightUnit;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, exerciseName, isDarkMode, weightUnit }) => {
  if (data.length === 0) {
    return (
      <div className={`text-center py-8 transition-colors duration-300 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div className="text-4xl mb-2">📊</div>
        <p>No data available for {exerciseName}</p>
        <p className="text-sm mt-1">Complete some workouts to see progress!</p>
      </div>
    );
  }

  const unitLabel = getUnitLabel(weightUnit);

  // Convert data for display
  const convertedData = data.map(point => ({
    ...point,
    oneRepMax: Math.round(convertWeight(point.oneRepMax, 'lbs', weightUnit)),
    totalWeight: Math.round(convertWeight(point.totalWeight, 'lbs', weightUnit)),
    averageWeight: Math.round(convertWeight(point.averageWeight, 'lbs', weightUnit) * 100) / 100
  }));

  // Split data into historical and projected
  const historicalData = convertedData.filter(point => !point.isProjection);
  const projectedData = convertedData.filter(point => point.isProjection);

  // Create datasets for the chart
  let chartData = [...convertedData];

  // If we have both historical and projected data, we need to connect them
  // by duplicating the last historical point as the first projected point
  if (historicalData.length > 0 && projectedData.length > 0) {
    const lastHistorical = historicalData[historicalData.length - 1];
    
    // Create separate datasets for historical and projected
    const historicalWithConnection = [...historicalData, { ...lastHistorical, isProjection: true }];
    const projectedWithConnection = [{ ...lastHistorical, isProjection: true }, ...projectedData];
    
    // For the chart, we'll use the full dataset but render different lines
    chartData = convertedData.map(point => ({
      ...point,
      // Add separate fields for projected data
      oneRepMaxProjected: point.isProjection ? point.oneRepMax : null,
      totalWeightProjected: point.isProjection ? point.totalWeight : null,
      averageWeightProjected: point.isProjection ? point.averageWeight : null,
      // Add separate fields for historical data
      oneRepMaxHistorical: !point.isProjection ? point.oneRepMax : null,
      totalWeightHistorical: !point.isProjection ? point.totalWeight : null,
      averageWeightHistorical: !point.isProjection ? point.averageWeight : null
    }));

    // Add connection points
    if (historicalData.length > 0 && projectedData.length > 0) {
      const lastHistoricalIndex = chartData.findIndex(point => !point.isProjection);
      const firstProjectedIndex = chartData.findIndex(point => point.isProjection);
      
      if (lastHistoricalIndex >= 0 && firstProjectedIndex >= 0) {
        // Make sure the connection point has both historical and projected values
        const connectionPoint = chartData[firstProjectedIndex];
        connectionPoint.oneRepMaxHistorical = connectionPoint.oneRepMax;
        connectionPoint.totalWeightHistorical = connectionPoint.totalWeight;
        connectionPoint.averageWeightHistorical = connectionPoint.averageWeight;
      }
    }
  } else {
    // If we only have one type of data, just use the original approach
    chartData = convertedData.map(point => ({
      ...point,
      oneRepMaxProjected: point.isProjection ? point.oneRepMax : null,
      totalWeightProjected: point.isProjection ? point.totalWeight : null,
      averageWeightProjected: point.isProjection ? point.averageWeight : null,
      oneRepMaxHistorical: !point.isProjection ? point.oneRepMax : null,
      totalWeightHistorical: !point.isProjection ? point.totalWeight : null,
      averageWeightHistorical: !point.isProjection ? point.averageWeight : null
    }));
  }

  const formatTooltipLabel = (label: string) => {
    return `Date: ${label}`;
  };

  const formatTooltipValue = (value: number, name: string) => {
    if (value === null || value === undefined) return [null, ''];
    const unit = name.includes('average') || name.includes('Average') ? `${unitLabel} (avg)` : unitLabel;
    return [value, unit];
  };

  return (
    <div className="space-y-6">
      {/* First Chart - One Rep Max & Average Weight */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
            />
            <XAxis 
              dataKey="date" 
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
            />
            <Tooltip 
              labelFormatter={formatTooltipLabel}
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '6px',
                color: isDarkMode ? '#f9fafb' : '#111827'
              }}
            />
            
            {/* Historical Lines (Solid) */}
            <Line 
              type="monotone" 
              dataKey="oneRepMaxHistorical" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="One Rep Max"
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              connectNulls={true}
            />
            
            <Line 
              type="monotone" 
              dataKey="averageWeightHistorical" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Average Weight"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              connectNulls={true}
            />

            {/* Projected Lines (Dashed) */}
            <Line 
              type="monotone" 
              dataKey="oneRepMaxProjected" 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="8 4"
              name="One Rep Max (Projected)"
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 3, fillOpacity: 0.6 }}
              connectNulls={true}
            />
            
            <Line 
              type="monotone" 
              dataKey="averageWeightProjected" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="8 4"
              name="Average Weight (Projected)"
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3, fillOpacity: 0.6 }}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Second Chart - Total Weight */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
            />
            <XAxis 
              dataKey="date" 
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              stroke={isDarkMode ? '#9ca3af' : '#6b7280'}
              fontSize={12}
            />
            <Tooltip 
              labelFormatter={formatTooltipLabel}
              formatter={formatTooltipValue}
              contentStyle={{
                backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDarkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '6px',
                color: isDarkMode ? '#f9fafb' : '#111827'
              }}
            />
            
            {/* Historical Total Weight Line (Solid) */}
            <Line 
              type="monotone" 
              dataKey="totalWeightHistorical" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Total Weight"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              connectNulls={true}
            />
            
            {/* Projected Total Weight Line (Dashed) */}
            <Line 
              type="monotone" 
              dataKey="totalWeightProjected" 
              stroke="#3b82f6" 
              strokeWidth={2}
              strokeDasharray="8 4"
              name="Total Weight (Projected)"
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3, fillOpacity: 0.6 }}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;