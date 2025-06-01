// lib/supabase/config.ts
export const supabaseConfig = {
  // Base de Dados Principal - Dashboard (Operacional)
  dashboard: {
    url: process.env.NEXT_PUBLIC_SUPABASE_DASHBOARD_URL || "https://ioftqsvjqwjeprsckeym.supabase.co",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_DASHBOARD_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvZnRxc3ZqcXdqZXByc2NrZXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNTYwNzQsImV4cCI6MjA2MjczMjA3NH0.TXDfhioMFVNxLhjKgpXAxnKCPOl5n8QWpOkX2eafbYw",
    serviceRoleKey: process.env.SUPABASE_DASHBOARD_SERVICE_ROLE_KEY,
    projectId: 'ioftqsvjqwjeprsckeym',
    description: 'Base operacional - Reservas, Caixa, Movimentações'
  },
  
  // Base de Dados Secundária - Ferramentas (RH e Analytics)
  ferramentas: {
    url: process.env.NEXT_PUBLIC_SUPABASE_FERRAMENTAS_URL || "https://dzdeewebxsfxeabdxtiq.supabase.co",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_FERRAMENTAS_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6ZGVld2VieHNmeGVhYmR4dGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MzA3ODAsImV4cCI6MjA2MjUwNjc4MH0.45f2zLmFlr8td1iOJV8FYPoVUtn7x5R7NHw6Wq_Ceo8",
    serviceRoleKey: process.env.SUPABASE_FERRAMENTAS_SERVICE_ROLE_KEY,
    projectId: 'dzdeewebxsfxeabdxtiq',
    description: 'Base de apoio - RH, Formação, Auditoria, Analytics'
  }
};

// Validação das variáveis de ambiente
export function validateSupabaseConfig() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_DASHBOARD_URL',
    'NEXT_PUBLIC_SUPABASE_DASHBOARD_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_FERRAMENTAS_URL',
    'NEXT_PUBLIC_SUPABASE_FERRAMENTAS_ANON_KEY'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.warn(`Variáveis de ambiente em falta (a usar defaults): ${missing.join(', ')}`);
  }
}
