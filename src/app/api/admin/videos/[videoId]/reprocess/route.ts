import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { queueVideoGeneration } from '@/lib/queue/video-queue'

// Reprocess failed video
export async function POST(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId } = params

    // Get video details
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        user: true,
      },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    if (video.status !== 'FAILED') {
      return NextResponse.json(
        { error: 'Only failed videos can be reprocessed' },
        { status: 400 }
      )
    }

    // Check if user has enough credits
    if (video.user.credits < video.creditsUsed) {
      return NextResponse.json(
        { error: 'User does not have enough credits for reprocessing' },
        { status: 400 }
      )
    }

    // Update video status
    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: 'QUEUED',
        errorMessage: null,
        retryCount: { increment: 1 },
        processingStartedAt: null,
        processingEndedAt: null,
      },
    })

    // Queue for reprocessing
    await queueVideoGeneration({
      videoId: video.id,
      userId: video.userId,
      provider: video.provider as any,
      jobId: video.providerJobId!,
    })

    // Log admin action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'ADMIN_REPROCESS_VIDEO',
        resource: 'video',
        resourceId: videoId,
        metadata: JSON.stringify({
          videoOwnerId: video.userId,
          provider: video.provider,
        }),
      },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Video queued for reprocessing'
    })
  } catch (error) {
    console.error('Error reprocessing video:', error)
    return NextResponse.json(
      { error: 'Failed to reprocess video' },
      { status: 500 }
    )
  }
}