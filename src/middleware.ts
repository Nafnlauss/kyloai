import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { handleReferral } from '@/middleware/referral'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Handle referral parameter
  const { searchParams } = new URL(request.url)
  if (searchParams.has('ref')) {
    return handleReferral(request)
  }

  // Temporariamente desabilitado para resolver o erro
  // TODO: Reativar rate limiting e CSRF protection depois

  // Rotas públicas (não precisam de autenticação)
  const publicPaths = [
    '/',              // Landing page
    '/login',         // Login page
    '/register',      // Register page
    '/reset',         // Password reset
    '/api',           // All API routes
    '/privacy',       // Privacy policy
    '/terms',         // Terms of service
    '/about',         // About page
    '/contact',       // Contact page
    '/videos/generate', // Temporariamente público para teste
  ]
  
  // Verifica se é uma rota pública
  const isPublicRoute = publicPaths.some(path => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  })
  
  // Por enquanto, permitir todas as rotas
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ]
}