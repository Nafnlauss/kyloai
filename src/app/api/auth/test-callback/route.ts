import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Log all parameters
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  console.log('🔍 Test callback received:', params);
  
  // Test database connection directly
  let dbResult = null;
  try {
    const { prisma } = await import('@/lib/prisma');
    const userCount = await prisma.user.count();
    dbResult = { success: true, userCount };
  } catch (error: any) {
    dbResult = { 
      success: false, 
      error: error.message,
      stack: error.stack
    };
    console.error('🔴 Database test failed:', error);
  }
  
  return NextResponse.json({
    message: 'OAuth callback test',
    params,
    database: dbResult,
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      hasGoogleCreds: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    }
  });
}