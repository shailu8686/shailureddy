import axios from 'axios';
import { UPIRecord, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const upiApi = {
  // Get all UPI records
  getAll: async (): Promise<ApiResponse<UPIRecord[]>> => {
    try {
      const response = await api.get('/upi-records');
      return response.data;
    } catch (error) {
      console.error('Error fetching UPI records:', error);
      throw error;
    }
  },

  // Get UPI record by ID
  getById: async (id: string): Promise<ApiResponse<UPIRecord>> => {
    try {
      const response = await api.get(`/upi-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching UPI record:', error);
      throw error;
    }
  },

  // Create new UPI record
  create: async (record: Omit<UPIRecord, 'id'>): Promise<ApiResponse<UPIRecord>> => {
    try {
      const response = await api.post('/upi-records', record);
      return response.data;
    } catch (error) {
      console.error('Error creating UPI record:', error);
      throw error;
    }
  },

  // Update UPI record
  update: async (id: string, record: Partial<UPIRecord>): Promise<ApiResponse<UPIRecord>> => {
    try {
      const response = await api.put(`/upi-records/${id}`, record);
      return response.data;
    } catch (error) {
      console.error('Error updating UPI record:', error);
      throw error;
    }
  },

  // Delete UPI record
  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/upi-records/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting UPI record:', error);
      throw error;
    }
  },
};
