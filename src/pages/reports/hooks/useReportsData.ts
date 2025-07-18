import { useState, useEffect } from 'react';
import { employeeService } from '@/services/employeeService';
import { worklogService } from '@/services/worklogService';
import { EmployeeResponse } from '@/dtos/employee/EmployeeResponse';
import { worklogDto } from '@/dtos/worklog/worklogDto';

export interface EmployeeProductivity {
  id: string;
  name: string;
  productivity: number;
  avatar: string;
}

export const useReportsData = () => {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [workLogs, setWorkLogs] = useState<worklogDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [employeeData, worklogData] = await Promise.all([
          employeeService.getAllEmployees(),
          worklogService.getAllWorklogs()
        ]);
        
        setEmployees(employeeData);
        setWorkLogs(worklogData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching reports data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTopEmployeeProductivity = (): EmployeeProductivity[] => {
    const employeeProductivity = employees.map(employee => {
      const employeeWorkLogs = workLogs.filter(log => log.employeeId === employee._id);
      const totalQuantity = employeeWorkLogs.reduce((sum, log) => sum + log.quantity, 0);
      
      return {
        id: employee._id,
        name: employee.name.split(' ')[0], // First name only
        productivity: totalQuantity,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random&size=40`
      };
    });

    return employeeProductivity
      .sort((a, b) => b.productivity - a.productivity)
      .slice(0, 7);
  };

  return {
    employees,
    workLogs,
    loading,
    error,
    getTopEmployeeProductivity
  };
};