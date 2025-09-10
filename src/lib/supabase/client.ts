import { createBrowserClient } from '@supabase/ssr';

// Validate required environment variables
const requiredEnvVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required Supabase environment variables:', missingEnvVars.join(', '));
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

export const supabase = createClient();
