import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create storage bucket for evidence files if it doesn't exist
const initializeStorage = async () => {
  const { data: buckets } = await supabase.storage.listBuckets();
  const evidenceBucket = buckets?.find(bucket => bucket.name === 'evidence-files');
  
  if (!evidenceBucket) {
    await supabase.storage.createBucket('evidence-files', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'application/pdf'],
      fileSizeLimit: 10485760 // 10MB
    });
  }
};

// Initialize storage on module load
initializeStorage().catch(console.error);
