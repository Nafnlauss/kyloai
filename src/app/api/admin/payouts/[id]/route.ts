import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updatePayoutSchema = z.object({
  status: z.enum(['COMPLETED', 'FAILED', 'CANCELLED']),
  transactionHash: z.string().optional(),
  notes: z.string().optional()
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, role: true }
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = updatePayoutSchema.parse(body)

    // Get the payout
    const payout = await prisma.referralPayout.findUnique({
      where: { id: params.id },
      include: {
        earnings: true
      }
    })

    if (!payout) {
      return NextResponse.json({ error: 'Payout not found' }, { status: 404 })
    }

    if (payout.status !== 'PENDING') {
      return NextResponse.json({ 
        error: 'Can only update pending payouts' 
      }, { status: 400 })
    }

    // Start transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update payout
      const updatedPayout = await tx.referralPayout.update({
        where: { id: params.id },
        data: {
          status: validatedData.status,
          transactionHash: validatedData.transactionHash,
          notes: validatedData.notes,
          processedAt: new Date(),
          processedBy: user.id
        }
      })

      // Update user stats based on status
      if (validatedData.status === 'COMPLETED') {
        // Mark earnings as paid
        await tx.referralEarning.updateMany({
          where: {
            userId: payout.userId,
            status: 'CONFIRMED',
            payoutId: null
          },
          data: {
            status: 'PAID',
            payoutId: payout.id,
            processedAt: new Date()
          }
        })

        // Update user stats
        await tx.referralStats.update({
          where: { userId: payout.userId },
          data: {
            paidEarnings: { increment: payout.amount },
            lastCalculatedAt: new Date()
          }
        })
      } else if (validatedData.status === 'FAILED' || validatedData.status === 'CANCELLED') {
        // Return amount to pending earnings
        await tx.referralStats.update({
          where: { userId: payout.userId },
          data: {
            pendingEarnings: { increment: payout.amount },
            lastCalculatedAt: new Date()
          }
        })
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: `PAYOUT_${validatedData.status}`,
          resource: 'referral',
          resourceId: payout.id,
          metadata: JSON.stringify({
            payoutId: payout.id,
            amount: payout.amount,
            status: validatedData.status,
            transactionHash: validatedData.transactionHash,
            notes: validatedData.notes
          })
        }
      })

      return updatedPayout
    })

    return NextResponse.json({
      success: true,
      payout: result
    })
  } catch (error) {
    console.error('Error updating payout:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update payout' },
      { status: 500 }
    )
  }
}