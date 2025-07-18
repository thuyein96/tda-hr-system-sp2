import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChevronDown } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  productivity: number;
  avatar: string;
}

interface EmployeeProductivityChartProps {
  employees: Employee[];
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const EmployeeProductivityChart: React.FC<EmployeeProductivityChartProps> = ({
  employees,
  selectedPeriod,
  onPeriodChange
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Statistics</p>
          <h2 className="text-xl font-bold text-gray-800">Top 7 Employee Productivity</h2>
        </div>
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => onPeriodChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            <option value="Month">Month</option>
            <option value="Week">Week</option>
            <option value="Year">Year</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={employees} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#666' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="productivity" 
              fill="#FF6B6B" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Employee Avatars */}
      <div className="flex justify-center space-x-4 mt-4">
        {employees.map((employee, index) => (
          <div key={employee.id} className="flex flex-col items-center">
            <div className="relative">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
              {index < 3 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{index + 1}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeProductivityChart;