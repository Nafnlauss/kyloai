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

    // Get filter from query params
    const { searchParams } = new URL(req.url)
    const statusFilter = searchParams.get('status')

    // Build where clause
    const where: any = {}
    if (statusFilter && statusFilter !== 'all') {
      where.status = statusFilter.toUpperCase()
    }

    // Fetch payouts
    const payouts = await prisma.referralPayout.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // Pending first
        { createdAt: 'desc' }
      ]
    })

    // Get summary stats
    const stats = await prisma.referralPayout.groupBy({
      by: ['status'],
      _sum: {
        amount: true
      },
      _count: true
    })

    return NextResponse.json({
      payouts,
      stats
    })
  } catch (error) {
    console.error('Error fetching payouts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payouts' },
      { status: 500 }
    )
  }
}