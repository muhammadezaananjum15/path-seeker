import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

export interface DimensionRadarChartProps {
  riasecScores: {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
  };
  className?: string;
}

export const DimensionRadarChart: React.FC<DimensionRadarChartProps> = ({
  riasecScores,
  className
}) => {
  const data = [
    { dimension: 'Realistic (Practical)', value: riasecScores.realistic || 65 },
    { dimension: 'Investigative (Analytical)', value: riasecScores.investigative || 95 },
    { dimension: 'Artistic (Creative)', value: riasecScores.artistic || 78 },
    { dimension: 'Social (Empathetic)', value: riasecScores.social || 62 },
    { dimension: 'Enterprising (Leadership)', value: riasecScores.enterprising || 88 },
    { dimension: 'Conventional (Systematic)', value: riasecScores.conventional || 72 }
  ];

  return (
    <div className={className} style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#6755C2" strokeOpacity={0.25} />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#8B85A8', fontSize: 10, fontFamily: 'sans-serif' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Career Fit Vector"
            dataKey="value"
            stroke="#6755C2"
            fill="#402D9C"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
