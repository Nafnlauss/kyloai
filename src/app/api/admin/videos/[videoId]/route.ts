import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Delete video
export async function DELETE(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId } = params

    // Check if video exists
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { id: true, userId: true },
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Delete the video
    await prisma.video.delete({
      where: { id: videoId },
    })

    // Log admin action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'ADMIN_DELETE_VIDEO',
        resource: 'video',
        resourceId: videoId,
        metadata: JSON.stringify({
          videoOwnerId: video.userId,
        }),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    )
  }
}

// Reprocess video
export async function PATCH(
  request: Request,
  { params }: { params: { videoId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { videoId } = params
    const body = await request.json()

    const schema = z.object({
      action: z.enum(['reprocess', 'update_status']),
      status: z.enum(['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED']).optional(),
      errorMessage: z.string().optional()
    })

    const { action, status, errorMessage } = schema.parse(body)

    // Check if video exists
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: { user: true }
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    if (action === 'reprocess') {
      // Only allow reprocessing failed videos
      if (video.status !== 'FAILED') {
        return NextResponse.json(
          { error: 'Only failed videos can be reprocessed' },
          { status: 400 }
        )
      }

      // Update video status to queued
      await prisma.video.update({
        where: { id: videoId },
        data: {
          status: 'QUEUED',
          errorMessage: null,
          processingStartedAt: null,
          processingEndedAt: null
        }
      })

      // TODO: Add video back to processing queue

      // Log admin action
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'ADMIN_REPROCESS_VIDEO',
          resource: 'video',
          resourceId: videoId,
          metadata: JSON.stringify({
            videoOwnerId: video.userId,
            provider: video.provider
          }),
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Video queued for reprocessing'
      })
    }

    if (action === 'update_status' && status) {
      // Update video status
      await prisma.video.update({
        where: { id: videoId },
        data: {
          status,
          errorMessage: errorMessage || null
        }
      })

      // Log admin action
      await prisma.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'ADMIN_UPDATE_VIDEO_STATUS',
          resource: 'video', 
          resourceId: videoId,
          metadata: JSON.stringify({
            oldStatus: video.status,
            newStatus: status,
            errorMessage
          }),
        },
      })

      return NextResponse.json({
        success: true,
        message: 'Video status updated'
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    )
  }
}