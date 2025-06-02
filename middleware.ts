import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Criar client do Supabase (usa as variáveis padrão NEXT_PUBLIC_SUPABASE_URL/ANON_KEY)
  const supabase = createMiddlewareClient({ req, res })
  
  // Verificar sessão do utilizador
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // URLs que precisam de autenticação
  const protectedPaths = ['/dashboard', '/admin', '/profile']
  
  // URLs que são só para utilizadores NÃO autenticados (login, register)
  const authPaths = ['/login', '/register', '/auth']
  
  const { pathname } = req.nextUrl

  // Se está numa rota protegida e não tem sessão -> redirecionar para login
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!session) {
      const redirectUrl = new URL('/login', req.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Se está numa rota de auth e JÁ tem sessão -> redirecionar para dashboard
  if (authPaths.some(path => pathname.startsWith(path))) {
    if (session) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Adicionar headers úteis para debugging
  const response = NextResponse.next()
  response.headers.set('x-middleware-cache', 'no-cache')
  
  return response
}

export const config = {
  // Apenas rotas que precisam do middleware
  matcher: [
    /*
     * Aplicar middleware a todas as rotas exceto:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (png, jpg, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
