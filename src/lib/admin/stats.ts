import { prisma } from '@/lib/prisma'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'

export async function getAdminStats() {
  
  const now = new Date()
  const lastMonth = subMonths(now, 1)
  
  // Total Revenue
  const totalRevenue = await prisma.transaction.aggregate({
    where: {
      status: 'COMPLETED',
      type: { in: ['SUBSCRIPTION', 'SUBSCRIPTION_RENEWAL', 'CREDIT_PURCHASE'] }
    },
    _sum: { amount: true }
  })

  // Revenue Last Month
  const lastMonthRevenue = await prisma.transaction.aggregate({
    where: {
      status: 'COMPLETED',
      type: { in: ['SUBSCRIPTION', 'SUBSCRIPTION_RENEWAL', 'CREDIT_PURCHASE'] },
      createdAt: {
        gte: startOfMonth(lastMonth),
        lte: endOfMonth(lastMonth)
      }
    },
    _sum: { amount: true }
  })

  // Total costs (estimated from videos)
  const totalCosts = await calculateTotalCosts()
  const lastMonthCosts = await calculateTotalCosts(startOfMonth(lastMonth), endOfMonth(lastMonth))

  // Active Users (logged in last 30 days)
  const activeUsers = await prisma.user.count({
    where: {
      lastLoginAt: {
        gte: subMonths(now, 1)
      }
    }
  })

  // Total Videos
  const totalVideos = await prisma.video.count({
    where: { status: 'COMPLETED' }
  })

  // Active Subscriptions
  const activeSubscriptions = await prisma.subscription.count({
    where: { status: 'ACTIVE' }
  })

  // Calculate growth percentages
  const revenueGrowth = calculateGrowth(
    totalRevenue._sum.amount || 0,
    lastMonthRevenue._sum.amount || 0
  )

  // Get revenue chart data (last 12 months)
  const revenueChart = await getMonthlyRevenue()

  // Recent sales
  const recentSales = await prisma.transaction.findMany({
    where: {
      status: 'COMPLETED',
      type: { in: ['SUBSCRIPTION', 'CREDIT_PURCHASE'] }
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  // API Usage stats
  const apiUsage = await getApiUsageStats()

  // Top plans
  const topPlans = await prisma.subscription.groupBy({
    by: ['planId'],
    where: { status: 'ACTIVE' },
    _count: { planId: true },
    orderBy: { _count: { planId: 'desc' } },
    take: 5
  })

  const plansWithDetails = await Promise.all(
    topPlans.map(async (plan) => {
      const planDetails = await prisma.plan.findUnique({
        where: { id: plan.planId }
      })
      return {
        name: planDetails?.name || '',
        displayName: planDetails?.displayName || '',
        count: plan._count.planId
      }
    })
  )

  // Queue health
  const queueHealth = {
    pending: 0, // This would come from BullMQ in production
    failed: 0,
    completed: 0
  }

  // Calculate real growth values
  const previousMonthUsers = await prisma.user.count({
    where: {
      createdAt: {
        lte: endOfMonth(lastMonth)
      }
    }
  })
  
  const previousMonthVideos = await prisma.video.count({
    where: {
      createdAt: {
        lte: endOfMonth(lastMonth)
      },
      status: 'COMPLETED'
    }
  })
  
  const userGrowth = calculateGrowth(activeUsers, previousMonthUsers)
  const videoGrowth = calculateGrowth(totalVideos, previousMonthVideos)
  
  // Calculate churn rate
  const previousMonthSubscriptions = await prisma.subscription.count({
    where: {
      createdAt: { lte: endOfMonth(lastMonth) },
      status: 'ACTIVE'
    }
  })
  
  const cancelledSubscriptions = await prisma.subscription.count({
    where: {
      status: 'CANCELLED',
      updatedAt: {
        gte: startOfMonth(now),
        lte: endOfMonth(now)
      }
    }
  })
  
  const churnRate = previousMonthSubscriptions > 0 
    ? (cancelledSubscriptions / previousMonthSubscriptions) * 100 
    : 0

  // Calculate error rate from failed videos
  const failedVideos = await prisma.video.count({
    where: {
      status: 'FAILED',
      createdAt: {
        gte: subMonths(now, 1)
      }
    }
  })
  
  const totalRecentVideos = await prisma.video.count({
    where: {
      createdAt: {
        gte: subMonths(now, 1)
      }
    }
  })
  
  const errorRate = totalRecentVideos > 0 
    ? (failedVideos / totalRecentVideos) * 100 
    : 0

  return {
    totalRevenue: totalRevenue._sum.amount || 0,
    revenueGrowth,
    totalCosts,
    lastMonthCosts,
    activeUsers,
    userGrowth,
    totalVideos,
    videoGrowth,
    activeSubscriptions,
    churnRate,
    revenueChart,
    recentSales,
    apiUsage,
    topPlans: plansWithDetails,
    queueHealth,
    errorRate
  }
}


// Calculate total costs from API usage
async function calculateTotalCosts(startDate?: Date, endDate?: Date) {
  const where = startDate && endDate ? {
    createdAt: {
      gte: startDate,
      lte: endDate
    }
  } : {}
  
  const videos = await prisma.video.findMany({
    where,
    select: {
      provider: true,
      creditsUsed: true
    }
  })
  
  const costs = videos.reduce((total, video) => {
    const costPerCredit = getCostPerCredit(video.provider)
    return total + (video.creditsUsed * costPerCredit)
  }, 0)
  
  return costs * 100 // Convert to cents
}

function getCostPerCredit(provider: string): number {
  const costs = {
    LUMA_V1: 0.003,
    LUMA_V2: 0.005,
    KLING_V1: 0.004,
    KLING_V2: 0.008
  }
  return costs[provider as keyof typeof costs] || 0.005
}

function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return 0
  return Math.round(((current - previous) / previous) * 100)
}

async function getMonthlyRevenue() {
  const months = []
  const now = new Date()
  
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(now, i)
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    
    const revenue = await prisma.transaction.aggregate({
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: start,
          lte: end
        }
      },
      _sum: { amount: true }
    })
    
    months.push({
      name: date.toLocaleDateString('pt-BR', { month: 'short' }),
      total: (revenue._sum.amount || 0) / 100
    })
  }
  
  return months
}

async function getApiUsageStats() {
  const total = await prisma.video.count()
  
  const usage = await prisma.video.groupBy({
    by: ['provider'],
    _count: { provider: true }
  })
  
  const percentages: Record<string, number> = {
    LUMA_V1: 0,
    LUMA_V2: 0,
    KLING_V1: 0,
    KLING_V2: 0
  }
  
  usage.forEach(u => {
    percentages[u.provider] = Math.round((u._count.provider / total) * 100)
  })
  
  return percentages
}