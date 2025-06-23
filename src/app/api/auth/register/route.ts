import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendWelcomeEmail } from '@/lib/email/email-service'
import { AccountLimiter } from '@/lib/security/account-limiter'
import { randomBytes } from 'crypto'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check for multiple account attempts (only for non-Google signups)
    const accountLimiter = new AccountLimiter()
    const canCreate = await accountLimiter.canCreateAccount(validatedData.email)
    
    if (!canCreate.allowed) {
      return NextResponse.json(
        { 
          error: canCreate.reason || 'Unable to create account at this time',
          requireSupport: true 
        },
        { status: 403 }
      )
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 409 }
      )
    }
    
    // Check if this should be an admin user
    const { isAdminEmail } = await import('@/config/admin-users')
    const role = isAdminEmail(validatedData.email) ? 'ADMIN' : 'USER'
    
    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(validatedData.password, saltRounds)
    
    // Generate email verification token
    const emailVerificationToken = randomBytes(32).toString('hex')
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    
    // Create user with free credits
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        passwordHash,
        credits: 300, // Free credits for new users
        creditsLastReset: new Date(), // Track when credits were given
        role, // Set admin role if email matches
        emailVerified: null, // Email not verified yet
        emailVerificationToken,
        emailVerificationExpires,
      },
    })
    
    // No subscription needed for free users
    // Users only get subscriptions when they upgrade to paid plans
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        resource: 'auth',
        metadata: JSON.stringify({
          method: 'email',
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        }),
      },
    })
    
    // Record account creation for anti-abuse system
    await accountLimiter.recordAccountCreation(user.email)
    
    // Send welcome email with verification link
    try {
      const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${emailVerificationToken}`
      
      await sendWelcomeEmail({
        email: user.email,
        name: user.name || 'User',
        verificationUrl, // Pass verification URL to email template
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail registration if email fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      requireEmailVerification: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Error creating account. Please try again.' },
      { status: 500 }
    )
  }
}