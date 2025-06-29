import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getServerSession } from '@/lib/auth/get-session'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const sessionId = params.id

    // Retrieve checkout session
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer'],
    })

    // Verify this session belongs to the user
    const customer = checkoutSession.customer as Stripe.Customer
    if (customer.email !== session.user.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      id: checkoutSession.id,
      status: checkoutSession.status,
      paymentStatus: checkoutSession.payment_status,
      amountTotal: checkoutSession.amount_total,
      currency: checkoutSession.currency,
      customer: {
        email: customer.email,
        name: customer.name,
      },
    })
  } catch (error) {
    console.error('Session retrieval error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}