import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'

// Safe database queries with fallbacks
async function safeQuery<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise
  } catch (error) {
    console.error('Query error:', error)
    return fallback
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // For demo mode, allow access
    if (!session && process.env.ADMIN_DEMO_MODE !== 'true') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '24h'

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    
    switch (timeRange) {
      case '1h':
        startDate.setHours(now.getHours() - 1)
        break
      case '24h':
        startDate.setHours(now.getHours() - 24)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
    }

    // Execute queries with error handling
    const totalUsers = await safeQuery(prisma.user.count(), 0)
    
    const activeUsers = await safeQuery(
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: startDate
          }
        }
      }),
      0
    )
    
    const totalVideos = await safeQuery(
      prisma.video.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      0
    )
    
    const videosByStatus = await safeQuery(
      prisma.video.groupBy({
        by: ['status'],
        where: {
          createdAt: {
            gte: startDate
          }
        },
        _count: true
      }),
      []
    )
    
    const videosByProvider = await safeQuery(
      prisma.video.groupBy({
        by: ['provider'],
        where: {
          createdAt: {
            gte: startDate
          }
        },
        _count: true,
        _sum: {
          creditsUsed: true
        }
      }),
      []
    )
    
    const totalCreditsUsed = await safeQuery(
      prisma.video.aggregate({
        where: {
          createdAt: {
            gte: startDate
          }
        },
        _sum: {
          creditsUsed: true
        }
      }),
      { _sum: { creditsUsed: null } }
    )
    
    const totalRevenue = await safeQuery(
      prisma.transaction.aggregate({
        where: {
          createdAt: {
            gte: startDate
          },
          status: 'COMPLETED'
        },
        _sum: {
          amount: true
        }
      }),
      { _sum: { amount: null } }
    )
    
    const recentTransactions = await safeQuery(
      prisma.transaction.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      0
    )
    
    const topUsers = await safeQuery(
      prisma.user.findMany({
        where: {
          videos: {
            some: {
              createdAt: {
                gte: startDate
              }
            }
          }
        },
        select: {
          id: true,
          email: true,
          name: true,
          videos: {
            where: {
              createdAt: {
                gte: startDate
              }
            },
            select: {
              creditsUsed: true
            }
          }
        },
        take: 10
      }),
      []
    )

    // Simple hourly data
    const hourlyData = []
    for (let i = 0; i < 24; i++) {
      hourlyData.push({
        hour: i,
        videos: 0,
        credits: 0,
        revenue: 0
      })
    }

    // Format response
    const metrics = {
      overview: {
        totalUsers,
        activeUsers,
        totalVideos,
        totalCreditsUsed: totalCreditsUsed._sum.creditsUsed || 0,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalTransactions: recentTransactions
      },
      videosByStatus: videosByStatus.map(item => ({
        status: item.status,
        count: item._count,
        percentage: totalVideos > 0 ? (item._count / totalVideos) * 100 : 0
      })),
      videosByProvider: videosByProvider.map(item => ({
        provider: item.provider,
        count: item._count,
        credits: item._sum.creditsUsed || 0,
        percentage: totalVideos > 0 ? (item._count / totalVideos) * 100 : 0
      })),
      topUsers: topUsers.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        videoCount: user.videos.length,
        creditsUsed: user.videos.reduce((sum, v) => sum + v.creditsUsed, 0)
      })),
      hourlyData,
      timeRange
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Metrics API error:', error)
    
    // Return empty metrics structure
    return NextResponse.json({
      overview: {
        totalUsers: 0,
        activeUsers: 0,
        totalVideos: 0,
        totalCreditsUsed: 0,
        totalRevenue: 0,
        totalTransactions: 0
      },
      videosByStatus: [],
      videosByProvider: [],
      topUsers: [],
      hourlyData: [],
      timeRange: '24h'
    })
  }
}