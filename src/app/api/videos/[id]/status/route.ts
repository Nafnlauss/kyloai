import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get video
    const video = await prisma.video.findUnique({
      where: { 
        id: params.id,
        userId: session.user.id,
      },
      select: {
        id: true,
        status: true,
        url: true,
        thumbnailUrl: true,
        duration: true,
        aspectRatio: true,
        creditsUsed: true,
        errorMessage: true,
        processingStartedAt: true,
        processingEndedAt: true,
        createdAt: true,
      },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Calculate progress based on status
    let progress = 0
    if (video.status === 'COMPLETED') {
      progress = 100
    } else if (video.status === 'PROCESSING') {
      // Estimate progress based on time elapsed
      if (video.processingStartedAt) {
        const elapsed = Date.now() - video.processingStartedAt.getTime()
        const estimatedDuration = (video.duration || 5) * 1000 * 12 // Rough estimate
        progress = Math.min(Math.floor((elapsed / estimatedDuration) * 100), 90)
      } else {
        progress = 50
      }
    } else if (video.status === 'QUEUED') {
      progress = 10
    } else if (video.status === 'PENDING') {
      progress = 5
    }

    return NextResponse.json({
      id: video.id,
      status: video.status,
      progress,
      url: video.url,
      thumbnailUrl: video.thumbnailUrl,
      duration: video.duration,
      aspectRatio: video.aspectRatio,
      creditsUsed: video.creditsUsed,
      error: video.errorMessage,
      processingTime: video.processingStartedAt && video.processingEndedAt
        ? video.processingEndedAt.getTime() - video.processingStartedAt.getTime()
        : undefined,
      createdAt: video.createdAt,
    })

  } catch (error) {
    console.error('Video status error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 })
  }
}