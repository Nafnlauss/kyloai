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

    // Get all users with their credit information
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        lastLoginAt: true,
        createdAt: true,
        subscription: {
          select: {
            plan: {
              select: {
                name: true
              }
            },
            status: true
          }
        },
        videos: {
          select: {
            creditsUsed: true
          }
        },
        transactions: {
          where: {
            type: 'credit_purchase',
            status: 'completed'
          },
          select: {
            amount: true
          }
        }
      }
    })

    // Process user data
    const processedUsers = users.map(user => {
      const totalSpent = user.videos.reduce((sum, video) => sum + (video.creditsUsed || 0), 0)
      const totalPurchased = user.transactions.reduce((sum, trans) => {
        // Assuming amount in transactions represents credits purchased
        return sum + (trans.amount / 100) // Convert cents to credits
      }, 0)
      
      const isActive = user.lastLoginAt && 
        new Date(user.lastLoginAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        credits: user.credits || 0,
        totalSpent,
        totalPurchased: Math.round(totalPurchased),
        lastActivity: user.lastLoginAt?.toISOString() || user.createdAt.toISOString(),
        subscription: user.subscription?.plan?.name || null,
        status: isActive ? 'active' : 'inactive'
      }
    })

    // Sort by credits descending
    processedUsers.sort((a, b) => b.credits - a.credits)

    return NextResponse.json({ users: processedUsers })
  } catch (error) {
    console.error('Error fetching user credits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user credits' },
      { status: 500 }
    )
  }
}