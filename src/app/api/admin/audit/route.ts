import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'

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
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    const search = searchParams.get('search')

    const offset = (page - 1) * limit

    // Build where clause
    const where = {
      ...(action && { action }),
      ...(userId && { userId }),
      ...(search && {
        OR: [
          { action: { contains: search, mode: 'insensitive' as const } },
          { details: { string_contains: search } },
          { user: { email: { contains: search, mode: 'insensitive' as const } } }
        ]
      })
    }

    // Get audit logs and total count
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.auditLog.count({ where })
    ])

    // Get action statistics
    const actionStats = await prisma.auditLog.groupBy({
      by: ['action'],
      _count: true,
      orderBy: {
        _count: {
          action: 'desc'
        }
      }
    })

    return NextResponse.json({
      logs: logs.map(log => ({
        id: log.id,
        action: log.action,
        userId: log.userId,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        details: log.details,
        createdAt: log.createdAt,
        user: log.user
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      actionStats: actionStats.map(stat => ({
        action: stat.action,
        count: stat._count
      }))
    })
  } catch (error) {
    console.error('Audit logs fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}