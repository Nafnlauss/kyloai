import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'

// This endpoint will aggregate video generation logs from multiple sources
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

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const provider = searchParams.get('provider')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // For now, we'll use our database records
    // In the future, we can add direct API calls to Luma/Kling/etc
    const where = {
      ...(provider && { provider }),
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    }

    const [logs, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.video.count({ where })
    ])

    // Calculate costs and statistics
    const stats = await prisma.video.groupBy({
      by: ['provider', 'status'],
      where,
      _count: true,
      _sum: {
        creditsUsed: true,
        duration: true
      }
    })

    return NextResponse.json({
      logs: logs.map(log => ({
        id: log.id,
        provider: log.provider,
        status: log.status,
        prompt: log.prompt,
        creditsUsed: log.creditsUsed,
        duration: log.duration,
        url: log.url,
        thumbnailUrl: log.thumbnailUrl,
        errorMessage: log.errorMessage,
        createdAt: log.createdAt,
        processingTime: log.processingEndedAt && log.processingStartedAt
          ? new Date(log.processingEndedAt).getTime() - new Date(log.processingStartedAt).getTime()
          : null,
        user: {
          email: log.user.email,
          name: log.user.name
        }
      })),
      stats: stats.map(s => ({
        provider: s.provider,
        status: s.status,
        count: s._count,
        totalCredits: s._sum.creditsUsed || 0,
        totalDuration: s._sum.duration || 0
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Video logs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video logs' },
      { status: 500 }
    )
  }
}