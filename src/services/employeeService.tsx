import { EmployeeResponse } from "@/dtos/employee/EmployeeResponse";
import { EmployeeDto } from "@/dtos/employee/EmployeeDto";

const API_BASE_URL = 'https://tda-backend-khaki.vercel.app/_api';

export const employeeService = {
    // Get all employees
    getAllEmployees: async (): Promise<EmployeeResponse[]> => {
      try {
        const response = await fetch(`${API_BASE_URL}/employee`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }
    },
  
    // Create new employee
    createEmployee: async (employee: Omit<EmployeeDto, 'id'>): Promise<EmployeeResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/employees`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(employee),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to create employee: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
      }
    },
  
    // Update employee
    updateEmployee: async (id: string, employee: Partial<EmployeeResponse>): Promise<EmployeeResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(employee),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to update employee: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error updating employee:', error);
        throw error;
      }
    },
  
    // Delete employee
    deleteEmployee: async (id: string): Promise<void> => {
      try {
        const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Failed to delete employee: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error deleting employee:', error);
        throw error;
      }
    },
  
    // Update employee status
    updateEmployeeStatus: async (id: string, status: 'Active' | 'On leave'): Promise<EmployeeResponse> => {
      try {
        const response = await fetch(`${API_BASE_URL}/employees/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ status }),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to update employee status: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error updating employee status:', error);
        throw error;
      }
    },
  };
  