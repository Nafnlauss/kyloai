import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { stripe } from '@/lib/stripe/stripe'
import { prisma } from '@/lib/prisma'

// DELETE /api/user/payment-methods/[id] - Remove a payment method
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const paymentMethodId = params.id

    // Get user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No payment methods found' },
        { status: 404 }
      )
    }

    // Verify payment method belongs to this customer
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
    
    if (paymentMethod.customer !== user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      )
    }

    // Check if this is the default payment method
    const customer = await stripe.customers.retrieve(user.stripeCustomerId)
    const isDefault = 
      typeof customer !== 'string' && 
      !customer.deleted && 
      customer.invoice_settings?.default_payment_method === paymentMethodId

    // Detach payment method from customer
    await stripe.paymentMethods.detach(paymentMethodId)

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'PAYMENT_METHOD_REMOVED',
        resource: 'payment_method',
        resourceId: paymentMethodId,
        metadata: JSON.stringify({
          brand: paymentMethod.card?.brand,
          last4: paymentMethod.card?.last4,
          wasDefault: isDefault,
        }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        userAgent: req.headers.get('user-agent') || undefined,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Payment method removed successfully',
    })
  } catch (error) {
    console.error('Error removing payment method:', error)
    return NextResponse.json(
      { error: 'Failed to remove payment method' },
      { status: 500 }
    )
  }
}

// PATCH /api/user/payment-methods/[id] - Set as default payment method
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const paymentMethodId = params.id

    // Get user's Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No payment methods found' },
        { status: 404 }
      )
    }

    // Verify payment method belongs to this customer
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
    
    if (paymentMethod.customer !== user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Payment method not found' },
        { status: 404 }
      )
    }

    // Update default payment method
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'PAYMENT_METHOD_SET_DEFAULT',
        resource: 'payment_method',
        resourceId: paymentMethodId,
        metadata: JSON.stringify({
          brand: paymentMethod.card?.brand,
          last4: paymentMethod.card?.last4,
        }),
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
        userAgent: req.headers.get('user-agent') || undefined,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Default payment method updated',
    })
  } catch (error) {
    console.error('Error updating default payment method:', error)
    return NextResponse.json(
      { error: 'Failed to update default payment method' },
      { status: 500 }
    )
  }
}