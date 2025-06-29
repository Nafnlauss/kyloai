import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { isDemoMode } from '@/lib/auth/demo-mode'
import { adminGuardAPI } from '@/lib/auth/admin-guard'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Await params before using
    const { userId } = await params

    // Check authentication - only ADMIN can delete users
    if (!isDemoMode()) {
      const guardResult = await adminGuardAPI(req, ['ADMIN'])
      if (!guardResult.authorized) {
        return guardResult.response!
      }

      // Get current user to prevent self-deletion
      const session = await getServerSession()
      const currentUser = await prisma.user.findUnique({
        where: { email: session!.user.email },
        select: { id: true }
      })

      // Prevent admin from deleting their own account
      if (currentUser?.id === userId) {
        return NextResponse.json(
          { error: 'Cannot delete your own account' },
          { status: 400 }
        )
      }
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        email: true, 
        name: true,
        role: true,
        _count: {
          select: {
            videos: true,
            transactions: true
          }
        }
      }
    })

    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Prevent deletion of other admins (safety measure)
    if (targetUser.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Cannot delete other admin accounts' },
        { status: 400 }
      )
    }

    // Start transaction to delete all related data
    const result = await prisma.$transaction(async (tx) => {
      // Delete in correct order based on dependencies
      
      // 1. Delete videos (they might have references)
      await tx.video.deleteMany({
        where: { userId: userId }
      })

      // 2. Delete transactions
      await tx.transaction.deleteMany({
        where: { userId: userId }
      })

      // 3. Delete payments if table exists
      try {
        await tx.payment.deleteMany({
          where: { userId: userId }
        })
      } catch (e) {
        // Table might not exist, continue
      }

      // 4. Delete credit history if exists
      try {
        await tx.creditHistory.deleteMany({
          where: { userId: userId }
        })
      } catch (e) {
        // Table might not exist, continue
      }

      // 5. Delete API keys if exists
      try {
        await tx.apiKey.deleteMany({
          where: { userId: userId }
        })
      } catch (e) {
        // Table might not exist, continue
      }

      // 6. Delete user preferences if exists
      try {
        await tx.userPreferences.deleteMany({
          where: { userId: userId }
        })
      } catch (e) {
        // Table might not exist, continue
      }

      // 7. Delete two factor backup codes if exists
      try {
        await tx.twoFactorBackupCode.deleteMany({
          where: { userId: userId }
        })
      } catch (e) {
        // Table might not exist, continue
      }

      // 8. Delete subscription
      await tx.subscription.deleteMany({
        where: { userId: userId }
      })

      // 9. Delete sessions
      await tx.session.deleteMany({
        where: { userId: userId }
      })

      // 10. Delete accounts (OAuth connections)
      await tx.account.deleteMany({
        where: { userId: userId }
      })

      // 11. Delete audit logs
      await tx.auditLog.deleteMany({
        where: { userId: userId }
      })

      // 12. Finally, delete the user
      const deletedUser = await tx.user.delete({
        where: { id: userId }
      })

      return deletedUser
    })

    // Delete user from Supabase Auth if using Supabase
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        )

        // Delete from Supabase Auth
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
          userId
        )

        if (authError) {
          console.error('Failed to delete user from Supabase Auth:', authError)
          // Continue anyway - user is already deleted from database
        } else {
          console.log('User deleted from Supabase Auth successfully')
        }
      } catch (error) {
        console.error('Error deleting from Supabase Auth:', error)
        // Continue anyway - user is already deleted from database
      }
    }

    // Create audit log for the deletion
    if (!isDemoMode()) {
      try {
        await prisma.auditLog.create({
          data: {
            userId: userId,
            action: 'USER_ACCOUNT_DELETED',
            metadata: {
              deletedEmail: targetUser.email,
              deletedName: targetUser.name,
              videosDeleted: targetUser._count.videos,
              transactionsDeleted: targetUser._count.transactions,
              deletedBy: 'admin'
            }
          }
        })
      } catch (error) {
        // Ignore audit log errors since user is already deleted
        console.error('Audit log error:', error)
      }
    }

    // Return 204 No Content on success
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user account' },
      { status: 500 }
    )
  }
}