import { useState, useEffect } from 'react';
import { UPIRecord } from '../types';
import { mockUPIData } from '../data/mockData';
import { upiApi } from '../services/api';

export const useUPIData = () => {
  const [records, setRecords] = useState<UPIRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API, fallback to mock data
      try {
        const response = await upiApi.getAll();
        if (response && response.data && Array.isArray(response.data)) {
          setRecords(response.data);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        setRecords(mockUPIData);
      }
    } catch (err) {
      setError('Failed to fetch UPI records');
      console.error('Error fetching records:', err);
      // Fallback to mock data even on error
      setRecords(mockUPIData);
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async (record: Omit<UPIRecord, 'id'>) => {
    try {
      const newRecord: UPIRecord = {
        ...record,
        id: Date.now().toString(),
      };
      
      try {
        const response = await upiApi.create(record);
        if (response && response.data) {
          setRecords(prev => [...(prev || []), response.data]);
        } else {
          throw new Error('Invalid API response');
        }
      } catch (apiError) {
        console.warn('API not available for creating record, using local state');
        // Fallback to local state update
        setRecords(prev => [...(prev || []), newRecord]);
      }
    } catch (err) {
      setError('Failed to add record');
      console.error('Error adding record:', err);
    }
  };

  const updateRecord = async (id: string, updatedRecord: Partial<UPIRecord>) => {
    try {
      try {
        const response = await upiApi.update(id, updatedRecord);
        if (response && response.data) {
          setRecords(prev => (prev || []).map(record => 
            record.id === id ? response.data : record
          ));
        } else {
          throw new Error('Invalid API response');
        }
      } catch (apiError) {
        console.warn('API not available for updating record, using local state');
        // Fallback to local state update
        setRecords(prev => (prev || []).map(record => 
          record.id === id ? { ...record, ...updatedRecord } : record
        ));
      }
    } catch (err) {
      setError('Failed to update record');
      console.error('Error updating record:', err);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      try {
        await upiApi.delete(id);
        setRecords(prev => (prev || []).filter(record => record.id !== id));
      } catch (apiError) {
        console.warn('API not available for deleting record, using local state');
        // Fallback to local state update
        setRecords(prev => (prev || []).filter(record => record.id !== id));
      }
    } catch (err) {
      setError('Failed to delete record');
      console.error('Error deleting record:', err);
    }
  };

  return {
    records,
    loading,
    error,
    addRecord,
    updateRecord,
    deleteRecord,
    refreshRecords: fetchRecords,
  };
};
