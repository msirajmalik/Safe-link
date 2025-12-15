import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RiskLevel } from '../types';

interface SafetyGaugeProps {
  score: number;
  riskLevel: RiskLevel;
}

const SafetyGauge: React.FC<SafetyGaugeProps> = ({ score, riskLevel }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Remaining', value: 100 - score },
  ];

  let color = '#3b82f6'; // Default Blue
  if (score >= 80) color = '#22c55e'; // Green
  else if (score >= 50) color = '#eab308'; // Yellow
  else color = '#ef4444'; // Red

  const emptyColor = '#e2e8f0';

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            cornerRadius={10}
            paddingAngle={5}
          >
            <Cell key="cell-0" fill={color} />
            <Cell key="cell-1" fill={emptyColor} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-bold text-slate-800">{score}</span>
        <span className="text-xs font-semibold uppercase tracking-wider mt-1 text-slate-500">Trust Score</span>
      </div>
    </div>
  );
};

export default SafetyGauge;