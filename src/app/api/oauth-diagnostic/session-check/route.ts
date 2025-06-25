import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Verificar sessão
    const session = await auth()
    
    // Verificar cookies
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    
    // Procurar por cookies de sessão
    const sessionCookies = allCookies.filter(c => 
      c.name.includes('authjs') || 
      c.name.includes('session') ||
      c.name.includes('csrf')
    )
    
    // Verificar tokens específicos
    const sessionToken = cookieStore.get('authjs.session-token') || 
                        cookieStore.get('__Secure-authjs.session-token')
    const csrfToken = cookieStore.get('authjs.csrf-token') ||
                      cookieStore.get('__Host-authjs.csrf-token')
    
    return NextResponse.json({
      authenticated: !!session,
      session: session ? {
        user: {
          id: session.user?.id,
          email: session.user?.email,
          name: session.user?.name,
          image: session.user?.image
        },
        expires: session.expires
      } : null,
      cookies: {
        total: allCookies.length,
        sessionCookies: sessionCookies.map(c => ({
          name: c.name,
          hasValue: !!c.value,
          httpOnly: c.httpOnly,
          secure: c.secure,
          sameSite: c.sameSite
        })),
        hasSessionToken: !!sessionToken,
        hasCsrfToken: !!csrfToken
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        isProduction: process.env.NODE_ENV === 'production'
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      authenticated: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
}