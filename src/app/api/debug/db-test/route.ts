import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Teste simples de conexão
    await prisma.$connect()
    
    // Teste de query simples
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      status: 'Database connection OK',
      userCount,
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      directUrl: process.env.DIRECT_URL ? 'SET' : 'NOT SET',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database connection error:', error)
    
    return NextResponse.json({
      status: 'Database connection FAILED',
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      directUrl: process.env.DIRECT_URL ? 'SET' : 'NOT SET',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
