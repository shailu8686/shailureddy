import React, { useState, useMemo } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { UPIRecord } from '../types';
import { useUPIData } from '../hooks/useUPIData';
import { SearchAndFilter } from './SearchAndFilter';
import { StatsCards } from './StatsCards';
import { UPITable } from './UPITable';
import { AddEditModal } from './AddEditModal';
import { ReportModal } from './ReportModal';

export const UPIDataView: React.FC = () => {
  const { records, loading, error, addRecord, updateRecord, deleteRecord, refreshRecords } = useUPIData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Safe' | 'Risk'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<UPIRecord | null>(null);

  const filteredRecords = useMemo(() => {
    if (!records || !Array.isArray(records)) {
      return [];
    }
    
    return records.filter((record) => {
      const matchesSearch = 
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.upiId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const handleAddRecord = (record: Omit<UPIRecord, 'id'>) => {
    addRecord(record);
  };

  const handleEditRecord = (record: UPIRecord) => {
    setEditRecord(record);
    setIsModalOpen(true);
  };

  const handleUpdateRecord = (updatedRecord: Omit<UPIRecord, 'id'>) => {
    if (editRecord) {
      updateRecord(editRecord.id, updatedRecord);
      setEditRecord(null);
    }
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      deleteRecord(id);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditRecord(null);
  };

  const handleReportSubmitted = () => {
    refreshRecords();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading UPI records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">UPI Records Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and monitor UPI records with risk assessment</p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button
            onClick={refreshRecords}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Record
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error: {error}</p>
          <p className="text-red-600 text-sm mt-1">Using offline data. Check your connection and try refreshing.</p>
        </div>
      )}

      <StatsCards records={records || []} />

      <SearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredRecords.length} of {records?.length || 0} records
      </div>

      <UPITable
        records={filteredRecords}
        onEdit={handleEditRecord}
        onDelete={handleDeleteRecord}
      />

      <AddEditModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={editRecord ? handleUpdateRecord : handleAddRecord}
        editRecord={editRecord}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onReportSubmitted={handleReportSubmitted}
      />
    </div>
  );
};
