import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
  
  if (!clientId) {
    return NextResponse.json({
      error: 'GOOGLE_CLIENT_ID não configurado'
    }, { status: 400 })
  }
  
  // Construir URL de autorização do Google
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  googleAuthUrl.searchParams.set('client_id', clientId)
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
  googleAuthUrl.searchParams.set('response_type', 'code')
  googleAuthUrl.searchParams.set('scope', 'openid email profile')
  googleAuthUrl.searchParams.set('access_type', 'offline')
  googleAuthUrl.searchParams.set('prompt', 'select_account')
  
  // Testar se o client_id é válido fazendo uma requisição
  try {
    // Este endpoint retorna informações sobre o client
    const discoveryUrl = 'https://accounts.google.com/.well-known/openid-configuration'
    const discoveryResponse = await fetch(discoveryUrl)
    const discoveryData = await discoveryResponse.json()
    
    return NextResponse.json({
      status: 'ready',
      googleAuthUrl: googleAuthUrl.toString(),
      configuration: {
        clientId,
        redirectUri,
        currentUrl: process.env.NEXTAUTH_URL,
        isProduction: process.env.NODE_ENV === 'production'
      },
      discovery: {
        issuer: discoveryData.issuer,
        authorizationEndpoint: discoveryData.authorization_endpoint,
        tokenEndpoint: discoveryData.token_endpoint,
        userinfoEndpoint: discoveryData.userinfo_endpoint
      },
      testInstructions: [
        '1. Copie a URL googleAuthUrl acima',
        '2. Abra em uma nova aba',
        '3. Veja se aparece a tela de login do Google',
        '4. Se aparecer erro de redirect_uri_mismatch, a URI não está configurada no Google Console',
        '5. Se aparecer erro de invalid_client, o client_id está incorreto'
      ]
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Erro ao verificar configuração do Google',
      error: error.message
    }, { status: 500 })
  }
}