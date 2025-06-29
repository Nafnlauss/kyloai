import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { isDemoMode } from '@/lib/auth/demo-mode'

export async function GET(req: NextRequest) {
  try {
    // Check authentication and admin role
    if (!isDemoMode()) {
      const session = await getServerSession()
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
      })

      if (user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || ''
    const provider = searchParams.get('provider') || ''

    const offset = (page - 1) * limit

    // Build where clause
    const where = {
      ...(status && { status }),
      ...(provider && { provider })
    }

    // Get videos and total count
    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: {
          user: {
            select: {
              email: true,
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.video.count({ where })
    ])

    return NextResponse.json({
      videos: videos.map(video => ({
        id: video.id,
        prompt: video.prompt,
        provider: video.provider,
        status: video.status,
        url: video.url,
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        creditsUsed: video.creditsUsed,
        createdAt: video.createdAt,
        user: {
          email: video.user.email,
          name: video.user.name
        }
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Admin videos error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}
