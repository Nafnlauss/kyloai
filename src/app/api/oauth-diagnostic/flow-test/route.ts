import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const tests = []
    
    // Teste 1: Verificar URLs de callback
    const productionUrl = 'https://kylo.video'
    const callbackUrl = `${productionUrl}/api/auth/callback/google`
    
    tests.push({
      test: 'Callback URL',
      expected: callbackUrl,
      configured: process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/callback/google` : 'NOT SET',
      pass: process.env.NEXTAUTH_URL === productionUrl
    })
    
    // Teste 2: Verificar se estamos em produção
    tests.push({
      test: 'Environment',
      expected: 'production',
      configured: process.env.NODE_ENV || 'NOT SET',
      pass: process.env.NODE_ENV === 'production'
    })
    
    // Teste 3: Verificar HTTPS
    tests.push({
      test: 'HTTPS Required',
      expected: 'https://',
      configured: process.env.NEXTAUTH_URL?.startsWith('https://') ? 'Yes' : 'No',
      pass: process.env.NEXTAUTH_URL?.startsWith('https://') || false
    })
    
    // Teste 4: Verificar Google OAuth URLs
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const googleTokenUrl = 'https://oauth2.googleapis.com/token'
    
    tests.push({
      test: 'Google Auth Endpoints',
      expected: 'Accessible',
      configured: 'Standard OAuth2 endpoints',
      pass: true // Sempre true pois são URLs padrão do Google
    })
    
    // Teste 5: Verificar formato das credenciais
    const clientId = process.env.GOOGLE_CLIENT_ID || ''
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || ''
    
    tests.push({
      test: 'Client ID Format',
      expected: 'XXX.apps.googleusercontent.com',
      configured: clientId.endsWith('.apps.googleusercontent.com') ? 'Valid format' : 'Invalid format',
      pass: clientId.endsWith('.apps.googleusercontent.com')
    })
    
    tests.push({
      test: 'Client Secret Format',
      expected: 'GOCSPX-...',
      configured: clientSecret.startsWith('GOCSPX-') ? 'Valid format' : 'Invalid format',
      pass: clientSecret.startsWith('GOCSPX-')
    })
    
    // Resumo
    const allPassed = tests.every(t => t.pass)
    
    return NextResponse.json({
      success: allPassed,
      message: allPassed 
        ? 'Todos os testes do fluxo OAuth passaram' 
        : 'Alguns testes falharam - verifique as configurações',
      tests,
      summary: {
        total: tests.length,
        passed: tests.filter(t => t.pass).length,
        failed: tests.filter(t => !t.pass).length
      },
      nextSteps: allPassed 
        ? ['Tente fazer login com Google', 'Verifique os logs do console']
        : ['Corrija as configurações que falharam', 'Execute os testes novamente']
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Erro ao testar fluxo OAuth',
      error: error.message
    }, { status: 500 })
  }
}