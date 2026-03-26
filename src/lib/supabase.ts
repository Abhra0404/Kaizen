import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string ?? '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Kaizen] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.\n' +
    '  • Local dev: copy .env.example → .env and fill in your Supabase credentials.\n' +
    '  • Vercel: Project → Settings → Environment Variables → add both keys, then redeploy.'
  );
}

const isPlaceholder = !supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co';

export const supabase = createClient(
  isPlaceholder ? 'https://placeholder.supabase.co' : supabaseUrl,
  isPlaceholder ? 'placeholder' : supabaseAnonKey
);

export const isSupabaseConfigured = !isPlaceholder;
