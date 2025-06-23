import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { stripe } from '@/lib/stripe/stripe'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Schema for adding a payment method
const addPaymentMethodSchema = z.object({
  paymentMethodId: z.string().min(1, 'Payment method ID is required'),
  setAsDefault: z.boolean().default(false),
})

// GET /api/user/payment-methods - List all payment methods
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user with Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json({ paymentMethods: [] })
    }

    // Get payment methods from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
    })

    // Get the default payment method
    const customer = await stripe.customers.retrieve(user.stripeCustomerId)
    const defaultPaymentMethodId = 
      typeof customer !== 'string' && !customer.deleted 
        ? customer.invoice_settings?.default_payment_method 
        : null

    // Format payment methods for response
    const formattedMethods = paymentMethods.data.map(pm => ({
      id: pm.id,
      brand: pm.card?.brand || 'unknown',
      last4: pm.card?.last4 || '****',
      expMonth: pm.card?.exp_month,
      expYear: pm.card?.exp_year,
      isDefault: pm.id === defaultPaymentMethodId,
      created: pm.created,
    }))

    return NextResponse.json({ 
      paymentMethods: formattedMethods,
      defaultPaymentMethodId,
    })
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    )
  }
}

// POST /api/user/payment-methods - Add a new payment method
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const validatedData = addPaymentMethodSchema.parse(body)

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

    // Attach payment method to customer
    await stripe.paymentMethods.attach(validatedData.paymentMethodId, {
      customer: stripeCustomerId,
    })

    // Set as default if requested
    if (validatedData.setAsDefault) {
      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: {
          default_payment_method: validatedData.paymentMethodId,
        },
      })
    }

    // Retrieve the attached payment method
    const paymentMethod = await stripe.paymentMethods.retrieve(validatedData.paymentMethodId)

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'PAYMENT_METHOD_ADDED',
        resource: 'payment_method',
        resourceId: paymentMethod.id,
        metadata: JSON.stringify({
          brand: paymentMethod.card?.brand,
          last4: paymentMethod.card?.last4,
          setAsDefault: validatedData.setAsDefault,
        }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        userAgent: req.headers.get('user-agent') || undefined,
      },
    })

    return NextResponse.json({
      success: true,
      paymentMethod: {
        id: paymentMethod.id,
        brand: paymentMethod.card?.brand || 'unknown',
        last4: paymentMethod.card?.last4 || '****',
        expMonth: paymentMethod.card?.exp_month,
        expYear: paymentMethod.card?.exp_year,
        isDefault: validatedData.setAsDefault,
      },
    })
  } catch (error) {
    console.error('Error adding payment method:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to add payment method' },
      { status: 500 }
    )
  }
}

// DELETE /api/user/payment-methods/[id] - We'll create a separate file for this