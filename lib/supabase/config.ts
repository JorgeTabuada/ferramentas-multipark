export const supabaseConfig = {
  dashboard: {
    url: process.env.NEXT_PUBLIC_SUPABASE_DASHBOARD_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_DASHBOARD_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_DASHBOARD_SERVICE_ROLE_KEY!,
    projectId: 'ioftqsvjqwjeprsckeym'
  },
  ferramentas: {
    url: process.env.NEXT_PUBLIC_SUPABASE_FERRAMENTAS_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_FERRAMENTAS_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_FERRAMENTAS_SERVICE_ROLE_KEY!,
    projectId: 'dzdeewebxsfxeabdxtiq'
  }
};

export function validateSupabaseConfig() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_DASHBOARD_URL',
    'NEXT_PUBLIC_SUPABASE_DASHBOARD_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_FERRAMENTAS_URL',
    'NEXT_PUBLIC_SUPABASE_FERRAMENTAS_ANON_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`⚠️ Variáveis em falta: ${missing.join(', ')}`);
  }
  
  return missing.length === 0;
}