import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';

interface SemChartProps {
  data: { name: string; value: number }[];
  xAxisFontSize: number;
  yAxisFontSize: number;
  yAxisTitleFontSize: number;
  domain: [number, number];
  ticks: number[];
}

const SemChart: React.FC<SemChartProps> = ({ 
  data, 
  xAxisFontSize, 
  yAxisFontSize, 
  yAxisTitleFontSize,
  domain,
  ticks
}) => {
  const fontStyle = { fontFamily: '"Times New Roman", Times, serif' };
  
  // Nature Publishing Group colors
  const colorPositive = '#3C5488'; // NPG Dark Blue
  const colorNegative = '#E64B35'; // NPG Red

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={data}
        margin={{
          top: 5,
          right: 30, // Reduced right margin since labels are gone
          left: 10, 
          bottom: 5,
        }}
        barSize={40} // Bolder bars
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          horizontal={false} 
          vertical={true}
          stroke="#d1d5db" 
        />
        
        {/* The Zero Line */}
        <ReferenceLine x={0} stroke="#000" strokeWidth={1.5} />
        
        <XAxis 
          type="number" 
          domain={domain}
          ticks={ticks}
          tick={{ 
            ...fontStyle, 
            fill: '#000', 
            fontSize: xAxisFontSize, 
            fontWeight: 'bold' 
          }}
          tickLine={{ stroke: '#000', strokeWidth: 1.5 }}
          axisLine={{ stroke: '#000', strokeWidth: 1.5 }}
        />
        
        <YAxis 
          type="category" 
          dataKey="name" 
          width={150} 
          tick={{ 
            ...fontStyle, 
            fill: '#000', 
            fontSize: yAxisFontSize, 
            fontWeight: 'bold',
            textAnchor: 'end',
            dx: -10 
          }}
          tickLine={{ stroke: '#000', strokeWidth: 1.5 }}
          axisLine={{ stroke: '#000', strokeWidth: 1.5 }}
        />
        
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          contentStyle={{ 
            ...fontStyle,
            borderRadius: '4px', 
            border: '1px solid #ccc',
            fontSize: '12px',
          }}
          formatter={(value: number) => [value.toFixed(3), 'Coefficient']}
        />
        
        <Bar dataKey="value" radius={[0, 3, 3, 0]}>
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.value >= 0 ? colorPositive : colorNegative} 
              stroke={entry.value >= 0 ? '#2c3e50' : '#c0392b'}
              strokeWidth={1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SemChart;