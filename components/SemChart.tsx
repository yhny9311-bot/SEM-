import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { ChartDataPoint } from '../types';

export interface BarConfig {
  key: string;
  name: string;
  color: string;
}

interface SemChartProps {
  data: ChartDataPoint[];
  bars: BarConfig[];
  xAxisFontSize: number;
  yAxisFontSize: number;
  yAxisTitleFontSize: number;
}

const SemChart: React.FC<SemChartProps> = ({ 
  data, 
  bars, 
  xAxisFontSize, 
  yAxisFontSize, 
  yAxisTitleFontSize 
}) => {
  const fontStyle = { fontFamily: '"Times New Roman", Times, serif' };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          left: 20, // Increased left margin for larger Y-axis titles
          bottom: 20,
        }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke="#e0e0e0" 
        />
        <ReferenceLine y={0} stroke="#333" strokeWidth={1} />
        
        <XAxis 
          dataKey="year" 
          tick={{ ...fontStyle, fill: '#000', fontSize: xAxisFontSize }}
          tickLine={{ stroke: '#000' }}
          axisLine={{ stroke: '#000' }}
          dy={5}
        />
        <YAxis 
          tick={{ ...fontStyle, fill: '#000', fontSize: yAxisFontSize }}
          tickLine={{ stroke: '#000' }}
          axisLine={{ stroke: '#000' }}
          label={{ 
            value: 'Std. Coefficient', 
            angle: -90, 
            position: 'insideLeft',
            style: { ...fontStyle, fill: '#000', fontSize: yAxisTitleFontSize, fontWeight: 'normal' },
            offset: 0,
            dx: -10 // Slight adjustment to keep it from overlapping ticks
          }}
        />
        
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          contentStyle={{ 
            ...fontStyle,
            borderRadius: '4px', 
            border: '1px solid #ccc',
            fontSize: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          }}
          itemStyle={fontStyle}
          labelStyle={fontStyle}
        />
        
        <Legend 
          wrapperStyle={{ paddingTop: '10px', ...fontStyle }} 
          iconType="rect"
          iconSize={14}
        />
        
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            name={bar.name}
            dataKey={bar.key}
            fill={bar.color}
            radius={[0, 0, 0, 0]} 
            barSize={40} 
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SemChart;