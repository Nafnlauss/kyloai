import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { isDemoMode } from '@/lib/auth/demo-mode'

export async function GET(req: NextRequest) {
  try {
    // Check authentication and admin role
    if (!isDemoMode()) {
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
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const range = searchParams.get('range') || '7d'
    
    // Calculate date range
    let startDate = new Date()
    switch (range) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }

    // Get payments (transactions)
    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform transactions to payment format
    const payments = transactions.map(transaction => {
      let metadata = {}
      try {
        metadata = transaction.metadata ? JSON.parse(transaction.metadata as string) : {}
      } catch {
        metadata = {}
      }

      return {
        id: transaction.id,
        userId: transaction.userId,
        userEmail: transaction.user.email,
        userName: transaction.user.name,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod || 'card',
        provider: transaction.provider || 'stripe',
        description: transaction.description,
        createdAt: transaction.createdAt.toISOString(),
        metadata: {
          planName: metadata.planName,
          credits: metadata.credits,
          invoiceUrl: metadata.invoiceUrl
        }
      }
    })

    return NextResponse.json({ payments })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}