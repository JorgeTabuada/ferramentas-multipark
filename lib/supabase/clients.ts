import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from './config';

// Clientes principais (anon keys)
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

// Clientes admin (service role keys) - para operações privilegiadas
export const supabaseDashboardAdmin = createClient(
  supabaseConfig.dashboard.url,
  supabaseConfig.dashboard.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const supabaseFerramentasAdmin = createClient(
  supabaseConfig.ferramentas.url,
  supabaseConfig.ferramentas.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export default supabaseDashboard;