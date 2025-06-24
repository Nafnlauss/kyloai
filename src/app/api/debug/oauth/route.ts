import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authUrl = process.env.NEXTAUTH_URL || 'NOT SET'
  const currentUrl = request.url
  const headers = request.headers
  
  // Get the actual host being used
  const host = headers.get('host') || 'unknown'
  const protocol = headers.get('x-forwarded-proto') || 'https'
  const fullUrl = `${protocol}://${host}`
  
  return NextResponse.json({
    debug: {
      NEXTAUTH_URL: authUrl,
      currentRequestUrl: currentUrl,
      detectedHost: host,
      detectedProtocol: protocol,
      constructedUrl: fullUrl,
      expectedCallbackUrl: `${authUrl}/api/auth/callback/google`,
      actualCallbackUrl: `${fullUrl}/api/auth/callback/google`,
      googleClientId: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
    },
    fix: {
      railway: `Set NEXTAUTH_URL=${fullUrl}`,
      googleConsole: [
        `Add JavaScript origin: ${fullUrl}`,
        `Add redirect URI: ${fullUrl}/api/auth/callback/google`
      ]
    }
  })
}