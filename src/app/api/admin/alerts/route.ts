import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { subDays } from 'date-fns'
import { sentryClient, SentryClient } from '@/lib/sentry/client'

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

    const now = new Date()
    const last24h = subDays(now, 1)
    const last7d = subDays(now, 7)

    // Collect various system alerts
    const alerts = []

    // 1. Failed videos alert
    const failedVideos = await prisma.video.count({
      where: {
        status: 'FAILED',
        createdAt: { gte: last24h }
      }
    })

    if (failedVideos > 0) {
      alerts.push({
        id: `failed-videos-${Date.now()}`,
        type: 'error',
        title: 'Video Generation Failures',
        message: `${failedVideos} videos failed to generate in the last 24 hours`,
        timestamp: now,
        read: false,
        priority: 'high',
        actionUrl: '/admin/videos?status=FAILED'
      })
    }

    // 2. Low credit users alert
    const lowCreditUsers = await prisma.user.count({
      where: {
        credits: { lt: 10 },
        isActive: true
      }
    })

    if (lowCreditUsers > 5) {
      alerts.push({
        id: `low-credits-${Date.now()}`,
        type: 'warning',
        title: 'Multiple Users with Low Credits',
        message: `${lowCreditUsers} active users have less than 10 credits`,
        timestamp: now,
        read: false,
        priority: 'medium',
        actionUrl: '/admin/users?filter=low-credits'
      })
    }

    // 3. Failed payment alert
    const failedPayments = await prisma.payment.count({
      where: {
        status: 'failed',
        createdAt: { gte: last7d }
      }
    })

    if (failedPayments > 0) {
      alerts.push({
        id: `failed-payments-${Date.now()}`,
        type: 'error',
        title: 'Payment Failures',
        message: `${failedPayments} payments failed in the last 7 days`,
        timestamp: now,
        read: false,
        priority: 'high',
        actionUrl: '/admin/stripe'
      })
    }

    // 4. High API usage alert
    const recentVideos = await prisma.video.count({
      where: {
        createdAt: { gte: last24h }
      }
    })

    if (recentVideos > 1000) {
      alerts.push({
        id: `high-usage-${Date.now()}`,
        type: 'info',
        title: 'High API Usage',
        message: `${recentVideos} videos generated in the last 24 hours`,
        timestamp: now,
        read: false,
        priority: 'low',
        actionUrl: '/admin/api-status'
      })
    }

    // 5. Subscription cancellations alert
    const cancelledSubs = await prisma.subscription.count({
      where: {
        status: 'CANCELLED',
        updatedAt: { gte: last7d }
      }
    })

    if (cancelledSubs > 3) {
      alerts.push({
        id: `cancellations-${Date.now()}`,
        type: 'warning',
        title: 'Increased Cancellations',
        message: `${cancelledSubs} subscriptions cancelled in the last 7 days`,
        timestamp: now,
        read: false,
        priority: 'medium',
        actionUrl: '/admin/users?filter=cancelled'
      })
    }

    // 6. Security alerts from audit log
    const suspiciousActivities = await prisma.auditLog.count({
      where: {
        action: { in: ['FAILED_LOGIN', 'UNAUTHORIZED_ACCESS', 'SUSPICIOUS_ACTIVITY'] },
        createdAt: { gte: last24h }
      }
    })

    if (suspiciousActivities > 10) {
      alerts.push({
        id: `security-${Date.now()}`,
        type: 'error',
        title: 'Security Alert',
        message: `${suspiciousActivities} suspicious activities detected`,
        timestamp: now,
        read: false,
        priority: 'critical',
        actionUrl: '/admin/audit'
      })
    }

    // Sort by priority and timestamp
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    alerts.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.timestamp.getTime() - a.timestamp.getTime()
    })

    // Get historical alerts from database (if we implement an alerts table)
    // For now, we're generating them dynamically

    // Fetch Sentry alerts if requested
    let sentryAlerts = []
    const includeSentry = req.nextUrl.searchParams.get('includeSentry') !== 'false'
    
    if (includeSentry) {
      try {
        const sentryIssues = await sentryClient.getIssues({
          statsPeriod: '24h',
          query: 'is:unresolved',
          limit: 20
        })
        
        sentryAlerts = sentryIssues.map(issue => SentryClient.issueToAlert(issue))
      } catch (error) {
        console.error('Failed to fetch Sentry alerts:', error)
        // Continue without Sentry alerts rather than failing the entire request
      }
    }

    // Combine all alerts
    const allAlerts = [...alerts, ...sentryAlerts]
    
    // Sort by priority and timestamp
    allAlerts.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.timestamp.getTime() - a.timestamp.getTime()
    })

    return NextResponse.json({
      alerts: allAlerts,
      summary: {
        total: allAlerts.length,
        unread: allAlerts.filter(a => !a.read).length,
        critical: allAlerts.filter(a => a.priority === 'critical').length,
        high: allAlerts.filter(a => a.priority === 'high').length,
        medium: allAlerts.filter(a => a.priority === 'medium').length,
        low: allAlerts.filter(a => a.priority === 'low').length,
        system: alerts.length,
        sentry: sentryAlerts.length
      }
    })
  } catch (error) {
    console.error('Alerts fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}