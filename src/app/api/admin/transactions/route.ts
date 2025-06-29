import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { adminGuardAPI } from '@/lib/auth/admin-guard'

export async function GET(req: NextRequest) {
  try {
    // Check authentication and admin/moderator role
    const guardResult = await adminGuardAPI(req, ['ADMIN', 'MODERATOR'])
    if (!guardResult.authorized) {
      return guardResult.response!
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const offset = (page - 1) * limit

    // Build where clause
    const where = {
      ...(type && { type }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { id: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
          { user: { email: { contains: search, mode: 'insensitive' as const } } }
        ]
      })
    }

    // Get transactions and total count
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
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
      prisma.transaction.count({ where })
    ])

    return NextResponse.json({
      transactions: transactions.map(t => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        status: t.status,
        paymentMethod: t.paymentMethod,
        description: t.description,
        stripePaymentIntentId: t.stripePaymentIntentId,
        createdAt: t.createdAt,
        user: t.user
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Transactions fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}