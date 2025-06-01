import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config';

export const supabaseDashboard = createClient(
  supabaseConfig.dashboard.url,
  supabaseConfig.dashboard.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

export const supabaseFerramentas = createClient(
  supabaseConfig.ferramentas.url,
  supabaseConfig.ferramentas.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

export default supabaseDashboard;