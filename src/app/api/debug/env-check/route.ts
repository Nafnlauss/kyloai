import { NextResponse } from 'next/server'

export async function GET() {
  // Mais detalhado para debug
  const env = process.env;
  
  return NextResponse.json({
    status: 'Environment Debug',
    nodeEnv: env.NODE_ENV,
    nextAuthUrl: {
      value: env.NEXTAUTH_URL || 'NOT SET',
      length: env.NEXTAUTH_URL?.length || 0,
      trimmed: env.NEXTAUTH_URL?.trim() || 'NOT SET',
      hasTrailingSlash: env.NEXTAUTH_URL?.endsWith('/') || false,
      rawValue: JSON.stringify(env.NEXTAUTH_URL)
    },
    googleCreds: {
      clientId: {
        isSet: !!env.GOOGLE_CLIENT_ID,
        length: env.GOOGLE_CLIENT_ID?.length || 0,
        prefix: env.GOOGLE_CLIENT_ID?.substring(0, 10) || 'NOT SET'
      },
      clientSecret: {
        isSet: !!env.GOOGLE_CLIENT_SECRET,
        length: env.GOOGLE_CLIENT_SECRET?.length || 0
      }
    },
    nextAuthSecret: {
      isSet: !!env.NEXTAUTH_SECRET,
      length: env.NEXTAUTH_SECRET?.length || 0
    },
    // Verifica se existem variáveis com nomes similares (typos comuns)
    possibleTypos: {
      NEXT_AUTH_URL: !!env.NEXT_AUTH_URL,
      NEXTAUTH_URI: !!env.NEXTAUTH_URI,
      NEXT_PUBLIC_URL: !!env.NEXT_PUBLIC_URL,
      AUTH_URL: !!env.AUTH_URL,
      GOOGLE_ID: !!env.GOOGLE_ID,
      GOOGLE_SECRET: !!env.GOOGLE_SECRET
    },
    // Lista todas as variáveis que começam com NEXT ou GOOGLE
    relatedVars: Object.keys(env)
      .filter(key => key.startsWith('NEXT') || key.startsWith('GOOGLE'))
      .map(key => ({
        name: key,
        length: env[key]?.length || 0,
        isSet: !!env[key]
      })),
    timestamp: new Date().toISOString()
  })
}