import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth/auth-options'

export async function GET() {
  try {
    // Verificar providers configurados
    const providers = authOptions.providers?.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type
    }))
    
    // Verificar callbacks configurados
    const callbacks = {
      hasSignIn: !!authOptions.callbacks?.signIn,
      hasJwt: !!authOptions.callbacks?.jwt,
      hasSession: !!authOptions.callbacks?.session,
      hasRedirect: !!authOptions.callbacks?.redirect
    }
    
    // Verificar configurações gerais
    const config = {
      session: authOptions.session,
      pages: authOptions.pages,
      trustHost: authOptions.trustHost,
      useSecureCookies: authOptions.useSecureCookies,
      debug: authOptions.debug
    }
    
    // Verificar Google Provider específico
    const googleProvider = authOptions.providers?.find(p => p.id === 'google')
    const googleConfig = googleProvider ? {
      hasClientId: !!(googleProvider as any).options?.clientId,
      hasClientSecret: !!(googleProvider as any).options?.clientSecret,
      clientIdLength: (googleProvider as any).options?.clientId?.length,
      clientSecretLength: (googleProvider as any).options?.clientSecret?.length
    } : null
    
    return NextResponse.json({
      valid: true,
      message: 'Configuração NextAuth válida',
      providers,
      callbacks,
      config,
      googleConfig,
      adapter: {
        hasAdapter: !!authOptions.adapter,
        type: authOptions.adapter ? 'PrismaAdapter' : 'none'
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      valid: false,
      message: 'Erro ao verificar configuração NextAuth',
      error: error.message
    }, { status: 500 })
  }
}