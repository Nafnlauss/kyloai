import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get video stats
    const [statusCounts, providerCounts, totalCredits] = await Promise.all([
      // Count by status
      prisma.video.groupBy({
        by: ['status'],
        _count: true
      }),
      // Count by provider
      prisma.video.groupBy({
        by: ['provider'],
        _count: true,
        _sum: {
          creditsUsed: true
        }
      }),
      // Total credits used
      prisma.video.aggregate({
        _sum: {
          creditsUsed: true
        },
        _avg: {
          creditsUsed: true
        }
      })
    ])

    return NextResponse.json({
      byStatus: statusCounts.reduce((acc, curr) => ({
        ...acc,
        [curr.status]: curr._count
      }), {}),
      byProvider: providerCounts.map(p => ({
        provider: p.provider,
        count: p._count,
        totalCredits: p._sum.creditsUsed || 0
      })),
      totals: {
        totalCreditsUsed: totalCredits._sum.creditsUsed || 0,
        averageCreditsPerVideo: totalCredits._avg.creditsUsed || 0
      }
    })
  } catch (error) {
    console.error('Video stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video stats' },
      { status: 500 }
    )
  }
}