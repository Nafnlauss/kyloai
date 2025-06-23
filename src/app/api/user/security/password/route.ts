import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createAuditLog, AUDIT_ACTIONS } from '@/lib/audit'
import bcrypt from 'bcryptjs'

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Password confirmation is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = changePasswordSchema.parse(body)

    // Get user with current password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        passwordHash: true,
        email: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Users who signed up with OAuth don't have a password
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'Password change not available for OAuth accounts' },
        { status: 400 }
      )
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(validatedData.currentPassword, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Check if new password is the same as current
    const isSamePassword = await bcrypt.compare(validatedData.newPassword, user.passwordHash)
    if (isSamePassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 12)

    // Get IP and User Agent for audit log
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        passwordHash: hashedPassword,
        // Reset failed login attempts since password was successfully changed
        failedLoginAttempts: 0,
        lockedUntil: null,
      }
    })

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: AUDIT_ACTIONS.PASSWORD_RESET_COMPLETED,
      resource: 'user_security',
      resourceId: session.user.id,
      metadata: { method: 'settings_page' },
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
    })

    // In production, you might want to:
    // 1. Send email notification about password change
    // 2. Invalidate all other sessions
    // 3. Require re-authentication

    return NextResponse.json({ 
      message: 'Password changed successfully' 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}