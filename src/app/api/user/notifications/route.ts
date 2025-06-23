import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createAuditLog, AUDIT_ACTIONS } from '@/lib/audit'

const updateNotificationsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  notifyOnVideoComplete: z.boolean().optional(),
  notifyOnCreditLow: z.boolean().optional(),
  notifyOnNewFeatures: z.boolean().optional(),
  notifyOnPromotions: z.boolean().optional(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create preferences
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
      select: {
        emailNotifications: true,
        pushNotifications: true,
        notifyOnVideoComplete: true,
        notifyOnCreditLow: true,
        notifyOnNewFeatures: true,
        notifyOnPromotions: true,
      }
    })

    if (!preferences) {
      // Create default preferences
      preferences = await prisma.userPreferences.create({
        data: {
          userId: session.user.id,
        },
        select: {
          emailNotifications: true,
          pushNotifications: true,
          notifyOnVideoComplete: true,
          notifyOnCreditLow: true,
          notifyOnNewFeatures: true,
          notifyOnPromotions: true,
        }
      })
    }

    return NextResponse.json({ notifications: preferences })
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notification settings' },
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
    const validatedData = updateNotificationsSchema.parse(body)

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
      },
      select: {
        emailNotifications: true,
        pushNotifications: true,
        notifyOnVideoComplete: true,
        notifyOnCreditLow: true,
        notifyOnNewFeatures: true,
        notifyOnPromotions: true,
      }
    })

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: AUDIT_ACTIONS.USER_UPDATED,
      resource: 'notification_settings',
      resourceId: session.user.id,
      metadata: { fields: Object.keys(validatedData) },
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
    })

    return NextResponse.json({ 
      message: 'Notification settings updated successfully',
      notifications: preferences 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating notification settings:', error)
    return NextResponse.json(
      { error: 'Failed to update notification settings' },
      { status: 500 }
    )
  }
}