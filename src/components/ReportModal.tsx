import React, { useState, useRef } from 'react';
import { X, Upload, AlertTriangle, Save, Send, Calendar } from 'lucide-react';
import { Report } from '../types';
import { reportService } from '../services/reportService';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onReportSubmitted,
}) => {
  const [formData, setFormData] = useState({
    // Reported User Information
    reported_upi_id: '',
    reported_full_name: '',
    reported_phone_number: '',
    reported_address: '',
    
    // Transaction Details
    amount_involved: 0,
    transaction_id: '',
    transaction_date: '',
    
    // Report Details
    report_category: '' as Report['report_category'],
    urgency_level: 'medium' as Report['urgency_level'],
    detailed_description: '',
    
    report_status: 'draft' as Report['report_status']
  });

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reportCategories = [
    { value: 'fraud', label: 'Fraud' },
    { value: 'scam', label: 'Scam' },
    { value: 'unauthorized_transaction', label: 'Unauthorized Transaction' },
    { value: 'fake_merchant', label: 'Fake Merchant' },
    { value: 'identity_theft', label: 'Identity Theft' },
    { value: 'other', label: 'Other' }
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - Can wait', color: 'text-green-600' },
    { value: 'medium', label: 'Medium - Normal priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High - Urgent', color: 'text-orange-600' },
    { value: 'critical', label: 'Critical - Immediate attention', color: 'text-red-600' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount_involved' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      setError('Some files were rejected. Please upload PNG, JPG, or PDF files under 10MB.');
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const reportData = {
        ...formData,
        report_status: 'draft' as const
      };

      const createdReport = await reportService.createReport(reportData);
      
      // Upload files if any
      for (const file of uploadedFiles) {
        await reportService.uploadEvidence(createdReport.id, file);
      }

      setSuccess('Report saved as draft successfully!');
      setTimeout(() => {
        onReportSubmitted();
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to save report draft');
      console.error('Error saving draft:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReport = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.reported_upi_id || !formData.reported_full_name || 
        !formData.amount_involved || !formData.transaction_date || 
        !formData.report_category || !formData.detailed_description) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const reportData = {
        ...formData,
        report_status: 'submitted' as const
      };

      const createdReport = await reportService.createReport(reportData);
      
      // Upload files if any
      for (const file of uploadedFiles) {
        await reportService.uploadEvidence(createdReport.id, file);
      }

      // Simulate police notification for scam/fraud reports
      if (['scam', 'fraud', 'unauthorized_transaction'].includes(formData.report_category)) {
        await reportService.sendPoliceNotification(
          formData.reported_phone_number || 'N/A',
          '+91-100' // Emergency number as fallback
        );
      }

      setSuccess('Report submitted successfully! Police station contact will be sent within 24 hours if applicable.');
      setTimeout(() => {
        onReportSubmitted();
        onClose();
      }, 3000);
    } catch (err) {
      setError('Failed to submit report');
      console.error('Error submitting report:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-900">File a New Report</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {/* Reported User Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Reported User Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient UPI ID *
                </label>
                <input
                  type="text"
                  name="reported_upi_id"
                  required
                  value={formData.reported_upi_id}
                  onChange={handleInputChange}
                  placeholder="user@paytm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="reported_full_name"
                  required
                  value={formData.reported_full_name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="reported_phone_number"
                  value={formData.reported_phone_number}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Known Address (if any)
                </label>
                <input
                  type="text"
                  name="reported_address"
                  value={formData.reported_address}
                  onChange={handleInputChange}
                  placeholder="City, State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Transaction Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Involved (₹) *
                </label>
                <input
                  type="number"
                  name="amount_involved"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount_involved}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID
                </label>
                <input
                  type="text"
                  name="transaction_id"
                  value={formData.transaction_id}
                  onChange={handleInputChange}
                  placeholder="TXN123456789"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    name="transaction_date"
                    required
                    value={formData.transaction_date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Report Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Category *
                </label>
                <select
                  name="report_category"
                  required
                  value={formData.report_category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {reportCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency Level *
                </label>
                <select
                  name="urgency_level"
                  required
                  value={formData.urgency_level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {urgencyLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description *
              </label>
              <textarea
                name="detailed_description"
                required
                rows={4}
                value={formData.detailed_description}
                onChange={handleInputChange}
                placeholder="Please provide detailed information about the issue..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Evidence Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Attach Evidence
            </h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 mb-4">PNG, JPG, PDF (MAX. 10MB per file)</p>
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                Choose Files
              </button>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <p className="text-sm text-yellow-800">
                  Evidence is crucial. Please upload screenshots of chats, transaction receipts, etc.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save as Draft
            </button>
            
            <button
              type="button"
              onClick={handleSubmitReport}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
