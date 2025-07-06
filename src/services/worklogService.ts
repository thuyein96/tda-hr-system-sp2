import { worklogCreateDto } from "@/dtos/worklog/worklogCreateDto";
import { worklogDto } from "@/dtos/worklog/worklogDto";
import { get } from "http";

const API_BASE_URL = 'https://tda-backend-khaki.vercel.app/_api';

export const worklogService = {
  getAllWorklogs: async (): Promise<worklogDto[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/employee-product`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  getWorkLogById: async (id: string): Promise<worklogDto> => {
    try {
        const response = await fetch(`${API_BASE_URL}/employee-product/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch worklog: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching worklog by ID:', error);
        throw error;
    }
  },

  createWorkLog: async (worklog: Omit<worklogCreateDto, '_id'>): Promise<worklogDto> => {
      try {
        console.log("Creating worklog with data:", worklog);

        const response = await fetch(`${API_BASE_URL}/employee-product`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(worklog),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Create worklog error:', errorText);
          throw new Error(`Failed to create employee: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
      }
    },
  
    updateEmployee: async (id: string, worklog: Partial<worklogDto>): Promise<worklogDto> => {
      try {
          if (!id) {
            throw new Error('No worklog ID provided for update');
          }
  
        const response = await fetch(`${API_BASE_URL}/employee-product/${id}`, {
          method: 'PATCH', 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(worklog),
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Update worklog error response:', errorText);
          throw new Error(`Failed to update worklog: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error updating worklog:', error);
        throw error;
      }
    },
  
  
    deleteWorklog: async (id: string): Promise<void> => {
      try {
        if (!id) {
          throw new Error('No worklog ID provided for deletion');
        }
  
        const response = await fetch(`${API_BASE_URL}/employee-product/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`Failed to delete worklog: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error deleting worklog:', error);
        throw error;
      }
    }
};