import React, { useState } from 'react';
import { useReportsData } from './hooks/useReportsData';
import { incomeExpenseData, workLogData } from './constants/mockData';
import EmployeeProductivityChart from './components/EmployeeProductivityChart';
import IncomeExpenseChart from './components/IncomeExpenseChart';
import WorkLogChart from './components/WorkLogChart';
import SummaryStats from './components/SummaryStats';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');
  const [workLogPeriod, setWorkLogPeriod] = useState('Annually');
  
  const { 
    employees, 
    workLogs, 
    loading, 
    error, 
    getTopEmployeeProductivity 
  } = useReportsData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  const topEmployees = getTopEmployeeProductivity();
  const netIncome = incomeExpenseData[0].value - incomeExpenseData[1].value;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmployeeProductivityChart
          employees={topEmployees}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
        
        <IncomeExpenseChart data={incomeExpenseData} />
      </div>

      {/* Work Log Section */}
      <WorkLogChart
        data={workLogData}
        selectedPeriod={workLogPeriod}
        onPeriodChange={setWorkLogPeriod}
      />

      {/* Summary Stats */}
      <SummaryStats
        totalEmployees={employees.length}
        totalWorkLogs={workLogs.length}
        netIncome={netIncome}
      />
    </div>
  );
};

export default Reports;