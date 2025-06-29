import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { startOfMonth, subDays } from 'date-fns'
import { isDemoMode } from '@/lib/auth/demo-mode'

export async function GET(req: NextRequest) {
  try {
    // Check authentication and admin role
    if (!isDemoMode()) {
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
    }

    // Calculate date ranges
    const now = new Date()
    const startOfCurrentMonth = startOfMonth(now)
    const last30Days = subDays(now, 30)

    // Get all stats in parallel with error handling
    const [
      activeUsers,
      totalUsers,
      totalVideos,
      monthlyVideos,
      totalRevenue,
      monthlyRevenue,
      activeSubscriptions,
      userCredits,
      recentTransactions
    ] = await Promise.all([
      // Active users (logged in last 30 days)
      prisma.user.count({
        where: {
          lastLoginAt: {
            gte: last30Days
          }
        }
      }).catch(() => 0),
      
      // Total users
      prisma.user.count().catch(() => 0),
      
      // Total videos
      prisma.video.count().catch(() => 0),
      
      // Monthly videos
      prisma.video.count({
        where: {
          createdAt: {
            gte: startOfCurrentMonth
          }
        }
      }).catch(() => 0),
      
      // Total revenue from transactions
      prisma.transaction.aggregate({
        where: { 
          status: 'completed',
          type: { in: ['subscription', 'credit_purchase'] }
        },
        _sum: { amount: true }
      }).catch(() => ({ _sum: { amount: 0 } })),
      
      // Monthly revenue
      prisma.transaction.aggregate({
        where: {
          status: 'completed',
          type: { in: ['subscription', 'credit_purchase'] },
          createdAt: { gte: startOfCurrentMonth }
        },
        _sum: { amount: true }
      }).catch(() => ({ _sum: { amount: 0 } })),
      
      // Active subscriptions
      prisma.subscription.count({
        where: { status: 'active' }
      }).catch(() => 0),
      
      // User credits summary
      prisma.user.aggregate({
        _sum: { credits: true },
        _avg: { credits: true },
        _count: { credits: true }
      }).catch(() => ({ _sum: { credits: 0 }, _avg: { credits: 0 }, _count: { credits: 0 } })),
      
      // Recent transactions
      prisma.transaction.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }).catch(() => [])
    ])

    // Calculate credits used from videos
    const creditsUsed = await prisma.video.aggregate({
      _sum: { creditsUsed: true }
    }).catch(() => ({ _sum: { creditsUsed: 0 } }))

    // Get video generation by provider
    const videosByProvider = await prisma.video.groupBy({
      by: ['provider'],
      _count: true,
      _sum: {
        creditsUsed: true
      }
    }).catch(() => [])

    // Get user activity data for chart
    const userActivity = await prisma.user.groupBy({
      by: ['createdAt'],
      _count: true,
      where: {
        createdAt: {
          gte: last30Days
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    }).catch(() => [])

    // Format the response
    return NextResponse.json({
      stats: {
        // User stats
        totalUsers,
        activeUsers,
        newUsersThisMonth: userActivity.length,
        
        // Video stats
        totalVideos,
        monthlyVideos,
        videosToday: await prisma.video.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
          }
        }).catch(() => 0),
        
        // Financial stats
        totalRevenue: (totalRevenue._sum.amount || 0) / 100,
        monthlyRevenue: (monthlyRevenue._sum.amount || 0) / 100,
        activeSubscriptions,
        
        // Credits stats
        totalCreditsInSystem: userCredits._sum.credits || 0,
        averageCreditsPerUser: Math.round(userCredits._avg.credits || 0),
        totalCreditsUsed: creditsUsed._sum.creditsUsed || 0,
        
        // Growth metrics
        userGrowthRate: totalUsers > 0 ? ((userActivity.length / totalUsers) * 100).toFixed(1) : '0',
        conversionRate: totalUsers > 0 ? ((activeSubscriptions / totalUsers) * 100).toFixed(1) : '0'
      },
      
      // Recent activity
      recentTransactions: recentTransactions.map(t => ({
        id: t.id,
        user: t.user.name || t.user.email,
        amount: t.amount / 100,
        type: t.type,
        status: t.status,
        createdAt: t.createdAt
      })),
      
      // Provider breakdown
      providerStats: videosByProvider.map(vp => ({
        provider: vp.provider,
        count: vp._count,
        creditsUsed: vp._sum.creditsUsed || 0,
        percentage: totalVideos > 0 ? ((vp._count / totalVideos) * 100).toFixed(1) : '0'
      })),
      
      // Chart data
      chartData: {
        userGrowth: userActivity.map(ua => ({
          date: ua.createdAt.toISOString().split('T')[0],
          count: ua._count
        }))
      }
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch admin stats', details: error.message },
      { status: 500 }
    )
  }
}