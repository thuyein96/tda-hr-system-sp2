import { PayrollDto } from "@/dtos/payroll/PayrollDto";

const API_BASE_URL = 'https://tda-backend-khaki.vercel.app/_api';

export const payrollService = {
  getAllPayrolls: async (): Promise<PayrollDto[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payroll`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch payrolls: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      throw error;
    }
  },

  getPayrollById: async (id: string): Promise<PayrollDto> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payroll/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch payroll: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching payroll by ID:', error);
      throw error;
    }
  },

  createPayroll: async (payroll: Omit<PayrollDto, '_id'>): Promise<PayrollDto> => {
    try {
      const response = await fetch(`${API_BASE_URL}/payroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payroll),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Create payroll error:', errorText);
        throw new Error(`Failed to create payroll: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating payroll:', error);
      throw error;
    }
  },

  updatePayroll: async (id: string, payroll: Partial<PayrollDto>): Promise<PayrollDto> => {
    try {
      if (!id) {
        throw new Error('No payroll ID provided for update');
      }

      const response = await fetch(`${API_BASE_URL}/payroll/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payroll),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update payroll error response:', errorText);
        throw new Error(`Failed to update payroll: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating payroll:', error);
      throw error;
    }
  },

  deletePayroll: async (id: string): Promise<void> => {
    try {
      if (!id) {
        throw new Error('No payroll ID provided for deletion');
      }

      const response = await fetch(`${API_BASE_URL}/payroll/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete payroll: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting payroll:', error);
      throw error;
    }
  }
};