import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface IncomeExpenseData {
  name: string;
  value: number;
  color: string;
}

interface IncomeExpenseChartProps {
  data: IncomeExpenseData[];
}

const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ data }) => {
  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);
  
  const getPercentage = (value: number) => {
    return Math.round((value / totalAmount) * 100);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Income vs Expense</h2>
      
      <div className="flex items-center justify-center">
        <div className="relative w-64 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">
                {item.name} ({item.value.toLocaleString()}Ks)
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {getPercentage(item.value)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeExpenseChart;