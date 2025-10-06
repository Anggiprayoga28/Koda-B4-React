import React from 'react';
import { Calendar } from 'lucide-react';

const SalesChart = ({ dateRange, onDateChange }) => {
  const chartData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 45 },
    { day: 'Wed', value: 85 },
    { day: 'Thu', value: 55 },
    { day: 'Fri', value: 75 },
    { day: 'Sat', value: 90 },
    { day: 'Sun', value: 70 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Sales Chart</h2>
        <div className="relative">
          <select 
            value={dateRange}
            onChange={(e) => onDateChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 cursor-pointer hover:border-gray-400 transition"
          >
            <option>16 - 23 January 2023</option>
            <option>24 - 31 January 2023</option>
            <option>1 - 7 February 2023</option>
            <option>8 - 15 February 2023</option>
          </select>
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 h-64">
        {chartData.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div 
              className="w-full bg-orange-500 rounded-t-lg transition-all hover:bg-orange-600"
              style={{ 
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: '20px'
              }}
            ></div>
            <span className="text-sm text-gray-600 font-medium">{item.day}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span className="text-sm text-gray-600">Sales</span>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;