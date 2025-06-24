import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  // Get all environment variables related to auth
  const envVars = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 
      process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'NOT SET',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 
      '***HIDDEN***' : 'NOT SET'
  }
  
  // Construct URLs that NextAuth will use
  const baseUrl = process.env.NEXTAUTH_URL || 'NOT SET'
  const expectedCallbacks = {
    google: `${baseUrl}/api/auth/callback/google`,
    signIn: `${baseUrl}/api/auth/signin`,
    signOut: `${baseUrl}/api/auth/signout`,
    error: `${baseUrl}/api/auth/error`
  }
  
  // Get request information
  const requestInfo = {
    url: request.url,
    headers: {
      host: request.headers.get('host'),
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      'x-forwarded-proto': request.headers.get('x-forwarded-proto'),
      'x-forwarded-host': request.headers.get('x-forwarded-host')
    }
  }
  
  // Check for common OAuth issues
  const issues = []
  
  if (!process.env.NEXTAUTH_URL) {
    issues.push('NEXTAUTH_URL not set')
  }
  
  if (process.env.NEXTAUTH_URL?.includes('localhost') && process.env.NODE_ENV === 'production') {
    issues.push('NEXTAUTH_URL contains localhost in production')
  }
  
  if (!process.env.GOOGLE_CLIENT_ID) {
    issues.push('GOOGLE_CLIENT_ID not set')
  }
  
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    issues.push('GOOGLE_CLIENT_SECRET not set')
  }
  
  if (process.env.NEXTAUTH_URL !== process.env.NEXT_PUBLIC_APP_URL) {
    issues.push('NEXTAUTH_URL and NEXT_PUBLIC_APP_URL do not match')
  }
  
  return NextResponse.json({
    session: session || null,
    environment: envVars,
    expectedUrls: expectedCallbacks,
    requestInfo,
    issues: issues.length > 0 ? issues : 'No issues detected',
    recommendations: [
      'Ensure NEXTAUTH_URL matches your production domain (https://kylo.video)',
      'Verify Google Console has the correct callback URL',
      'Clear browser cookies and cache',
      'Test in incognito mode'
    ]
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  })
}