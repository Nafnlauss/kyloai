import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch aggregate stats
    const [
      total,
      statusCounts,
      creditsUsed,
      storageStats
    ] = await Promise.all([
      // Total videos
      prisma.video.count(),
      
      // Count by status
      prisma.video.groupBy({
        by: ['status'],
        _count: true,
      }),
      
      // Total credits used
      prisma.video.aggregate({
        _sum: {
          creditsUsed: true,
        },
      }),
      
      // Storage estimation (simplified - in real app would check actual file sizes)
      prisma.video.aggregate({
        _count: {
          url: true,
        },
        where: {
          url: { not: null },
        },
      }),
    ])

    // Process status counts
    const statusMap = statusCounts.reduce((acc, curr) => {
      acc[curr.status.toLowerCase()] = curr._count
      return acc
    }, {} as Record<string, number>)

    // Estimate storage (assuming average 50MB per video)
    const estimatedStorageGB = ((storageStats._count.url || 0) * 50) / 1024
    const storageUsed = estimatedStorageGB < 1 
      ? `${Math.round(estimatedStorageGB * 1024)} MB`
      : `${estimatedStorageGB.toFixed(2)} GB`

    return NextResponse.json({
      total,
      completed: statusMap.completed || 0,
      processing: (statusMap.processing || 0) + (statusMap.queued || 0),
      failed: statusMap.failed || 0,
      totalCreditsUsed: creditsUsed._sum.creditsUsed || 0,
      storageUsed,
    })
  } catch (error) {
    console.error('Error fetching video stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}