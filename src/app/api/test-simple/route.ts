import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'Endpoint funcionando!',
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET'
    }
  })
}
