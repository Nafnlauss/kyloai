import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createAuditLog, AUDIT_ACTIONS } from '@/lib/audit'

const updatePreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'auto']).optional(),
  language: z.enum(['pt-BR', 'en-US', 'es-ES']).optional(),
  videoQuality: z.enum(['auto', '720p', '1080p', '4k']).optional(),
  autoPlay: z.boolean().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create preferences
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id }
    })

    if (!preferences) {
      // Create default preferences
      preferences = await prisma.userPreferences.create({
        data: {
          userId: session.user.id,
        }
      })
    }

    return NextResponse.json({ preferences })
  } catch (error) {
    console.error('Error fetching preferences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch preferences' },
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
    const validatedData = updatePreferencesSchema.parse(body)

    // Get IP and User Agent for audit log
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    // Update or create preferences
    const preferences = await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: validatedData,
      create: {
        userId: session.user.id,
        ...validatedData,
      }
    })

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: AUDIT_ACTIONS.USER_UPDATED,
      resource: 'user_preferences',
      resourceId: session.user.id,
      metadata: { fields: Object.keys(validatedData) },
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
    })

    return NextResponse.json({ 
      message: 'Preferences updated successfully',
      preferences 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating preferences:', error)
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    )
  }
}