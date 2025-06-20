import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPurchaseConfirmationEmail, sendSubscriptionRenewalEmail } from '@/lib/email/email-service'
import type Stripe from 'stripe'

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
])

export async function POST(req: NextRequest) {
  // Check for required environment variables at runtime
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Missing Stripe configuration')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const { stripe } = await import('@/lib/stripe/stripe')
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }
  
  if (!relevantEvents.has(event.type)) {
    return NextResponse.json({ received: true })
  }
  
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice)
        break
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  
  if (!userId) {
    console.error('No userId in checkout session metadata')
    return
  }
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, name: true },
  })
  
  if (!user) {
    console.error('User not found:', userId)
    return
  }
  
  // Handle credit purchase
  if (session.metadata?.type === 'credits') {
    const credits = parseInt(session.metadata.credits)
    
    // Add credits to user
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { increment: credits },
      },
    })
    
    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId,
        amount: session.amount_total || 0,
        currency: session.currency || 'brl',
        credits,
        type: 'CREDIT_PURCHASE',
        status: 'COMPLETED',
        gateway: 'STRIPE',
        stripePaymentIntentId: session.payment_intent as string,
        metadata: JSON.stringify(session.metadata),
      },
    })
    
    // Send confirmation email
    await sendPurchaseConfirmationEmail({
      email: user.email,
      name: user.name || 'User',
      plan: `${credits} Credits`,
      amount: session.amount_total || 0,
      credits,
    })
  }
  // Handle subscription
  else {
    // Subscription will be handled by subscription events
    const planId = session.metadata?.planId
    
    if (planId) {
      const plan = await prisma.plan.findFirst({
        where: { name: planId.toLowerCase() },
      })
      
      if (plan) {
        await sendPurchaseConfirmationEmail({
          email: user.email,
          name: user.name || 'User',
          plan: plan.displayName,
          amount: session.amount_total || 0,
        })
      }
    }
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  
  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }
  
  const priceId = subscription.items.data[0].price.id
  const planName = getPlanNameFromPriceId(priceId)
  
  if (!planName) {
    console.error('Unknown price ID:', priceId)
    return
  }
  
  const plan = await prisma.plan.findFirst({
    where: { name: planName.toLowerCase() },
  })
  
  if (!plan) {
    console.error('Plan not found:', planName)
    return
  }
  
  // Update or create subscription
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      planId: plan.id,
      status: mapStripeStatus(subscription.status),
      interval: subscription.items.data[0].price.recurring?.interval === 'year' ? 'YEARLY' : 'MONTHLY',
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeSubscriptionId: subscription.id,
      stripePriceId: priceId,
    },
    update: {
      planId: plan.id,
      status: mapStripeStatus(subscription.status),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripePriceId: priceId,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    },
  })
  
  // Add monthly credits if subscription is active
  if (subscription.status === 'active') {
    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: { increment: plan.monthlyCredits },
      },
    })
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  
  if (!userId) {
    console.error('No userId in subscription metadata')
    return
  }
  
  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'CANCELLED',
      canceledAt: new Date(),
    },
  })
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return
  
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
  const userId = subscription.metadata.userId
  
  if (!userId) return
  
  // Create transaction record
  await prisma.transaction.create({
    data: {
      userId,
      amount: invoice.amount_paid,
      currency: invoice.currency,
      type: invoice.billing_reason === 'subscription_create' ? 'SUBSCRIPTION' : 'SUBSCRIPTION_RENEWAL',
      status: 'COMPLETED',
      gateway: 'STRIPE',
      stripePaymentIntentId: invoice.payment_intent as string,
      invoiceUrl: invoice.invoice_pdf,
      metadata: JSON.stringify({
        invoiceId: invoice.id,
        subscriptionId: invoice.subscription,
      }),
    },
  })
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return
  
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string)
  const userId = subscription.metadata.userId
  
  if (!userId) return
  
  // Update subscription status
  await prisma.subscription.update({
    where: { stripeSubscriptionId: invoice.subscription as string },
    data: {
      status: 'PAST_DUE',
    },
  })
}

// Helper functions
function getPlanNameFromPriceId(priceId: string): string | null {
  // Map price IDs to plan names
  const priceMap: Record<string, string> = {
    [process.env.STRIPE_PRICE_LITE_MONTHLY!]: 'LITE',
    [process.env.STRIPE_PRICE_LITE_YEARLY!]: 'LITE',
    [process.env.STRIPE_PRICE_CREATOR_MONTHLY!]: 'CREATOR',
    [process.env.STRIPE_PRICE_CREATOR_YEARLY!]: 'CREATOR',
    [process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY!]: 'PROFESSIONAL',
    [process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY!]: 'PROFESSIONAL',
  }
  
  return priceMap[priceId] || null
}

function mapStripeStatus(status: string): 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'PAUSED' | 'TRIALING' | 'INCOMPLETE' {
  const statusMap: Record<string, any> = {
    active: 'ACTIVE',
    past_due: 'PAST_DUE',
    canceled: 'CANCELLED',
    paused: 'PAUSED',
    trialing: 'TRIALING',
    incomplete: 'INCOMPLETE',
    incomplete_expired: 'CANCELLED',
  }
  
  return statusMap[status] || 'INCOMPLETE'
}