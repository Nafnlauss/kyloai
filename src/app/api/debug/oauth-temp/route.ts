import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'OAuth Debug Endpoint',
    environment: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
    },
    requiredUrls: {
      javascriptOrigins: [
        'https://kylo.video',
        'https://www.kylo.video'
      ],
      redirectUris: [
        'https://kylo.video/api/auth/callback/google',
        'https://www.kylo.video/api/auth/callback/google'
      ]
    },
    instructions: [
      '1. Verifique se NEXTAUTH_URL=https://kylo.video em produção',
      '2. Configure as URLs acima no Google Console',
      '3. Certifique-se que o app está em modo Production',
      '4. Teste em aba anônima',
      '5. REMOVA este endpoint após resolver'
    ]
  })
}
