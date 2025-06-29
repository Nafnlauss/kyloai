import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'

// GET /api/admin/metrics - Get real metrics from database
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

    // Fetch real data from database with error handling for each query
    const [
      totalUsers,
      activeUsers,
      totalVideos,
      videosByStatus,
      videosByProvider,
      totalCreditsUsed,
      totalRevenue,
      recentTransactions,
      topUsers
    ] = await Promise.all([
      // Total users
      prisma.user.count().catch(() => 0),
      
      // Active users in time range
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: startDate
          }
        }
      }),
      
      // Total videos in time range
      prisma.video.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Videos by status
      prisma.video.groupBy({
        by: ['status'],
        where: {
          createdAt: {
            gte: startDate
          }
        },
        _count: true
      }),
      
      // Videos by provider
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
      
      // Total credits used
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
      
      // Total revenue (from transactions)
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
      
      // Recent transactions count
      prisma.transaction.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Top users by video creation - simplified query
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
      })
    ])

    // Get hourly data for charts
    const hourlyData = await getHourlyMetrics(startDate, now)

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
    console.error('Error fetching metrics:', error)
    
    // Return more detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch metrics',
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? (error as any).stack : undefined
      },
      { status: 500 }
    )
  }
}

// Helper function to get hourly metrics - optimized
async function getHourlyMetrics(startDate: Date, endDate: Date) {
  try {
    // Get all videos in the time range
    const videos = await prisma.video.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      select: {
        createdAt: true,
        creditsUsed: true
      }
    })

    // Get all transactions in the time range
    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: 'COMPLETED'
      },
      select: {
        createdAt: true,
        amount: true
      }
    })

    // Group by hour
    const hourlyMap = new Map<number, { videos: number, credits: number, revenue: number }>()
    
    // Initialize hours
    const current = new Date(startDate)
    while (current <= endDate) {
      const hour = current.getHours()
      hourlyMap.set(hour, { videos: 0, credits: 0, revenue: 0 })
      current.setHours(current.getHours() + 1)
    }

    // Count videos and credits by hour
    videos.forEach(video => {
      const hour = new Date(video.createdAt).getHours()
      const data = hourlyMap.get(hour)
      if (data) {
        data.videos++
        data.credits += video.creditsUsed
      }
    })

    // Count revenue by hour
    transactions.forEach(transaction => {
      const hour = new Date(transaction.createdAt).getHours()
      const data = hourlyMap.get(hour)
      if (data) {
        data.revenue += transaction.amount
      }
    })

    // Convert to array
    const hours = Array.from(hourlyMap.entries()).map(([hour, data]) => ({
      hour,
      ...data
    }))

    return hours
  } catch (error) {
    console.error('Error in getHourlyMetrics:', error)
    return []
  }
}