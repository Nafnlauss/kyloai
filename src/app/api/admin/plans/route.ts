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

    // Get subscription counts by plan
    const subscriptionCounts = await prisma.subscription.groupBy({
      by: ['planId'],
      where: {
        status: 'active'
      },
      _count: {
        id: true
      }
    })

    // Calculate revenue by plan
    const revenueByPlan = await prisma.transaction.groupBy({
      by: ['metadata'],
      where: {
        type: 'subscription',
        status: 'completed',
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      },
      _sum: {
        amount: true
      }
    })

    // Define plans based on pricing configuration
    const plans = [
      {
        id: 'free',
        name: 'Free',
        description: 'Perfect for trying out our service',
        monthlyPrice: 0,
        yearlyPrice: 0,
        monthlyCredits: 300,
        yearlyCredits: 300,
        features: [
          '300 credits per month',
          'Access to all AI models',
          'Watermarked outputs',
          'Community support',
          'Non-commercial use only'
        ],
        isPopular: false,
        status: 'active'
      },
      {
        id: 'lite',
        name: 'Lite (Básico)',
        description: 'Great for personal projects',
        monthlyPrice: 4900, // R$ 49.00
        yearlyPrice: 47040, // R$ 470.40
        monthlyCredits: 100,
        yearlyCredits: 1200,
        features: [
          '100 credits per month',
          'No watermarks',
          'Commercial use allowed',
          'Email support',
          'Priority processing'
        ],
        isPopular: false,
        status: 'active'
      },
      {
        id: 'creator',
        name: 'Creator',
        description: 'Perfect for content creators',
        monthlyPrice: 19900, // R$ 199.00
        yearlyPrice: 191040, // R$ 1,910.40
        monthlyCredits: 500,
        yearlyCredits: 6000,
        features: [
          '500 credits per month',
          'No watermarks',
          'Commercial use allowed',
          'Priority email support',
          'Advanced features',
          'API access'
        ],
        isPopular: true,
        status: 'active'
      },
      {
        id: 'pro',
        name: 'Pro',
        description: 'For professional users',
        monthlyPrice: 39900, // R$ 399.00
        yearlyPrice: 383040, // R$ 3,830.40
        monthlyCredits: 1200,
        yearlyCredits: 14400,
        features: [
          '1,200 credits per month',
          'No watermarks',
          'Commercial use allowed',
          'Priority support',
          'Advanced features',
          'API access',
          'Custom integrations'
        ],
        isPopular: false,
        status: 'active'
      },
      {
        id: 'mega',
        name: 'Mega',
        description: 'For power users and teams',
        monthlyPrice: 79900, // R$ 799.00
        yearlyPrice: 767040, // R$ 7,670.40
        monthlyCredits: 3000,
        yearlyCredits: 36000,
        features: [
          '3,000 credits per month',
          'No watermarks',
          'Commercial use allowed',
          'Dedicated support',
          'All features included',
          'API access',
          'Custom integrations',
          'Team collaboration'
        ],
        isPopular: false,
        status: 'active'
      }
    ]

    // Add subscription counts and revenue to plans
    const plansWithStats = plans.map(plan => {
      const subCount = subscriptionCounts.find(s => s.planId === plan.id)
      const revenue = revenueByPlan.find(r => {
        try {
          const metadata = JSON.parse(r.metadata as string)
          return metadata.planId === plan.id
        } catch {
          return false
        }
      })

      return {
        ...plan,
        subscriptionCount: subCount?._count.id || 0,
        revenue: revenue?._sum.amount || 0
      }
    })

    return NextResponse.json({ plans: plansWithStats })
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}