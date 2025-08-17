import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface MemberEngagementChartProps {
  data: {
    high: number;
    medium: number;
    low: number;
  };
}

const MemberEngagementChart: React.FC<MemberEngagementChartProps> = ({ data }) => {
  const chartData = [
    { name: 'High Engagement', value: data.high, color: '#10B981' },
    { name: 'Medium Engagement', value: data.medium, color: '#F59E0B' },
    { name: 'Low Engagement', value: data.low, color: '#EF4444' },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MemberEngagementChart;
