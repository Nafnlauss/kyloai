import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

// Credit packages configuration
const CREDIT_PACKAGES = {
  'price_1QUpOzP8MKruhJI7aTBKgFtH': { credits: 100, name: 'Basic Package' },
  'price_1QUpPJP8MKruhJI7WJjLRnxB': { credits: 300, name: 'Standard Package' },
  'price_1QUpPXP8MKruhJI7XFGlOOKT': { credits: 800, name: 'Pro Package' },
  'price_1QUpPhP8MKruhJI7hU1bgBvw': { credits: 2000, name: 'Mega Package' },
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Check for idempotency
  const existingEvent = await prisma.stripeEvent.findUnique({
    where: { eventId: event.id },
  })

  if (existingEvent) {
    console.log('Event already processed:', event.id)
    return NextResponse.json({ received: true })
  }

  // Store event for idempotency
  await prisma.stripeEvent.create({
    data: {
      eventId: event.id,
      type: event.type,
      data: JSON.stringify(event.data),
      processed: false,
    },
  })

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Get user ID from metadata
        const userId = session.metadata?.userId
        if (!userId) {
          console.error('No userId in session metadata')
          break
        }

        // Get price ID from line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
        const priceId = lineItems.data[0]?.price?.id
        
        if (!priceId || !CREDIT_PACKAGES[priceId]) {
          console.error('Unknown price ID:', priceId)
          break
        }

        const creditPackage = CREDIT_PACKAGES[priceId]
        const quantity = lineItems.data[0]?.quantity || 1
        const totalCredits = creditPackage.credits * quantity

        // Start transaction
        await prisma.$transaction(async (tx) => {
          // Add credits to user
          const user = await tx.user.update({
            where: { id: userId },
            data: {
              credits: {
                increment: totalCredits,
              },
            },
          })

          // Create payment record
          await tx.payment.create({
            data: {
              userId,
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              status: 'succeeded',
              sessionId: session.id,
              metadata: JSON.stringify({
                priceId,
                quantity,
                credits: totalCredits,
                packageName: creditPackage.name,
              }),
            },
          })

          // Create credit history
          await tx.creditHistory.create({
            data: {
              userId,
              amount: totalCredits,
              type: 'PURCHASE',
              description: `Purchased ${creditPackage.name} (${totalCredits} credits)`,
              balance: user.credits,
            },
          })

          // Create audit log
          await tx.auditLog.create({
            data: {
              userId,
              action: 'CREDIT_PURCHASE',
              details: `Purchased ${totalCredits} credits via Stripe`,
              ipAddress: req.headers.get('x-forwarded-for') || 'webhook',
            },
          })
        })

        console.log(`Added ${totalCredits} credits to user ${userId}`)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)
        // Additional processing if needed
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        
        // Find the payment by session ID
        const paymentIntentId = charge.payment_intent as string
        const session = await stripe.checkout.sessions.list({
          payment_intent: paymentIntentId,
          limit: 1,
        })

        if (session.data.length === 0) {
          console.error('No session found for refund')
          break
        }

        const payment = await prisma.payment.findUnique({
          where: { sessionId: session.data[0].id },
        })

        if (!payment) {
          console.error('Payment not found for refund')
          break
        }

        // Calculate credits to remove
        const metadata = payment.metadata ? JSON.parse(payment.metadata) : {}
        const creditsToRemove = metadata.credits || 0

        await prisma.$transaction(async (tx) => {
          // Update payment status
          await tx.payment.update({
            where: { id: payment.id },
            data: { status: 'refunded' },
          })

          // Remove credits from user
          const user = await tx.user.update({
            where: { id: payment.userId },
            data: {
              credits: {
                decrement: Math.min(creditsToRemove, 0), // Don't go negative
              },
            },
          })

          // Create credit history
          await tx.creditHistory.create({
            data: {
              userId: payment.userId,
              amount: -creditsToRemove,
              type: 'REFUND',
              description: `Refund for ${metadata.packageName || 'credit package'}`,
              balance: user.credits,
            },
          })

          // Create audit log
          await tx.auditLog.create({
            data: {
              userId: payment.userId,
              action: 'CREDIT_REFUND',
              details: `Refunded ${creditsToRemove} credits`,
              ipAddress: 'webhook',
            },
          })
        })

        console.log(`Refunded ${creditsToRemove} credits from user ${payment.userId}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark event as processed
    await prisma.stripeEvent.update({
      where: { eventId: event.id },
      data: { processed: true },
    })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}