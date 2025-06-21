import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendWelcomeEmail } from '@/lib/email/email-service'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email já está cadastrado' },
        { status: 409 }
      )
    }
    
    // Check if this should be an admin user
    const { isAdminEmail } = await import('@/config/admin-users')
    const role = isAdminEmail(validatedData.email) ? 'ADMIN' : 'USER'
    
    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(validatedData.password, saltRounds)
    
    // Create user with free plan
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        passwordHash,
        credits: 300, // Welcome credits (updated from 10)
        role, // Set admin role if email matches
      },
    })
    
    // Create free subscription
    const freePlan = await prisma.plan.findUnique({
      where: { name: 'free' },
    })
    
    if (freePlan) {
      await prisma.subscription.create({
        data: {
          userId: user.id,
          planId: freePlan.id,
          status: 'ACTIVE',
          interval: 'MONTHLY',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      })
    }
    
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
    
    // Send welcome email
    try {
      await sendWelcomeEmail({
        email: user.email,
        name: user.name || 'User',
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail registration if email fails
    }
    
    return NextResponse.json({
      success: true,
      message: 'Conta criada com sucesso',
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
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erro ao criar conta. Tente novamente.' },
      { status: 500 }
    )
  }
}