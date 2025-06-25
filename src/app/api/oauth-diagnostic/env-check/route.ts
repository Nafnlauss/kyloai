import { NextResponse } from 'next/server'

export async function GET() {
  const requiredEnvVars = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
  }

  const missing = []
  const configured = []
  
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value) {
      missing.push(key)
    } else {
      configured.push({
        key,
        value: key.includes('SECRET') || key.includes('PASSWORD') 
          ? value.substring(0, 5) + '...' 
          : value
      })
    }
  }
  
  // Verificar formato das credenciais do Google
  const googleIdFormat = process.env.GOOGLE_CLIENT_ID?.endsWith('.apps.googleusercontent.com') || false
  const googleSecretFormat = process.env.GOOGLE_CLIENT_SECRET?.startsWith('GOCSPX-') || false
  
  const googleConfigCorrect = googleIdFormat && googleSecretFormat

  return NextResponse.json({
    allSet: missing.length === 0,
    missing,
    configured,
    googleConfigCorrect,
    googleConfig: {
      hasClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      clientIdFormat: googleIdFormat ? 'Valid' : 'Invalid',
      clientSecretFormat: googleSecretFormat ? 'Valid' : 'Invalid',
      clientIdLength: process.env.GOOGLE_CLIENT_ID?.length,
      secretPrefix: process.env.GOOGLE_CLIENT_SECRET?.substring(0, 10)
    },
    urls: {
      nextAuthUrl: process.env.NEXTAUTH_URL,
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
      currentUrl: process.env.VERCEL_URL || 'localhost'
    }
  })
}