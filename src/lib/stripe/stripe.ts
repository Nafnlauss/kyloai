import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Stripe price IDs configuration
export const STRIPE_PRICES = {
  LITE: {
    MONTHLY: process.env.STRIPE_PRICE_LITE_MONTHLY!,
    YEARLY: process.env.STRIPE_PRICE_LITE_YEARLY!,
  },
  CREATOR: {
    MONTHLY: process.env.STRIPE_PRICE_CREATOR_MONTHLY!,
    YEARLY: process.env.STRIPE_PRICE_CREATOR_YEARLY!,
  },
  PROFESSIONAL: {
    MONTHLY: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY!,
    YEARLY: process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY!,
  },
  // One-time credit purchases
  CREDITS: {
    PACK_50: process.env.STRIPE_PRICE_CREDITS_50!,
    PACK_100: process.env.STRIPE_PRICE_CREDITS_100!,
    PACK_500: process.env.STRIPE_PRICE_CREDITS_500!,
  }
}

// Helper functions
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  const { prisma } = await import('@/lib/prisma')
  
  // Check if user already has a Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true },
  })
  
  if (user?.stripeCustomerId) {
    return user.stripeCustomerId
  }
  
  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name: name || undefined,
    metadata: {
      userId,
    },
  })
  
  // Save customer ID to database
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  })
  
  return customer.id
}

export async function createCheckoutSession({
  userId,
  userEmail,
  userName,
  priceId,
  mode = 'subscription',
  successUrl,
  cancelUrl,
  metadata = {},
  quantity = 1,
}: {
  userId: string
  userEmail: string
  userName?: string | null
  priceId: string
  mode: 'payment' | 'subscription'
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
  quantity?: number
}) {
  const customerId = await getOrCreateStripeCustomer(userId, userEmail, userName)
  
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity,
      },
    ],
    mode,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      ...metadata,
    },
    subscription_data: mode === 'subscription' ? {
      metadata: {
        userId,
      },
    } : undefined,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    payment_method_types: ['card'],
    locale: 'pt-BR',
  })
  
  return session
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  
  return session
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
  
  return subscription
}

export async function reactivateSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })
  
  return subscription
}