import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    // Verificar sessão
    const session = await auth();
    
    // Verificar cookies
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('authjs.session-token') || 
                        cookieStore.get('__Secure-authjs.session-token');
    
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
      hasSessionCookie: !!sessionToken,
      cookieName: sessionToken?.name,
      timestamp: new Date().toISOString()
    });
    
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      authenticated: false
    }, { status: 500 });
  }
}