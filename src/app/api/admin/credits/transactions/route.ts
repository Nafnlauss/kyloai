import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { isDemoMode } from '@/lib/auth/demo-mode'

export async function GET() {
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

    // Get recent credit-related transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { type: 'credit_purchase' },
          { type: 'credit_usage' },
          { type: 'credit_refund' },
          { type: 'credit_bonus' }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            credits: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Last 100 transactions
    })

    // Also get video generation as credit usage
    const videoUsage = await prisma.video.findMany({
      where: {
        creditsUsed: {
          gt: 0
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            credits: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    })

    // Transform video usage to transaction format
    const videoTransactions = videoUsage.map(video => ({
      id: `video-${video.id}`,
      userId: video.userId,
      userName: video.user.name,
      userEmail: video.user.email,
      type: 'usage' as const,
      amount: video.creditsUsed || 0,
      balance: video.user.credits || 0,
      description: `Video generation - ${video.provider}`,
      createdAt: video.createdAt.toISOString()
    }))

    // Transform regular transactions
    const regularTransactions = transactions.map(trans => ({
      id: trans.id,
      userId: trans.userId,
      userName: trans.user.name,
      userEmail: trans.user.email,
      type: trans.type.replace('credit_', '') as 'purchase' | 'usage' | 'refund' | 'bonus',
      amount: trans.type === 'credit_purchase' ? trans.amount / 100 : trans.amount,
      balance: trans.user.credits || 0,
      description: trans.description || trans.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      createdAt: trans.createdAt.toISOString()
    }))

    // Combine and sort all transactions
    const allTransactions = [...regularTransactions, ...videoTransactions]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 100) // Limit to 100 most recent

    return NextResponse.json({ transactions: allTransactions })
  } catch (error) {
    console.error('Error fetching credit transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch credit transactions' },
      { status: 500 }
    )
  }
}