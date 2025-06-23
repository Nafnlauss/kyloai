import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Rotas que requerem autenticação
        const protectedPaths = [
          '/studio',
          '/dashboard',
          '/settings',
          '/gallery',
          '/generate',
          '/billing',
          '/credits',
          '/admin'
        ]
        
        const pathname = req.nextUrl.pathname
        
        // Verifica se a rota atual requer autenticação
        const isProtectedRoute = protectedPaths.some(path => 
          pathname.startsWith(path)
        )
        
        // Se é uma rota protegida, verifica se tem token
        if (isProtectedRoute) {
          return !!token
        }
        
        // Rotas públicas sempre permitidas
        return true
      }
    },
    pages: {
      signIn: '/login',
      error: '/login'
    }
  }
)

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