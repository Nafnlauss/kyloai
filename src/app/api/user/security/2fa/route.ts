import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createAuditLog, AUDIT_ACTIONS } from '@/lib/audit'
import * as speakeasy from 'speakeasy'
import * as qrcode from 'qrcode'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

const enable2FASchema = z.object({
  password: z.string().min(1, 'Password is required'),
  token: z.string().length(6, 'Token must be 6 digits'),
})

const disable2FASchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

const verify2FASchema = z.object({
  token: z.string().length(6, 'Token must be 6 digits'),
})

// Generate backup codes
function generateBackupCodes(count = 8): string[] {
  const codes: string[] = []
  for (let i = 0; i < count; i++) {
    const code = randomBytes(4).toString('hex').toUpperCase()
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`)
  }
  return codes
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        twoFactorEnabled: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      twoFactorEnabled: user.twoFactorEnabled 
    })
  } catch (error) {
    console.error('Error fetching 2FA status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch 2FA status' },
      { status: 500 }
    )
  }
}

// Generate QR code for 2FA setup
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        email: true,
        twoFactorEnabled: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is already enabled' },
        { status: 400 }
      )
    }

    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `Kylo AI (${user.email})`,
      issuer: 'Kylo AI Video Hub',
    })

    // Generate QR code
    const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!)

    // Store secret temporarily in session or cache
    // In production, use Redis or similar for temporary storage
    // For now, we'll return it to the client (less secure)
    
    return NextResponse.json({ 
      secret: secret.base32,
      qrCode: qrCodeUrl,
      manualEntry: secret.base32,
    })
  } catch (error) {
    console.error('Error generating 2FA setup:', error)
    return NextResponse.json(
      { error: 'Failed to generate 2FA setup' },
      { status: 500 }
    )
  }
}

// Enable 2FA
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { password, token, secret } = body

    // Validate input
    const validatedData = enable2FASchema.parse({ password, token })

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        passwordHash: true,
        twoFactorEnabled: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is already enabled' },
        { status: 400 }
      )
    }

    // Verify password
    if (!user.passwordHash || !await bcrypt.compare(password, user.passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Verify token
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: validatedData.token,
      window: 2,
    })

    if (!verified) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes()

    // Get IP and User Agent for audit log
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    // Enable 2FA and save backup codes
    await prisma.$transaction(async (tx) => {
      // Update user
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          twoFactorEnabled: true,
          twoFactorSecret: secret, // In production, encrypt this
        }
      })

      // Save backup codes
      await tx.twoFactorBackupCode.createMany({
        data: backupCodes.map(code => ({
          userId: session.user.id,
          code: bcrypt.hashSync(code, 10),
        }))
      })
    })

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'TWO_FACTOR_ENABLED',
      resource: 'user_security',
      resourceId: session.user.id,
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
    })

    return NextResponse.json({ 
      message: '2FA enabled successfully',
      backupCodes, // Return codes only once
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error enabling 2FA:', error)
    return NextResponse.json(
      { error: 'Failed to enable 2FA' },
      { status: 500 }
    )
  }
}

// Disable 2FA
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = disable2FASchema.parse(body)

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        passwordHash: true,
        twoFactorEnabled: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA is not enabled' },
        { status: 400 }
      )
    }

    // Verify password
    if (!user.passwordHash || !await bcrypt.compare(validatedData.password, user.passwordHash)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Get IP and User Agent for audit log
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    // Disable 2FA and remove backup codes
    await prisma.$transaction(async (tx) => {
      // Update user
      await tx.user.update({
        where: { id: session.user.id },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null,
        }
      })

      // Delete backup codes
      await tx.twoFactorBackupCode.deleteMany({
        where: { userId: session.user.id }
      })
    })

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'TWO_FACTOR_DISABLED',
      resource: 'user_security',
      resourceId: session.user.id,
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
    })

    return NextResponse.json({ 
      message: '2FA disabled successfully' 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error disabling 2FA:', error)
    return NextResponse.json(
      { error: 'Failed to disable 2FA' },
      { status: 500 }
    )
  }
}