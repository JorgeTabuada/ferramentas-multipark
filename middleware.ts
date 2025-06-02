// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Usar a base Dashboard como principal para autenticação
  const supabase = createMiddlewareClient({ 
    req, 
    res,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_DASHBOARD_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_DASHBOARD_ANON_KEY!
  });

  // Verificar se o utilizador está autenticado
  const { data: { user } } = await supabase.auth.getUser();

  // Definir rotas que precisam de autenticação
  const protectedRoutes = [
    '/dashboard',
    '/apps',
    '/reservas',
    '/recolhas',
    '/entregas',
    '/caixa',
    '/admin'
  ];

  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  // Se é rota protegida e não está autenticado, redirecionar para login
  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Se está autenticado mas tenta aceder ao login, redirecionar para dashboard
  if (user && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Se está autenticado, verificar perfil e permissões (opcional)
  if (user && isProtectedRoute) {
    try {
      // Buscar perfil do utilizador
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, ativo, parque_id_principal')
        .eq('id', user.id)
        .single();

      // Se não tem perfil ou não está ativo, bloquear acesso
      if (!profile || !profile.ativo) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }

      // Adicionar headers com info do utilizador para as páginas
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', user.id);
      requestHeaders.set('x-user-role', profile.role || 'user');
      requestHeaders.set('x-user-parque', profile.parque_id_principal || '');
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

    } catch (error) {
      console.error('Erro no middleware:', error);
      // Em caso de erro, deixar passar mas logar
      return NextResponse.next();
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (opcional, depende se queres proteger APIs)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};