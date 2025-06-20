import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { getVideoProvider } from '@/lib/video-providers'

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
        userId: session.user.id, // Ensure user owns the video
      },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // If video is already completed or failed, return current status
    if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(video.status)) {
      return NextResponse.json({
        id: video.id,
        status: video.status,
        url: video.url,
        thumbnailUrl: video.thumbnailUrl,
        error: video.errorMessage,
        duration: video.duration,
        createdAt: video.createdAt,
        completedAt: video.processingEndedAt,
      })
    }

    // Check status with provider
    if (video.providerJobId && video.provider) {
      try {
        const provider = getVideoProvider(video.provider as 'LUMA' | 'KLING')
        const status = await provider.checkStatus(video.providerJobId)

        // Update video record if status changed
        const updates: any = {
          status: status.state,
        }

        if (status.state === 'COMPLETED' && status.url) {
          updates.url = status.url
          updates.thumbnailUrl = status.thumbnailUrl
          updates.processingEndedAt = new Date()
          updates.status = 'COMPLETED'
        } else if (status.state === 'FAILED') {
          updates.status = 'FAILED'
          updates.errorMessage = status.error || 'Generation failed'
          updates.processingEndedAt = new Date()
        }

        const updatedVideo = await prisma.video.update({
          where: { id: video.id },
          data: updates,
        })

        // Audit log for completion
        if (status.state === 'COMPLETED') {
          await prisma.auditLog.create({
            data: {
              userId: session.user.id,
              action: 'VIDEO_COMPLETED',
              resource: 'VIDEO',
              resourceId: video.id,
              metadata: {
                provider: video.provider,
                duration: video.duration,
                creditsUsed: video.creditsUsed,
              },
            },
          })
        }

        return NextResponse.json({
          id: updatedVideo.id,
          status: updatedVideo.status,
          progress: status.progress,
          url: updatedVideo.url,
          thumbnailUrl: updatedVideo.thumbnailUrl,
          error: updatedVideo.errorMessage,
          duration: updatedVideo.duration,
          createdAt: updatedVideo.createdAt,
          completedAt: updatedVideo.processingEndedAt,
        })

      } catch (error) {
        console.error('Provider status check failed:', error)
        // Return last known status if provider check fails
        return NextResponse.json({
          id: video.id,
          status: video.status,
          error: 'Unable to check status',
        })
      }
    }

    // Return current status
    return NextResponse.json({
      id: video.id,
      status: video.status,
      createdAt: video.createdAt,
    })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
    }, { status: 500 })
  }
}