import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createAuditLog, AUDIT_ACTIONS } from '@/lib/audit'

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        website: true,
        location: true,
        image: true,
        createdAt: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateProfileSchema.parse(body)

    // Get IP and User Agent for audit log
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: validatedData.name,
        bio: validatedData.bio,
        website: validatedData.website === '' ? null : validatedData.website,
        location: validatedData.location,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        website: true,
        location: true,
        image: true,
      }
    })

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: AUDIT_ACTIONS.USER_UPDATED,
      resource: 'user_profile',
      resourceId: session.user.id,
      metadata: { fields: Object.keys(validatedData) },
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
    })

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}