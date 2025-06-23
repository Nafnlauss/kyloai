import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Rotas públicas (não precisam de autenticação)
  const publicPaths = [
    '/',              // Landing page APENAS
    '/login',         // Login page
    '/register',      // Register page
    '/reset',         // Password reset
    '/api/auth',      // Auth API routes
    '/api/health',    // Health check
    '/api/contact',   // Contact form API
    '/api/stripe/webhook', // Stripe webhooks
    '/privacy',       // Privacy policy
    '/terms',         // Terms of service
    '/about',         // About page
    '/contact',       // Contact page
  ]
  
  // Verifica se é uma rota pública
  const isPublicRoute = publicPaths.some(path => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  })
  
  // Se NÃO é uma rota pública, requer autenticação
  if (!isPublicRoute) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ]
}