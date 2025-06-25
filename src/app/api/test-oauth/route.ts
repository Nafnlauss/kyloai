import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  // Test OAuth configuration
  const config = {
    nextAuthUrl: process.env.NEXTAUTH_URL,
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'CONFIGURED' : 'MISSING',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'CONFIGURED' : 'MISSING',
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'CONFIGURED' : 'MISSING',
    nodeEnv: process.env.NODE_ENV,
  };
  
  // Test callback URL
  const callbackUrl = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;
  
  return NextResponse.json({
    error: error || 'No error parameter',
    errorDescription: errorDescription || 'No description',
    config,
    callbackUrl,
    headers: {
      host: request.headers.get('host'),
      referer: request.headers.get('referer'),
    },
    timestamp: new Date().toISOString()
  });
}