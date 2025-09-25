export interface UPIRecord {
  id: string;
  name: string;
  upiId: string;
  score: number;
  status: 'Safe' | 'Risk';
  createdAt?: string;
  updatedAt?: string;
}

export interface Report {
  id: string;
  user_id: string;
  
  // Reported User Information
  reported_upi_id: string;
  reported_full_name: string;
  reported_phone_number?: string;
  reported_address?: string;
  
  // Transaction Details
  amount_involved: number;
  transaction_id?: string;
  transaction_date: string;
  
  // Report Details
  report_category: 'fraud' | 'scam' | 'unauthorized_transaction' | 'fake_merchant' | 'identity_theft' | 'other';
  urgency_level: 'low' | 'medium' | 'high' | 'critical';
  detailed_description: string;
  
  // Report Status
  report_status: 'draft' | 'submitted' | 'under_review' | 'resolved' | 'closed';
  
  // Police Notification
  police_notified: boolean;
  police_station_contact?: string;
  notification_sent_at?: string;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  submitted_at?: string;
}

export interface EvidenceFile {
  id: string;
  report_id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  file_url: string;
  uploaded_at: string;
}

export interface PoliceStation {
  id: string;
  state: string;
  city: string;
  station_name: string;
  contact_number: string;
  address?: string;
  cyber_crime_unit: boolean;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
