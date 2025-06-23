import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { stripe } from '@/lib/stripe/stripe'
import { prisma } from '@/lib/prisma'

// POST /api/user/payment-methods/setup-intent - Create a Setup Intent for adding payment methods
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        stripeCustomerId: true,
        email: true,
        name: true,
      },
    })

    let stripeCustomerId = user?.stripeCustomerId

    if (!stripeCustomerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user?.email || session.user.email!,
        name: user?.name || session.user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      })
      
      stripeCustomerId = customer.id

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId },
      })
    }

    // Create a Setup Intent
    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      metadata: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId: stripeCustomerId,
    })
  } catch (error) {
    console.error('Error creating setup intent:', error)
    return NextResponse.json(
      { error: 'Failed to create setup intent' },
      { status: 500 }
    )
  }
}