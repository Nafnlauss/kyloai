import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'

// Health check endpoints for each provider
const API_HEALTH_ENDPOINTS = {
  LUMA: {
    name: 'Luma AI',
    endpoint: 'https://api.lumalabs.ai/v1/health',
    headers: {
      'Authorization': `Bearer ${process.env.LUMA_API_KEY}`
    }
  },
  KLING: {
    name: 'Kling AI',
    endpoint: 'https://api.klingai.com/v1/status',
    headers: {
      'X-API-Key': process.env.KLING_API_KEY
    }
  },
  STRIPE: {
    name: 'Stripe',
    endpoint: 'https://api.stripe.com/v1/balance',
    headers: {
      'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`
    }
  },
  ELEVENLABS: {
    name: 'ElevenLabs',
    endpoint: 'https://api.elevenlabs.io/v1/user',
    headers: {
      'xi-api-key': process.env.ELEVENLABS_API_KEY
    }
  }
}

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

    // Check each API health
    const healthChecks = await Promise.all(
      Object.entries(API_HEALTH_ENDPOINTS).map(async ([key, config]) => {
        const startTime = Date.now()
        let status = 'down'
        let latency = 0
        let error = null

        try {
          if (!config.headers.Authorization && !config.headers['X-API-Key'] && !config.headers['xi-api-key']) {
            throw new Error('API key not configured')
          }

          const response = await fetch(config.endpoint, {
            method: 'GET',
            headers: config.headers as HeadersInit,
            signal: AbortSignal.timeout(5000) // 5 second timeout
          })

          latency = Date.now() - startTime

          if (response.ok) {
            status = 'operational'
          } else if (response.status >= 500) {
            status = 'degraded'
          } else {
            status = 'down'
            error = `HTTP ${response.status}`
          }
        } catch (err) {
          latency = Date.now() - startTime
          status = 'down'
          error = err instanceof Error ? err.message : 'Unknown error'
        }

        return {
          provider: key,
          name: config.name,
          status,
          latency,
          error,
          lastChecked: new Date()
        }
      })
    )

    // Get usage statistics from our database
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const usageStats = await prisma.video.groupBy({
      by: ['provider', 'status'],
      where: {
        createdAt: { gte: last24h }
      },
      _count: true
    })

    // Calculate uptime based on successful requests
    const uptimeStats = usageStats.reduce((acc, stat) => {
      if (!acc[stat.provider]) {
        acc[stat.provider] = { total: 0, successful: 0 }
      }
      acc[stat.provider].total += stat._count
      if (stat.status === 'COMPLETED') {
        acc[stat.provider].successful += stat._count
      }
      return acc
    }, {} as Record<string, { total: number; successful: number }>)

    // Enhance health checks with usage data
    const enhancedHealthChecks = healthChecks.map(check => {
      const usage = uptimeStats[check.provider] || { total: 0, successful: 0 }
      const uptime = usage.total > 0 
        ? Math.round((usage.successful / usage.total) * 100) 
        : 100 // Assume 100% if no data

      return {
        ...check,
        uptime,
        requestsLast24h: usage.total,
        successfulRequests: usage.successful,
        failedRequests: usage.total - usage.successful
      }
    })

    // Overall system health
    const operationalCount = healthChecks.filter(c => c.status === 'operational').length
    const overallHealth = operationalCount === healthChecks.length 
      ? 'operational' 
      : operationalCount > healthChecks.length / 2 
        ? 'degraded' 
        : 'down'

    return NextResponse.json({
      status: overallHealth,
      providers: enhancedHealthChecks,
      summary: {
        operational: healthChecks.filter(c => c.status === 'operational').length,
        degraded: healthChecks.filter(c => c.status === 'degraded').length,
        down: healthChecks.filter(c => c.status === 'down').length,
        averageLatency: Math.round(
          healthChecks.reduce((sum, c) => sum + c.latency, 0) / healthChecks.length
        ),
        lastChecked: new Date()
      }
    })
  } catch (error) {
    console.error('API health check error:', error)
    return NextResponse.json(
      { error: 'Failed to check API health' },
      { status: 500 }
    )
  }
}