import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Basic health check without database dependency
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      services: {
        app: 'running'
      }
    }

    // Only check database if configured
    if (process.env.DATABASE_URL) {
      try {
        const { prisma } = await import('@/lib/prisma')
        await prisma.$queryRaw`SELECT 1`
        health.services = { ...health.services, database: 'connected' }
      } catch (dbError) {
        health.services = { ...health.services, database: 'error' }
      }
    }

    // Check Redis status
    health.services = { 
      ...health.services, 
      redis: process.env.REDIS_URL ? 'configured' : 'not configured' 
    }
    
    return NextResponse.json(health)
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 503 }
    )
  }
}