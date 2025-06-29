import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'

// GET /api/admin/metrics/simple - Simplified metrics for debugging
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // For demo mode, allow access
    if (!session && process.env.ADMIN_DEMO_MODE !== 'true') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Simple counts
    const [totalUsers, totalVideos, totalTransactions] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.video.count().catch(() => 0),
      prisma.transaction.count().catch(() => 0)
    ])

    const metrics = {
      overview: {
        totalUsers,
        totalVideos,
        totalTransactions,
        activeUsers: 0,
        totalCreditsUsed: 0,
        totalRevenue: 0
      },
      videosByStatus: [],
      videosByProvider: [],
      topUsers: [],
      hourlyData: [],
      timeRange: '24h'
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error in simple metrics:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch metrics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}