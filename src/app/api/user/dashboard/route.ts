import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { startOfMonth } from 'date-fns'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user with subscription
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: {
          include: { plan: true },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get video statistics
    const [videosTotal, videosThisMonth, recentVideos, avgProcessingTime] = await Promise.all([
      // Total videos
      prisma.video.count({
        where: { userId: session.user.id },
      }),
      
      // Videos this month
      prisma.video.count({
        where: {
          userId: session.user.id,
          createdAt: { gte: startOfMonth(new Date()) },
        },
      }),
      
      // Recent videos
      prisma.video.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          prompt: true,
          status: true,
          provider: true,
          createdAt: true,
          thumbnailUrl: true,
        },
      }),
      
      // Average processing time (in milliseconds)
      prisma.video.aggregate({
        where: {
          userId: session.user.id,
          status: 'COMPLETED',
          processingStartedAt: { not: null },
          processingEndedAt: { not: null },
        },
        _avg: {
          duration: true,
        },
      }),
    ])

    // Calculate subscription details
    let subscriptionData = {
      plan: 'Free',
      status: 'ACTIVE',
      currentPeriodEnd: '',
      creditsRemaining: user.credits,
      creditsTotal: 10, // Free plan default
    }

    if (user.subscription && user.subscription.plan) {
      const plan = user.subscription.plan
      subscriptionData = {
        plan: plan.displayName,
        status: user.subscription.status,
        currentPeriodEnd: user.subscription.currentPeriodEnd.toISOString(),
        creditsRemaining: user.credits,
        creditsTotal: plan.monthlyCredits,
      }
    }

    // Calculate average processing time in seconds
    const processingTime = avgProcessingTime._avg.duration
      ? Math.round(avgProcessingTime._avg.duration * 60) // Convert minutes to seconds
      : 180 // Default 3 minutes

    return NextResponse.json({
      credits: user.credits,
      videosTotal,
      videosThisMonth,
      processingTime,
      subscription: subscriptionData,
      recentVideos,
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 })
  }
}