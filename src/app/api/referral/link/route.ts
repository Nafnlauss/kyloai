import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { ReferralManager } from '@/lib/referral'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user with referral code
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        referralCode: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate referral code if doesn't exist
    let referralCode = user.referralCode
    if (!referralCode) {
      // Generate a simple readable code
      referralCode = generateReferralCode()
      
      // Ensure it's unique
      let isUnique = false
      let attempts = 0
      while (!isUnique && attempts < 10) {
        const existing = await prisma.user.findUnique({
          where: { referralCode }
        })
        
        if (!existing) {
          isUnique = true
        } else {
          referralCode = generateReferralCode()
          attempts++
        }
      }

      // Update user with new code
      await prisma.user.update({
        where: { id: user.id },
        data: { referralCode }
      })
    }

    // Generate link
    const referralLink = ReferralManager.generateReferralLink(referralCode)

    return NextResponse.json({
      referralCode,
      referralLink
    })
  } catch (error) {
    console.error('Error getting referral link:', error)
    return NextResponse.json(
      { error: 'Failed to get referral link' },
      { status: 500 }
    )
  }
}

// Generate a simple readable referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}