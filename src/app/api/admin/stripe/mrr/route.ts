import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/get-session'
import { subDays, startOfDay } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30')

    // Calculate date range
    const endDate = new Date()
    const startDate = startOfDay(subDays(endDate, days))

    // Get payments in date range
    const payments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: 'succeeded',
      },
      orderBy: { createdAt: 'asc' },
    })

    // Group payments by day
    const revenueByDay = payments.reduce((acc, payment) => {
      const day = startOfDay(payment.createdAt).toISOString()
      if (!acc[day]) {
        acc[day] = 0
      }
      acc[day] += payment.amount
      return acc
    }, {} as Record<string, number>)

    // Fill in missing days with 0
    const dailyRevenue = []
    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dayKey = startOfDay(currentDate).toISOString()
      dailyRevenue.push({
        date: dayKey,
        revenue: revenueByDay[dayKey] || 0,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Calculate totals
    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
    const averageDailyRevenue = totalRevenue / days

    // Get active subscriptions for MRR calculation
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
      },
      select: {
        monthlyPrice: true,
      },
    })

    const mrr = activeSubscriptions.reduce((sum, sub) => sum + sub.monthlyPrice, 0)

    return NextResponse.json({
      dailyRevenue,
      summary: {
        totalRevenue,
        averageDailyRevenue,
        mrr,
        projectedMonthlyRevenue: averageDailyRevenue * 30,
      },
      period: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        days,
      },
    })
  } catch (error) {
    console.error('MRR calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate MRR' },
      { status: 500 }
    )
  }
}