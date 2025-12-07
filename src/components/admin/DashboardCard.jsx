import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DashboardCard = ({ title, count, change, icon: Icon, color = "green", trend = "up" }) => {
  const colors = {
    green: 'from-green-400 to-green-500',
    indigo: 'from-indigo-400 to-indigo-500',
    purple: 'from-purple-400 to-purple-500',
    orange: 'from-[#C5A053] to-[#8E6447]',
    blue: 'from-blue-400 to-blue-500'
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 text-white`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          {Icon === 'check' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <Icon className="w-6 h-6" />
          )}
        </div>
      </div>
      <p className="text-white/90 text-sm mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-4xl font-bold">{count}</h3>
        <span className="flex items-center gap-1 text-sm">
          {change > 0 ? '+' : ''}{change}%
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        </span>
      </div>
    </div>
  );
};

export default DashboardCard;