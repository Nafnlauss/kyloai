/**
 * 🔍 ENDPOINT DE DEBUG TEMPORÁRIO PARA OAUTH
 * 
 * INSTRUÇÕES DE USO:
 * 1. Copie este arquivo para: src/app/api/debug/oauth-temp/route.ts
 * 2. Acesse: https://seu-dominio.com/api/debug/oauth-temp
 * 3. Use as informações para configurar Google Console
 * 4. REMOVA o arquivo após resolver o problema
 */

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const host = request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  const currentUrl = `${protocol}://${host}`
  const authUrl = process.env.NEXTAUTH_URL
  
  return NextResponse.json({
    debug: {
      NEXTAUTH_URL: authUrl,
      currentRequestUrl: currentUrl,
      detectedHost: host,
      detectedProtocol: protocol,
      constructedUrl: currentUrl,
      expectedCallbackUrl: `${authUrl}/api/auth/callback/google`,
      actualCallbackUrl: `${currentUrl}/api/auth/callback/google`,
      googleClientId: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
      headers: {
        host: request.headers.get('host'),
        'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
        'x-forwarded-host': request.headers.get('x-forwarded-host'),
        'x-real-ip': request.headers.get('x-real-ip'),
      }
    },
    fix: {
      railway: `Set NEXTAUTH_URL=${currentUrl}`,
      googleConsole: [
        `Add JavaScript origin: ${currentUrl}`,
        `Add redirect URI: ${currentUrl}/api/auth/callback/google`
      ]
    },
    instructions: {
      step1: "Configure NEXTAUTH_URL in your hosting platform",
      step2: "Add the URLs above to Google Console",
      step3: "Redeploy your application",
      step4: "Test OAuth again",
      step5: "REMOVE this debug endpoint after fixing"
    }
  })
}
