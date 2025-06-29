import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isDemoMode } from '@/lib/auth/demo-mode'
import { adminGuardAPI } from '@/lib/auth/admin-guard'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    if (!isDemoMode()) {
      const guardResult = await adminGuardAPI(request, ['ADMIN'])
      if (!guardResult.authorized) {
        return guardResult.response!
      }
    }

    // Get all users with referral codes and their stats
    const users = await prisma.user.findMany({
      where: {
        referralCode: { not: null }
      },
      select: {
        id: true,
        email: true,
        name: true,
        referralCode: true,
        createdAt: true,
        referralStats: {
          select: {
            totalReferrals: true,
            activeReferrals: true,
            totalEarnings: true,
            pendingEarnings: true,
            paidEarnings: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform data for frontend
    const transformedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.name,
      referralCode: user.referralCode || '',
      totalReferrals: user.referralStats?.totalReferrals || 0,
      activeReferrals: user.referralStats?.activeReferrals || 0,
      totalEarnings: user.referralStats?.totalEarnings || 0,
      pendingEarnings: user.referralStats?.pendingEarnings || 0,
      paidEarnings: user.referralStats?.paidEarnings || 0,
      createdAt: user.createdAt.toISOString(),
    }))

    // Calculate summary
    const summary = {
      totalUsers: transformedUsers.length,
      totalReferrals: transformedUsers.reduce((sum, user) => sum + user.totalReferrals, 0),
      totalEarnings: transformedUsers.reduce((sum, user) => sum + user.totalEarnings, 0),
      pendingPayouts: transformedUsers.reduce((sum, user) => sum + user.pendingEarnings, 0),
    }

    return NextResponse.json({
      users: transformedUsers,
      summary
    })

  } catch (error) {
    console.error('Error fetching referral data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral data' },
      { status: 500 }
    )
  }
}