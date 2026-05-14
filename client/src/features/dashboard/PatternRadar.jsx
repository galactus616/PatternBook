import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

const PatternRadar = ({ data }) => {
  // Filter out patterns with 0 progress to keep it clean, or keep them for contrast
  const chartData = data?.slice(0, 7).map(p => ({
    subject: p.pattern.split(' ').slice(0, 2).join(' '), // Keep labels short
    A: p.percentage,
    fullMark: 100,
  })) || [];

  if (chartData.length === 0) return null;

  return (
    <div className="w-full h-[280px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#e5e5e5" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#666', fontSize: 9, fontStyle: 'italic', fontFamily: 'monospace' }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Mastery"
            dataKey="A"
            stroke="#ff3b30"
            fill="#ff3b30"
            fillOpacity={0.15}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PatternRadar;
