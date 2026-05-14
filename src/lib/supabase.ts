import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key if available for secure backend operations, fallback to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    'Supabase environment variables (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY / SUPABASE_ANON_KEY) are missing. ' +
    'Database operations will fail until these are configured.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseKey || 'placeholder-key'
);
