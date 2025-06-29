import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { redirect } from 'next/navigation'
import { authOptions } from './auth-options'
import { prisma } from '@/lib/prisma'

// DEMO MODE: Temporarily allow admin access without login
const DEMO_MODE = process.env.ADMIN_DEMO_MODE === 'true'

export type AdminRole = 'ADMIN' | 'MODERATOR'

export async function withAdminGuard() {
  // DEMO MODE: Skip authentication in demo mode
  if (DEMO_MODE) {
    return {
      user: {
        id: 'demo-admin',
        email: 'demo@admin.com',
        name: 'Demo Admin',
        role: 'ADMIN',
        image: null
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }
  }
  
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }
  
  // Allow both ADMIN and MODERATOR roles
  if (!['ADMIN', 'MODERATOR'].includes(session.user.role)) {
    redirect('/dashboard')
  }
  
  return session
}

export async function isAdmin() {
  // DEMO MODE: Always return true in demo mode
  if (DEMO_MODE) {
    return true
  }
  
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'ADMIN'
}

export async function isAdminOrModerator() {
  // DEMO MODE: Always return true in demo mode
  if (DEMO_MODE) {
    return true
  }
  
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'ADMIN' || session?.user?.role === 'MODERATOR'
}

// For API Routes protection
export async function adminGuardAPI(
  req: NextRequest,
  allowedRoles: AdminRole[] = ['ADMIN', 'MODERATOR']
): Promise<{ authorized: boolean; response?: NextResponse }> {
  try {
    // DEMO MODE: Skip authentication in demo mode
    if (DEMO_MODE) {
      return { authorized: true }
    }

    // Get session
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return {
        authorized: false,
        response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Get user role from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    })

    if (!user || !allowedRoles.includes(user.role as AdminRole)) {
      return {
        authorized: false,
        response: NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    return { authorized: true }
  } catch (error) {
    console.error('Admin guard error:', error)
    return {
      authorized: false,
      response: NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

// Helper function to wrap API routes with admin guard
export function withAdminAPI(
  handler: (req: NextRequest, context?: any) => Promise<NextResponse>,
  allowedRoles: AdminRole[] = ['ADMIN', 'MODERATOR']
) {
  return async (req: NextRequest, context?: any) => {
    const guardResult = await adminGuardAPI(req, allowedRoles)
    
    if (!guardResult.authorized) {
      return guardResult.response!
    }

    return handler(req, context)
  }
}