import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

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

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'all' // 'recurring', 'one_time', 'all'

    try {
      // Fetch products with prices expanded
      const products = await stripe.products.list({
        active: true,
        limit: 100,
        expand: ['data.default_price']
      })

      // Fetch all prices
      const prices = await stripe.prices.list({
        active: true,
        limit: 100,
        expand: ['data.product']
      })

      // Filter based on type
      const filteredPrices = prices.data.filter(price => {
        if (type === 'all') return true
        if (type === 'recurring') return price.type === 'recurring'
        if (type === 'one_time') return price.type === 'one_time'
        return true
      })

      // Map to our format
      const productsWithPrices = products.data.map(product => {
        const productPrices = filteredPrices.filter(
          price => price.product === product.id || 
          (typeof price.product === 'object' && price.product.id === product.id)
        )

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          active: product.active,
          metadata: product.metadata,
          prices: productPrices.map(price => ({
            id: price.id,
            active: price.active,
            currency: price.currency,
            unitAmount: price.unit_amount,
            type: price.type,
            recurring: price.recurring ? {
              interval: price.recurring.interval,
              intervalCount: price.recurring.interval_count
            } : null,
            metadata: price.metadata
          }))
        }
      })

      // Get subscription counts from database
      const subscriptionCounts = await prisma.subscription.groupBy({
        by: ['stripePriceId'],
        where: { status: 'ACTIVE' },
        _count: true
      })

      const countsMap = subscriptionCounts.reduce((acc, curr) => {
        acc[curr.stripePriceId] = curr._count
        return acc
      }, {} as Record<string, number>)

      // Add subscription counts to response
      const enrichedProducts = productsWithPrices.map(product => ({
        ...product,
        prices: product.prices.map(price => ({
          ...price,
          activeSubscriptions: countsMap[price.id] || 0
        }))
      }))

      return NextResponse.json({
        products: enrichedProducts,
        summary: {
          totalProducts: products.data.length,
          totalPrices: filteredPrices.length,
          totalActiveSubscriptions: subscriptionCounts.reduce(
            (sum, curr) => sum + curr._count, 
            0
          )
        }
      })
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError)
      // Return empty data if Stripe is not configured
      return NextResponse.json({
        products: [],
        summary: {
          totalProducts: 0,
          totalPrices: 0,
          totalActiveSubscriptions: 0
        },
        error: 'Stripe not configured'
      })
    }
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}