import { createBrowserClient } from '@supabase/ssr';

// Set default values for development/testing if missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Validate required environment variables
const requiredEnvVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.warn('Missing required Supabase environment variables:', missingEnvVars.join(', '));
}

export const createClient = () => {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createClient();
