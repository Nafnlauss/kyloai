import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const tests = {
    connection: false,
    userTable: false,
    accountTable: false,
    createUser: false,
    error: null as any
  };
  
  try {
    // Test 1: Connection
    await prisma.$connect();
    tests.connection = true;
    
    // Test 2: User table
    const userCount = await prisma.user.count();
    tests.userTable = true;
    
    // Test 3: Account table
    const accountCount = await prisma.account.count();
    tests.accountTable = true;
    
    // Test 4: Try to create a test user
    const testUser = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        emailVerified: new Date(),
        credits: 0,
        creditsLastReset: new Date(),
      }
    });
    
    // Delete the test user
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    
    tests.createUser = true;
    
  } catch (error: any) {
    tests.error = {
      message: error.message,
      code: error.code,
      meta: error.meta
    };
    console.error('🔴 Prisma test error:', error);
  } finally {
    await prisma.$disconnect();
  }
  
  return NextResponse.json({
    tests,
    prismaVersion: '@prisma/client',
    timestamp: new Date().toISOString()
  });
}