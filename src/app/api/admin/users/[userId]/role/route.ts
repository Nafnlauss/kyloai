import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { isDemoMode } from '@/lib/auth/demo-mode'
import { adminGuardAPI } from '@/lib/auth/admin-guard'
import { z } from 'zod'

const updateRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN', 'MODERATOR'])
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Await params before using
    const { userId } = await params

    // Check authentication - only ADMIN can change roles
    if (!isDemoMode()) {
      const guardResult = await adminGuardAPI(req, ['ADMIN'])
      if (!guardResult.authorized) {
        return guardResult.response!
      }

      // Get current user to prevent self-role change
      const session = await getServerSession()
      const currentUser = await prisma.user.findUnique({
        where: { email: session!.user.email },
        select: { id: true }
      })

      // Prevent admin from changing their own role
      if (currentUser?.id === userId) {
        return NextResponse.json(
          { error: 'Cannot change your own role' },
          { status: 400 }
        )
      }
    }

    // Validate request body
    const body = await req.json()
    const validatedData = updateRoleSchema.parse(body)

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, role: true }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user role - simple update without extra fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: validatedData.role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    })

    // Create audit log
    if (!isDemoMode()) {
      try {
        await prisma.auditLog.create({
          data: {
            userId: userId,
            action: 'USER_ROLE_CHANGED',
            metadata: {
              oldRole: targetUser.role,
              newRole: validatedData.role,
              targetEmail: targetUser.email
            }
          }
        })
      } catch (error) {
        console.error('Audit log error:', error)
      }
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `User role updated to ${validatedData.role}`
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update role error:', error)
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    )
  }
}