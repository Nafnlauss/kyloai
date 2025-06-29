import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
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

    // Get query parameters
    const searchParams = req.nextUrl.searchParams
    const period = searchParams.get('period') || '24h'
    const status = searchParams.get('status') || 'unresolved'
    const limit = parseInt(searchParams.get('limit') || '50')

    // Fetch issues from Sentry
    const issues = await sentryClient.getIssues({
      statsPeriod: period,
      query: `is:${status}`,
      limit,
      sort: 'priority'
    })

    // Get project stats
    const stats = await sentryClient.getProjectStats(period)

    // Convert issues to alert format
    const sentryAlerts = issues.map(issue => SentryClient.issueToAlert(issue))

    // Sort by priority and recency
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    sentryAlerts.sort((a, b) => {
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff
      return b.timestamp.getTime() - a.timestamp.getTime()
    })

    return NextResponse.json({
      alerts: sentryAlerts,
      stats: stats || {
        totalIssues: issues.length,
        unresolvedIssues: issues.filter(i => i.status === 'unresolved').length,
        usersAffected: issues.reduce((sum, i) => sum + i.userCount, 0),
        eventsCount: issues.reduce((sum, i) => sum + parseInt(i.count), 0)
      },
      summary: {
        total: sentryAlerts.length,
        critical: sentryAlerts.filter(a => a.priority === 'critical').length,
        high: sentryAlerts.filter(a => a.priority === 'high').length,
        medium: sentryAlerts.filter(a => a.priority === 'medium').length,
        low: sentryAlerts.filter(a => a.priority === 'low').length
      }
    })
  } catch (error) {
    console.error('Sentry alerts fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Sentry alerts' },
      { status: 500 }
    )
  }
}

// Update issue status
export async function PATCH(req: NextRequest) {
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

    const { issueId, status } = await req.json()

    if (!issueId || !status) {
      return NextResponse.json(
        { error: 'Missing issueId or status' },
        { status: 400 }
      )
    }

    const success = await sentryClient.updateIssueStatus(issueId, status)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update issue status' },
        { status: 500 }
      )
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'UPDATE_SENTRY_ISSUE',
        resource: 'sentry_issue',
        resourceId: issueId,
        metadata: { status, source: 'admin_dashboard' }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sentry issue update error:', error)
    return NextResponse.json(
      { error: 'Failed to update issue' },
      { status: 500 }
    )
  }
}