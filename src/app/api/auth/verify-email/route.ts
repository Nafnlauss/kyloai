import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')
    
    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=missing-token`
      )
    }
    
    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date()
        }
      }
    })
    
    if (!user) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/login?error=invalid-token`
      )
    }
    
    // Update user to mark email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        emailVerificationToken: null,
        emailVerificationExpires: null
      }
    })
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'EMAIL_VERIFIED',
        resource: 'auth',
        metadata: JSON.stringify({
          method: 'email-link',
          timestamp: new Date().toISOString()
        }),
      },
    })
    
    // Redirect to login with success message
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?verified=true`
    )
    
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/login?error=verification-failed`
    )
  }
}