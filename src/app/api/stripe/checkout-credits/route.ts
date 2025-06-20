import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { authOptions } from '@/lib/auth/auth-options'
import { createCheckoutSession, STRIPE_PRICES } from '@/lib/stripe/stripe'
import { z } from 'zod'

const checkoutCreditsSchema = z.object({
  pack: z.enum(['PACK_50', 'PACK_100', 'PACK_500']),
})

const CREDIT_PACKS = {
  PACK_50: { credits: 50, price: 1990 }, // R$ 19,90
  PACK_100: { credits: 100, price: 3490 }, // R$ 34,90
  PACK_500: { credits: 500, price: 14990 }, // R$ 149,90
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await req.json()
    const { pack } = checkoutCreditsSchema.parse(body)
    
    // Get price ID
    const priceId = STRIPE_PRICES.CREDITS[pack]
    const packInfo = CREDIT_PACKS[pack]
    
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid credit pack' }, { status: 400 })
    }
    
    // Create checkout session for one-time payment
    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      userEmail: session.user.email!,
      userName: session.user.name,
      priceId,
      mode: 'payment',
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?credits_purchased=true&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?cancelled=true`,
      metadata: {
        type: 'credits',
        pack,
        credits: packInfo.credits.toString(),
      },
    })
    
    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout credits error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}