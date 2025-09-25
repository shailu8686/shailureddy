import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RefreshCw, ArrowLeft, User, IndianRupee, Calendar, Tag, AlertTriangle, File, Download } from 'lucide-react';
import { Report, EvidenceFile } from '../types';
import { reportService } from '../services/reportService';

export const ReportDetail: React.FC = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [files, setFiles] = useState<EvidenceFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;
    fetchReportDetails(reportId);
  }, [reportId]);

  const fetchReportDetails = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const reportData = await reportService.getReport(id);
      const filesData = await reportService.getEvidenceFiles(id);
      setReport(reportData);
      setFiles(filesData);
    } catch (err) {
      setError('Failed to fetch report details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-3 text-gray-600">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Loading Report Details...</span>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error || 'Report not found.'}
      </div>
    );
  }

  const DetailItem: React.FC<{ icon: React.ElementType; label: string; value?: string | number | null }> = ({ icon: Icon, label, value }) => (
    <div>
      <dt className="flex items-center text-sm font-medium text-gray-500">
        <Icon className="w-4 h-4 mr-2 text-gray-400" />
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-900 font-mono">{value || 'N/A'}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      <Link to="/reports" className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800">
        <ArrowLeft className="w-4 h-4" />
        Back to My Reports
      </Link>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
            <p className="text-sm text-gray-500 mt-1">Report ID: <span className="font-mono">{report.id}</span></p>
          </div>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            report.report_status === 'resolved' ? 'bg-green-100 text-green-800' :
            report.report_status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {report.report_status.replace('_', ' ')}
          </span>
        </div>

        {/* Reported User Info */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Reported User Information</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <DetailItem icon={User} label="Full Name" value={report.reported_full_name} />
            <DetailItem icon={Tag} label="UPI ID" value={report.reported_upi_id} />
            <DetailItem icon={User} label="Phone Number" value={report.reported_phone_number} />
            <DetailItem icon={User} label="Address" value={report.reported_address} />
          </dl>
        </div>

        {/* Transaction Details */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Transaction Details</h3>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-6">
            <DetailItem icon={IndianRupee} label="Amount Involved" value={`₹${report.amount_involved.toFixed(2)}`} />
            <DetailItem icon={Tag} label="Transaction ID" value={report.transaction_id} />
            <DetailItem icon={Calendar} label="Transaction Date" value={new Date(report.transaction_date).toLocaleDateString()} />
          </dl>
        </div>

        {/* Report Details */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Report Details</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <DetailItem icon={Tag} label="Category" value={report.report_category.replace('_', ' ')} />
            <DetailItem icon={AlertTriangle} label="Urgency" value={report.urgency_level} />
          </dl>
          <div className="mt-6">
            <dt className="text-sm font-medium text-gray-500">Detailed Description</dt>
            <dd className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{report.detailed_description}</dd>
          </div>
        </div>

        {/* Evidence Files */}
        {files.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Evidence Files</h3>
            <ul className="space-y-3">
              {files.map(file => (
                <li key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                  <div className="flex items-center gap-3">
                    <File className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-800">{file.file_name}</span>
                    <span className="text-xs text-gray-500">({(file.file_size / 1024).toFixed(2)} KB)</span>
                  </div>
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
                  >
                    <Download className="w-3 h-3" />
                    View
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
