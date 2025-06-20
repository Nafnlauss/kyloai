import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { createCheckoutSession, STRIPE_PRICES } from '@/lib/stripe/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  planId: z.enum(['LITE', 'CREATOR', 'PROFESSIONAL']),
  interval: z.enum(['MONTHLY', 'YEARLY']),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await req.json()
    const { planId, interval } = checkoutSchema.parse(body)
    
    // Get price ID
    const priceId = STRIPE_PRICES[planId][interval]
    
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }
    
    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      userEmail: session.user.email!,
      userName: session.user.name,
      priceId,
      mode: 'subscription',
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`,
      metadata: {
        planId,
        interval,
      },
    })
    
    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}