
import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const payrollData = [
  { day: 'MON', value: 1200 },
  { day: 'TUE', value: 1500 },
  { day: 'WED', value: 5000 },
  { day: 'THU', value: 1700 },
  { day: 'FRI', value: 4200 },
  { day: 'SAT', value: 3200 },
  { day: 'SUN', value: 3000 },
];

const incomeExpenseData = [
  { month: 'JAN', income: 25, expense: 20 },
  { month: 'FEB', income: 30, expense: 25 },
  { month: 'MAR', income: 45, expense: 35 },
  { month: 'APR', income: 65, expense: 40 },
  { month: 'MAY', income: 55, expense: 45 },
  { month: 'JUN', income: 85, expense: 50 },
  { month: 'JUL', income: 90, expense: 55 },
  { month: 'AUG', income: 95, expense: 60 },
  { month: 'SEP', income: 85, expense: 65 },
  { month: 'OCT', income: 90, expense: 70 },
  { month: 'NOV', income: 95, expense: 75 },
  { month: 'DEC', income: 100, expense: 95 },
];

const chartConfig = {
  payroll: {
    label: "Payroll",
    color: "#ef4444",
  },
  income: {
    label: "Income",
    color: "#8b5cf6",
  },
  expense: {
    label: "Expense",
    color: "#ef4444",
  },
};

const Dashboard = () => {
  return (
    <div style={{ padding: '24px', backgroundColor: '#f8f9fa' }}>
      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {/* Total Employee */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#ef4444', marginRight: '8px', fontSize: '18px' }}>👥</span>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Total Employee</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>560</div>
          <div style={{ color: '#9ca3af', fontSize: '12px' }}>Update: July 16, 2025</div>
        </div>

        {/* Monthly Payroll */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#ef4444', marginRight: '8px', fontSize: '18px' }}>💰</span>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Monthly Payroll</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>560,000 Ks</div>
          <div style={{ color: '#9ca3af', fontSize: '12px' }}>Update: July 16, 2025</div>
        </div>

        {/* Monthly Income */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#ef4444', marginRight: '8px', fontSize: '18px' }}>📈</span>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Monthly Income</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>1,560,000 Ks</div>
          <div style={{ color: '#9ca3af', fontSize: '12px' }}>Update: July 16, 2025</div>
        </div>

        {/* Monthly Expenses */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#ef4444', marginRight: '8px', fontSize: '18px' }}>📉</span>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Monthly Expenses</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>420,000 Ks</div>
          <div style={{ color: '#9ca3af', fontSize: '12px' }}>Update: July 16, 2025</div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 300px', gap: '24px' }}>
        {/* Payroll Trend Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#1f2937' }}>
            Payroll trend over time
          </h3>
          <ChartContainer config={chartConfig} style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={payrollData}>
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Income vs Expenses Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px', color: '#1f2937' }}>
            Income vs Expenses
          </h3>
          <ChartContainer config={chartConfig} style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeExpenseData}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expense" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Activity Log */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>Activity Log</h3>
            <span style={{ color: '#9ca3af', fontSize: '12px' }}>Update: July 16, 2025</span>
          </div>
          
          <div style={{ space: '16px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>09:00 AM</span>
              </div>
              <span style={{ fontSize: '14px', color: '#1f2937' }}>Work log added</span>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>10:00 AM</span>
              </div>
              <span style={{ fontSize: '14px', color: '#1f2937' }}>Salary Generated</span>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>10:04 AM</span>
              </div>
              <span style={{ fontSize: '14px', color: '#1f2937' }}>Payroll Updated</span>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>10:10 AM</span>
              </div>
              <span style={{ fontSize: '14px', color: '#1f2937' }}>Income Updated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
