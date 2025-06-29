import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const MINIMUM_PAYOUT_AMOUNT = 1000 // $10 in cents

const requestPayoutSchema = z.object({
  amount: z.number().min(MINIMUM_PAYOUT_AMOUNT, `Minimum payout is $${MINIMUM_PAYOUT_AMOUNT / 100}`),
  method: z.enum(['USDT_ERC20', 'USDT_SOL', 'USDT_POLYGON']),
  cryptoAddress: z.string().min(1, 'Crypto address is required'),
  cryptoNetwork: z.enum(['ERC20', 'SOL', 'POLYGON'])
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user and stats
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        referralStats: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await req.json()
    const validatedData = requestPayoutSchema.parse(body)

    // Check if user has enough pending earnings
    const pendingEarnings = user.referralStats?.pendingEarnings || 0
    
    if (pendingEarnings < validatedData.amount) {
      return NextResponse.json({ 
        error: 'Insufficient balance',
        available: pendingEarnings,
        requested: validatedData.amount
      }, { status: 400 })
    }

    // Validate crypto address format based on network
    if (!isValidCryptoAddress(validatedData.cryptoAddress, validatedData.cryptoNetwork)) {
      return NextResponse.json({ 
        error: 'Invalid crypto address for selected network' 
      }, { status: 400 })
    }

    // Check if there's already a pending payout
    const pendingPayout = await prisma.referralPayout.findFirst({
      where: {
        userId: user.id,
        status: { in: ['PENDING', 'PROCESSING'] }
      }
    })

    if (pendingPayout) {
      return NextResponse.json({ 
        error: 'You already have a pending payout request' 
      }, { status: 400 })
    }

    // Create payout request
    const payout = await prisma.referralPayout.create({
      data: {
        userId: user.id,
        amount: validatedData.amount,
        currency: 'USD',
        method: validatedData.method,
        status: 'PENDING',
        cryptoAddress: validatedData.cryptoAddress,
        cryptoNetwork: validatedData.cryptoNetwork,
        metadata: JSON.stringify({
          requestedAt: new Date().toISOString(),
          ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
        })
      }
    })

    // Update user stats - move from pending to processing
    await prisma.referralStats.update({
      where: { userId: user.id },
      data: {
        pendingEarnings: {
          decrement: validatedData.amount
        }
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PAYOUT_REQUESTED',
        resource: 'referral',
        resourceId: payout.id,
        metadata: JSON.stringify({
          amount: validatedData.amount,
          method: validatedData.method,
          network: validatedData.cryptoNetwork
        })
      }
    })

    return NextResponse.json({
      success: true,
      payout: {
        id: payout.id,
        amount: payout.amount,
        currency: payout.currency,
        method: payout.method,
        status: payout.status,
        cryptoAddress: maskCryptoAddress(payout.cryptoAddress!),
        cryptoNetwork: payout.cryptoNetwork,
        createdAt: payout.createdAt
      }
    })
  } catch (error) {
    console.error('Error requesting payout:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to request payout' },
      { status: 500 }
    )
  }
}

// Validate crypto address format
function isValidCryptoAddress(address: string, network: string): boolean {
  switch (network) {
    case 'ERC20':
    case 'POLYGON':
      // Ethereum/Polygon address validation (0x + 40 hex chars)
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    
    case 'SOL':
      // Solana address validation (base58, 32-44 chars)
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
    
    default:
      return false
  }
}

// Mask crypto address for privacy
function maskCryptoAddress(address: string): string {
  if (address.length < 10) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}