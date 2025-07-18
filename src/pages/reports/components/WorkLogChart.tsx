import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WorkLogData {
  month: string;
  logs: number;
}

interface WorkLogChartProps {
  data: WorkLogData[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const WorkLogChart: React.FC<WorkLogChartProps> = ({
  data,
  selectedPeriod,
  onPeriodChange
}) => {
  const periodOptions = ['Daily', 'Weekly', 'Annually'];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Work log</h2>
        <div className="flex items-center space-x-2">
          {periodOptions.map((period) => (
            <button
              key={period}
              onClick={() => onPeriodChange(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="workLogGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
              domain={[0, 5000]}
              tickFormatter={(value) => `${value/1000}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
              labelStyle={{ color: 'white' }}
              formatter={(value: number) => [`${value.toLocaleString()} Logs`, '']}
            />
            <Area
              type="monotone"
              dataKey="logs"
              stroke="#FF6B6B"
              strokeWidth={3}
              fill="url(#workLogGradient)"
              dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#FF6B6B' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WorkLogChart;