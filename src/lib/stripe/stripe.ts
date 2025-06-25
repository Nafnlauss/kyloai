import Stripe from 'stripe'

// Lazy initialization of Stripe client
let stripeClient: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('Missing STRIPE_SECRET_KEY environment variable')
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    })
  }
  return stripeClient
}

// Stripe price IDs configuration - will be checked at runtime
export const STRIPE_PRICES = {
  LITE: {
    get MONTHLY() { return process.env.STRIPE_PRICE_LITE_MONTHLY || '' },
    get YEARLY() { return process.env.STRIPE_PRICE_LITE_YEARLY || '' },
  },
  CREATOR: {
    get MONTHLY() { return process.env.STRIPE_PRICE_CREATOR_MONTHLY || '' },
    get YEARLY() { return process.env.STRIPE_PRICE_CREATOR_YEARLY || '' },
  },
  PROFESSIONAL: {
    get MONTHLY() { return process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY || '' },
    get YEARLY() { return process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY || '' },
  },
  // One-time credit purchases
  CREDITS: {
    get PACK_1000() { return process.env.STRIPE_PRICE_CREDITS_1000 || '' },
    get PACK_2500() { return process.env.STRIPE_PRICE_CREDITS_2500 || '' },
    get PACK_7000() { return process.env.STRIPE_PRICE_CREDITS_7000 || '' },
    get PACK_16000() { return process.env.STRIPE_PRICE_CREDITS_16000 || '' },
  }
}

// Helper functions
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string | null
): Promise<string> {
  const stripe = getStripe()
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
  const stripe = getStripe()
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
  const stripe = getStripe()
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  
  return session
}

export async function cancelSubscription(subscriptionId: string) {
  const stripe = getStripe()
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })
  
  return subscription
}

export async function reactivateSubscription(subscriptionId: string) {
  const stripe = getStripe()
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })
  
  return subscription
}

// Export stripe getter for direct access when needed
export const stripe = getStripe