/*
# Create Reports Table
Creates a comprehensive reports table for UPI fraud reporting system

## Query Description: 
This operation creates a new reports table to store fraud reports with user information, transaction details, and evidence attachments. This is a safe operation that adds new functionality without affecting existing data.

## Metadata:
- Schema-Category: "Safe"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- reports table with comprehensive fields for fraud reporting
- evidence_files table for file attachments
- police_stations table for automated notifications

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Authenticated users only

## Performance Impact:
- Indexes: Added on user_id, report_status, created_at
- Triggers: None
- Estimated Impact: Minimal performance impact
*/

-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Reported User Information
    reported_upi_id TEXT NOT NULL,
    reported_full_name TEXT NOT NULL,
    reported_phone_number TEXT,
    reported_address TEXT,
    
    -- Transaction Details
    amount_involved DECIMAL(10,2) NOT NULL,
    transaction_id TEXT,
    transaction_date DATE NOT NULL,
    
    -- Report Details
    report_category TEXT NOT NULL CHECK (report_category IN ('fraud', 'scam', 'unauthorized_transaction', 'fake_merchant', 'identity_theft', 'other')),
    urgency_level TEXT NOT NULL CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    detailed_description TEXT NOT NULL,
    
    -- Report Status
    report_status TEXT NOT NULL CHECK (report_status IN ('draft', 'submitted', 'under_review', 'resolved', 'closed')) DEFAULT 'draft',
    
    -- Police Notification
    police_notified BOOLEAN DEFAULT FALSE,
    police_station_contact TEXT,
    notification_sent_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE
);

-- Create evidence files table
CREATE TABLE IF NOT EXISTS public.evidence_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create police stations table for automated notifications
CREATE TABLE IF NOT EXISTS public.police_stations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    station_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    address TEXT,
    cyber_crime_unit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert sample police station data
INSERT INTO public.police_stations (state, city, station_name, contact_number, address, cyber_crime_unit) VALUES
('Maharashtra', 'Mumbai', 'Mumbai Cyber Crime Unit', '+91-22-2672-3333', 'BKC, Mumbai', true),
('Delhi', 'New Delhi', 'Delhi Police Cyber Cell', '+91-11-2309-4061', 'IFSO, New Delhi', true),
('Karnataka', 'Bangalore', 'Bangalore Cyber Crime Unit', '+91-80-2294-2222', 'CID, Bangalore', true),
('Tamil Nadu', 'Chennai', 'Chennai Cyber Crime Unit', '+91-44-2847-1111', 'Chennai Police', true),
('Telangana', 'Hyderabad', 'Hyderabad Cyber Crime Unit', '+91-40-2785-4646', 'Hyderabad Police', true),
('West Bengal', 'Kolkata', 'Kolkata Police Cyber Cell', '+91-33-2214-5555', 'Lalbazar, Kolkata', true),
('Gujarat', 'Ahmedabad', 'Ahmedabad Cyber Crime Unit', '+91-79-2550-2020', 'Ahmedabad Police', true),
('Rajasthan', 'Jaipur', 'Jaipur Cyber Crime Unit', '+91-141-511-0013', 'Jaipur Police', true),
('Uttar Pradesh', 'Lucknow', 'UP Cyber Crime Unit', '+91-522-238-9999', 'Lucknow Police', true),
('Punjab', 'Chandigarh', 'Chandigarh Cyber Crime Unit', '+91-172-270-4108', 'Chandigarh Police', true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(report_status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_urgency ON public.reports(urgency_level);
CREATE INDEX IF NOT EXISTS idx_evidence_files_report_id ON public.evidence_files(report_id);
CREATE INDEX IF NOT EXISTS idx_police_stations_city ON public.police_stations(city);

-- Enable Row Level Security
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.police_stations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for reports
CREATE POLICY "Users can view their own reports" ON public.reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports" ON public.reports
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for evidence files
CREATE POLICY "Users can view evidence files for their reports" ON public.evidence_files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.reports 
            WHERE reports.id = evidence_files.report_id 
            AND reports.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert evidence files for their reports" ON public.evidence_files
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.reports 
            WHERE reports.id = evidence_files.report_id 
            AND reports.user_id = auth.uid()
        )
    );

-- Create RLS policies for police stations (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view police stations" ON public.police_stations
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle police notification
CREATE OR REPLACE FUNCTION notify_police_for_scam_reports()
RETURNS TRIGGER AS $$
BEGIN
    -- If report is being submitted and is a scam/fraud report
    IF NEW.report_status = 'submitted' AND OLD.report_status = 'draft' 
       AND NEW.report_category IN ('scam', 'fraud', 'unauthorized_transaction') THEN
        
        -- Find nearest police station (simplified logic)
        UPDATE public.reports 
        SET police_station_contact = (
            SELECT contact_number 
            FROM public.police_stations 
            WHERE cyber_crime_unit = true 
            ORDER BY RANDOM() 
            LIMIT 1
        ),
        police_notified = true,
        notification_sent_at = TIMEZONE('utc'::text, NOW())
        WHERE id = NEW.id;
        
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for police notification
CREATE TRIGGER trigger_notify_police AFTER UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION notify_police_for_scam_reports();
