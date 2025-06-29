import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth/get-session'

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
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') || undefined

    // Query payments
    const where = status ? { status } : {}

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.payment.count({ where }),
    ])

    // Calculate totals
    const totals = await prisma.payment.groupBy({
      by: ['status'],
      _sum: {
        amount: true,
      },
    })

    const totalRevenue = totals
      .filter(t => t.status === 'succeeded')
      .reduce((sum, t) => sum + (t._sum.amount || 0), 0)

    const totalRefunded = totals
      .filter(t => t.status === 'refunded')
      .reduce((sum, t) => sum + (t._sum.amount || 0), 0)

    return NextResponse.json({
      payments,
      pagination: {
        total,
        limit,
        offset,
      },
      summary: {
        totalRevenue,
        totalRefunded,
        netRevenue: totalRevenue - totalRefunded,
      },
    })
  } catch (error) {
    console.error('Payments query error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve payments' },
      { status: 500 }
    )
  }
}