
import { worklogCreateDto } from "@/dtos/worklog/worklogCreateDto";
import { worklogDto } from "@/dtos/worklog/worklogDto";
import { worklogUpdateDto } from "@/dtos/worklog/worklogUpdateDto";

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
        throw new Error(`Failed to fetch worklogs: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching worklogs:', error);
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

  createWorkLog: async (worklog: worklogCreateDto): Promise<worklogDto> => {
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
          throw new Error(`Failed to create worklog: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error creating worklog:', error);
        throw error;
      }
    },
  
    updateWorkLog: async (id: string, worklog: Partial<worklogUpdateDto>): Promise<worklogDto> => {
      try {
          if (!id) {
            throw new Error('No worklog ID provided for update');
          }
          console.log("Updating worklog with ID:", id, "and data:", worklog);
          console.log("token", localStorage.getItem('token'));
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
  
  
    deleteWorkLog: async (id: string): Promise<void> => {
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
