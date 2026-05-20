import { createClient } from '@supabase/supabase-js';

// Supabase auth expects GOTRUE_SITE_URL to be the app origin,
// for example http://localhost:5173 — not the OAuth callback path.
// The callback redirect URL can be a nested route, but must be allowed
// in GOTRUE_URI_ALLOW_LIST.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
