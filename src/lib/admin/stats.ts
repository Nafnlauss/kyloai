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

  return {
    totalRevenue: totalRevenue._sum.amount || 0,
    revenueGrowth,
    activeUsers,
    userGrowth: 15.3, // Mock data - calculate from DB in production
    totalVideos,
    videoGrowth: 23.5, // Mock data
    activeSubscriptions,
    churnRate: 5.2, // Mock data
    revenueChart,
    recentSales,
    apiUsage,
    topPlans: plansWithDetails,
    queueHealth,
    errorRate: 0.3 // Mock data
  }
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