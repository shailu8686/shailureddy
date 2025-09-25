import React, { useState, useMemo } from 'react';
import { Plus, Database, RefreshCw, LogOut, User } from 'lucide-react';
import { UPIRecord } from '../types';
import { useUPIData } from '../hooks/useUPIData';
import { useAuth } from '../contexts/AuthContext';
import { SearchAndFilter } from './SearchAndFilter';
import { StatsCards } from './StatsCards';
import { UPITable } from './UPITable';
import { AddEditModal } from './AddEditModal';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { records, loading, error, addRecord, updateRecord, deleteRecord, refreshRecords } = useUPIData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Safe' | 'Risk'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading UPI records...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <Database className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">UPI Management System</h1>
              <p className="text-gray-600 mt-1">Manage and monitor UPI records with risk assessment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{user?.email}</span>
            </div>
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
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error: {error}</p>
            <p className="text-red-600 text-sm mt-1">Using offline data. Check your connection and try refreshing.</p>
          </div>
        )}

        {/* Stats */}
        <StatsCards records={records || []} />

        {/* Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* Results Summary */}
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredRecords.length} of {records?.length || 0} records
        </div>

        {/* Table */}
        <UPITable
          records={filteredRecords}
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
        />

        {/* Add/Edit Modal */}
        <AddEditModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSubmit={editRecord ? handleUpdateRecord : handleAddRecord}
          editRecord={editRecord}
        />
      </div>
    </div>
  );
};
