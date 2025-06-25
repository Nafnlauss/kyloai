import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET(request: Request) {
  // Force load database config
  await import('@/lib/database-config');
  
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  
  // Get all headers
  const headersList = headers();
  const headersObj: Record<string, string> = {};
  headersList.forEach((value, key) => {
    headersObj[key] = value;
  });
  
  // Test database connection
  let dbTest = { status: 'not tested' };
  try {
    const { prisma } = await import('@/lib/prisma');
    await prisma.$connect();
    dbTest = { status: 'connected' };
    await prisma.$disconnect();
  } catch (err: any) {
    dbTest = { 
      status: 'failed', 
      error: err.message,
      code: err.code,
      meta: err.meta
    };
  }
  
  // Check OAuth providers
  let providers = {};
  try {
    const providersRes = await fetch(`${process.env.NEXTAUTH_URL || 'https://kylo.video'}/api/auth/providers`);
    providers = await providersRes.json();
  } catch (err: any) {
    providers = { error: err.message };
  }
  
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    error: error || 'none',
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? {
        length: process.env.DATABASE_URL.length,
        preview: process.env.DATABASE_URL.substring(0, 30) + '...',
        hasSpaces: process.env.DATABASE_URL.includes(' '),
        hasNewlines: /[\r\n]/.test(process.env.DATABASE_URL)
      } : 'NOT SET',
    },
    databaseTest: dbTest,
    providers,
    headers: {
      host: headersObj.host,
      referer: headersObj.referer,
      'user-agent': headersObj['user-agent']
    }
  });
}