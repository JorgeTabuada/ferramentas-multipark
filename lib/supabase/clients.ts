// lib/supabase/clients.ts
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig, validateSupabaseConfig } from './config';

// Validar configuração ao importar
validateSupabaseConfig();

// Cliente para Base Dashboard (Operacional)
export const supabaseDashboard = createClient(
  supabaseConfig.dashboard.url,
  supabaseConfig.dashboard.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public'
    }
  }
);

// Cliente para Base Ferramentas (RH e Analytics)
export const supabaseFerramentas = createClient(
  supabaseConfig.ferramentas.url,
  supabaseConfig.ferramentas.anonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    db: {
      schema: 'public'
    }
  }
);

// Cliente principal (para compatibilidade)
export const supabase = supabaseDashboard;

// Função helper para escolher o cliente correto
export function getSupabaseClient(database: 'dashboard' | 'ferramentas') {
  return database === 'dashboard' ? supabaseDashboard : supabaseFerramentas;
}

// Auth helper functions
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabaseDashboard.auth.signInWithPassword({
      email,
      password,
    });

    if (data.user && !error) {
      // Sincronizar sessão com a base Ferramentas
      await supabaseFerramentas.auth.setSession(data.session);
    }

    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

export const signOut = async () => {
  try {
    // Fazer logout em ambas as bases
    await Promise.all([
      supabaseDashboard.auth.signOut(),
      supabaseFerramentas.auth.signOut()
    ]);
    return { error: null };
  } catch (err) {
    return { error: err };
  }
};

export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabaseDashboard.auth.getUser();
    if (error) throw error;
    return user;
  } catch (err) {
    return null;
  }
};

// Função para sincronizar autenticação entre bases
export async function syncAuthBetweenDatabases(session: any) {
  try {
    if (session) {
      await Promise.all([
        supabaseDashboard.auth.setSession(session),
        supabaseFerramentas.auth.setSession(session)
      ]);
    }
  } catch (error) {
    console.error('Erro ao sincronizar autenticação:', error);
  }
}
