import { supabase } from '../lib/supabase';
import { Report, EvidenceFile } from '../types';

export const reportService = {
  // Create a new report
  createReport: async (reportData: Omit<Report, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('reports')
      .insert([{
        ...reportData,
        user_id: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update a report
  updateReport: async (reportId: string, reportData: Partial<Report>) => {
    const { data, error } = await supabase
      .from('reports')
      .update(reportData)
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Submit a report (change status from draft to submitted)
  submitReport: async (reportId: string) => {
    const { data, error } = await supabase
      .from('reports')
      .update({ 
        report_status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .eq('id', reportId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get user's reports
  getUserReports: async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a specific report
  getReport: async (reportId: string) => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a report
  deleteReport: async (reportId: string) => {
    const { data, error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId);

    if (error) throw error;
    return data;
  },

  // Upload evidence file
  uploadEvidence: async (reportId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${reportId}_${Date.now()}.${fileExt}`;
    const filePath = `evidence/${fileName}`;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('evidence-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('evidence-files')
      .getPublicUrl(filePath);

    // Save file info to database
    const { data, error } = await supabase
      .from('evidence_files')
      .insert([{
        report_id: reportId,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_url: publicUrl
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get evidence files for a report
  getEvidenceFiles: async (reportId: string) => {
    const { data, error } = await supabase
      .from('evidence_files')
      .select('*')
      .eq('report_id', reportId)
      .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Simulate SMS notification
  sendPoliceNotification: async (phoneNumber: string, policeContact: string) => {
    // In a real implementation, this would integrate with an SMS service
    console.log(`SMS Notification would be sent to ${phoneNumber}:`);
    console.log(`Your fraud report has been processed. Police Station Contact: ${policeContact}`);
    console.log(`Please contact them within 24 hours for further assistance.`);
    
    // Return a success response
    return {
      success: true,
      message: `Police contact information will be sent to ${phoneNumber} within 24 hours.`
    };
  }
};
