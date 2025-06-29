import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const walletSchema = z.object({
  cryptoAddress: z.string().min(1, 'Crypto address is required'),
  cryptoNetwork: z.enum(['ERC20', 'SOL', 'POLYGON']),
  isDefault: z.boolean().optional()
})

// GET user's saved wallets
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // For now, we'll store wallet info in user preferences or metadata
    // In a production system, you'd want a separate UserWallet table
    const userPreferences = await prisma.userPreferences.findUnique({
      where: { userId: user.id }
    })

    const wallets = userPreferences?.metadata ? 
      JSON.parse(userPreferences.metadata).wallets || [] : []

    return NextResponse.json({ wallets })
  } catch (error) {
    console.error('Error fetching wallets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wallets' },
      { status: 500 }
    )
  }
}

// POST save a new wallet
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await req.json()
    const validatedData = walletSchema.parse(body)

    // Validate crypto address format
    if (!isValidCryptoAddress(validatedData.cryptoAddress, validatedData.cryptoNetwork)) {
      return NextResponse.json({ 
        error: 'Invalid crypto address for selected network' 
      }, { status: 400 })
    }

    // Get or create user preferences
    const userPreferences = await prisma.userPreferences.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        metadata: JSON.stringify({
          wallets: [{
            ...validatedData,
            id: generateWalletId(),
            createdAt: new Date().toISOString(),
            verified: false
          }]
        })
      },
      update: {}
    })

    // Add wallet to existing wallets
    const metadata = userPreferences.metadata ? JSON.parse(userPreferences.metadata) : {}
    const wallets = metadata.wallets || []
    
    // Check if wallet already exists
    const existingWallet = wallets.find((w: any) => 
      w.cryptoAddress === validatedData.cryptoAddress && 
      w.cryptoNetwork === validatedData.cryptoNetwork
    )

    if (existingWallet) {
      return NextResponse.json({ 
        error: 'This wallet is already saved' 
      }, { status: 400 })
    }

    // Add new wallet
    const newWallet = {
      id: generateWalletId(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      verified: false
    }

    // If this is the default wallet, unset other defaults
    if (validatedData.isDefault) {
      wallets.forEach((w: any) => { w.isDefault = false })
    }

    wallets.push(newWallet)

    // Update preferences
    await prisma.userPreferences.update({
      where: { userId: user.id },
      data: {
        metadata: JSON.stringify({ ...metadata, wallets })
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'WALLET_ADDED',
        resource: 'referral',
        metadata: JSON.stringify({
          network: validatedData.cryptoNetwork,
          addressMasked: maskCryptoAddress(validatedData.cryptoAddress)
        })
      }
    })

    return NextResponse.json({
      success: true,
      wallet: {
        ...newWallet,
        cryptoAddress: maskCryptoAddress(newWallet.cryptoAddress)
      }
    })
  } catch (error) {
    console.error('Error saving wallet:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to save wallet' },
      { status: 500 }
    )
  }
}

// DELETE remove a wallet
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const walletId = searchParams.get('id')

    if (!walletId) {
      return NextResponse.json({ error: 'Wallet ID is required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userPreferences = await prisma.userPreferences.findUnique({
      where: { userId: user.id }
    })

    if (!userPreferences?.metadata) {
      return NextResponse.json({ error: 'No wallets found' }, { status: 404 })
    }

    const metadata = JSON.parse(userPreferences.metadata)
    const wallets = metadata.wallets || []
    
    const updatedWallets = wallets.filter((w: any) => w.id !== walletId)

    if (wallets.length === updatedWallets.length) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    // Update preferences
    await prisma.userPreferences.update({
      where: { userId: user.id },
      data: {
        metadata: JSON.stringify({ ...metadata, wallets: updatedWallets })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting wallet:', error)
    return NextResponse.json(
      { error: 'Failed to delete wallet' },
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

// Generate unique wallet ID
function generateWalletId(): string {
  return `wallet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}