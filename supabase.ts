import { createClient, SupabaseClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};

// Read strictly from NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
const supabaseUrl: string =
  env.NEXT_PUBLIC_SUPABASE_URL ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  'https://ympnoukwxgjtmhdtdihu.supabase.co';

const supabasePublishableKey: string =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ||
  'sb_publishable_v5UywPgt3VQthz-MQFk0Vg_1_MxBOIx';

let supabaseInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabasePublishableKey &&
    supabaseUrl.startsWith('https://')
  );
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
    } catch (err) {
      console.warn('[Supabase] Initialization failed:', err);
      return null;
    }
  }
  return supabaseInstance;
}

export const supabase = getSupabase();
