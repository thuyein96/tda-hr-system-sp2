import React from 'react';
import { TrendingUp, Users, DollarSign } from 'lucide-react';

interface SummaryStatsProps {
  totalEmployees: number;
  totalWorkLogs: number;
  netIncome: number;
}

const SummaryStats: React.FC<SummaryStatsProps> = ({
  totalEmployees,
  totalWorkLogs,
  netIncome
}) => {
  const stats = [
    {
      icon: Users,
      label: 'Total Employees',
      value: totalEmployees.toString(),
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      label: 'Total Work Logs',
      value: totalWorkLogs.toString(),
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: DollarSign,
      label: 'Net Income',
      value: `Ks. ${netIncome.toLocaleString()}`,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryStats;