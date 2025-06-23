import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { createAuditLog } from '@/lib/audit'

const revokeSessionSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
})

const revokeAllSessionsSchema = z.object({
  keepCurrent: z.boolean().default(true),
})

// Get all active sessions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all sessions for the user
    const sessions = await prisma.session.findMany({
      where: { 
        userId: session.user.id,
        expires: {
          gt: new Date(), // Only active sessions
        }
      },
      select: {
        id: true,
        expires: true,
        ipAddress: true,
        userAgent: true,
        sessionToken: true,
      },
      orderBy: {
        expires: 'desc',
      }
    })

    // Get current session token from cookies
    const sessionToken = request.cookies.get('next-auth.session-token')?.value || 
                        request.cookies.get('__Secure-next-auth.session-token')?.value

    // Mark current session
    const sessionsWithCurrent = sessions.map(s => ({
      id: s.id,
      expires: s.expires,
      ipAddress: s.ipAddress,
      userAgent: s.userAgent,
      isCurrent: s.sessionToken === sessionToken,
      // Parse user agent for better display
      device: parseUserAgent(s.userAgent),
    }))

    return NextResponse.json({ 
      sessions: sessionsWithCurrent 
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

// Revoke a specific session
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = revokeSessionSchema.parse(body)

    // Verify the session belongs to the user
    const sessionToRevoke = await prisma.session.findFirst({
      where: {
        id: validatedData.sessionId,
        userId: session.user.id,
      }
    })

    if (!sessionToRevoke) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Get IP and User Agent for audit log
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    // Delete the session
    await prisma.session.delete({
      where: { id: validatedData.sessionId }
    })

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'SESSION_REVOKED',
      resource: 'user_session',
      resourceId: validatedData.sessionId,
      metadata: { 
        revokedSessionIp: sessionToRevoke.ipAddress,
        revokedSessionUserAgent: sessionToRevoke.userAgent,
      },
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
    })

    return NextResponse.json({ 
      message: 'Session revoked successfully' 
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error revoking session:', error)
    return NextResponse.json(
      { error: 'Failed to revoke session' },
      { status: 500 }
    )
  }
}

// Revoke all sessions
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = revokeAllSessionsSchema.parse(body)

    // Get current session token from cookies
    const sessionToken = request.cookies.get('next-auth.session-token')?.value || 
                        request.cookies.get('__Secure-next-auth.session-token')?.value

    // Get IP and User Agent for audit log
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined
    const userAgent = request.headers.get('user-agent') || undefined

    let deletedCount = 0

    if (validatedData.keepCurrent && sessionToken) {
      // Delete all sessions except current
      const result = await prisma.session.deleteMany({
        where: {
          userId: session.user.id,
          sessionToken: {
            not: sessionToken,
          }
        }
      })
      deletedCount = result.count
    } else {
      // Delete all sessions
      const result = await prisma.session.deleteMany({
        where: {
          userId: session.user.id,
        }
      })
      deletedCount = result.count
    }

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'ALL_SESSIONS_REVOKED',
      resource: 'user_session',
      resourceId: session.user.id,
      metadata: { 
        sessionsRevoked: deletedCount,
        keepCurrent: validatedData.keepCurrent,
      },
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
    })

    return NextResponse.json({ 
      message: `${deletedCount} session(s) revoked successfully`,
      sessionsRevoked: deletedCount,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error revoking all sessions:', error)
    return NextResponse.json(
      { error: 'Failed to revoke sessions' },
      { status: 500 }
    )
  }
}

// Helper function to parse user agent
function parseUserAgent(userAgent: string | null): { browser: string; os: string; device: string } {
  if (!userAgent) {
    return { browser: 'Unknown', os: 'Unknown', device: 'Unknown' }
  }

  let browser = 'Unknown'
  let os = 'Unknown'
  let device = 'Desktop'

  // Detect browser
  if (userAgent.includes('Chrome')) browser = 'Chrome'
  else if (userAgent.includes('Firefox')) browser = 'Firefox'
  else if (userAgent.includes('Safari')) browser = 'Safari'
  else if (userAgent.includes('Edge')) browser = 'Edge'
  else if (userAgent.includes('Opera')) browser = 'Opera'

  // Detect OS
  if (userAgent.includes('Windows')) os = 'Windows'
  else if (userAgent.includes('Mac')) os = 'macOS'
  else if (userAgent.includes('Linux')) os = 'Linux'
  else if (userAgent.includes('Android')) os = 'Android'
  else if (userAgent.includes('iOS') || userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS'

  // Detect device type
  if (userAgent.includes('Mobile')) device = 'Mobile'
  else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) device = 'Tablet'

  return { browser, os, device }
}