import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { ReferralManager } from '@/lib/referral'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get stats
    const stats = await ReferralManager.getUserStats(user.id)
    
    // Get earnings history
    const earnings = await ReferralManager.getEarningsHistory(user.id, 20)
    
    // Get payouts history
    const payouts = await ReferralManager.getPayoutsHistory(user.id)

    // Format response
    return NextResponse.json({
      stats: {
        totalReferrals: stats.totalReferrals,
        activeReferrals: stats.activeReferrals,
        totalEarnings: stats.totalEarnings,
        pendingEarnings: stats.pendingEarnings,
        paidEarnings: stats.paidEarnings,
        referralLink: stats.referralCode ? 
          ReferralManager.generateReferralLink(stats.referralCode) : null
      },
      referrals: stats.referrals.map(ref => ({
        id: ref.id,
        email: ref.email,
        name: ref.name,
        joinedAt: ref.createdAt,
        isActive: ref.subscription?.status === 'ACTIVE',
        plan: ref.subscription?.planId || 'FREE'
      })),
      recentEarnings: earnings.map(e => ({
        id: e.id,
        amount: e.amount,
        status: e.status,
        date: e.createdAt,
        referredUser: {
          email: e.referredUser.email,
          name: e.referredUser.name
        },
        transaction: {
          amount: e.transaction.amount,
          type: e.transaction.type,
          date: e.transaction.createdAt
        }
      })),
      payouts: payouts.map(p => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        method: p.method,
        status: p.status,
        date: p.createdAt,
        processedAt: p.processedAt,
        transactionHash: p.transactionHash
      }))
    })
  } catch (error) {
    console.error('Error getting referral stats:', error)
    return NextResponse.json(
      { error: 'Failed to get referral stats' },
      { status: 500 }
    )
  }
}