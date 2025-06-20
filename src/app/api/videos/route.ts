import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const provider = searchParams.get('provider')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build where clause
    const where: any = {
      userId: session.user.id,
    }

    if (search) {
      where.OR = [
        { prompt: { contains: search, mode: 'insensitive' } },
        { enhancedPrompt: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status && status !== 'all') {
      where.status = status
    }

    if (provider && provider !== 'all') {
      where.provider = provider
    }

    // Get total count
    const total = await prisma.video.count({ where })

    // Get videos with pagination
    const videos = await prisma.video.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        prompt: true,
        enhancedPrompt: true,
        provider: true,
        status: true,
        url: true,
        thumbnailUrl: true,
        duration: true,
        aspectRatio: true,
        creditsUsed: true,
        errorMessage: true,
        createdAt: true,
        processingStartedAt: true,
        processingEndedAt: true,
      },
    })

    // Calculate processing time for completed videos
    const videosWithMetadata = videos.map(video => ({
      ...video,
      processingTime: video.processingStartedAt && video.processingEndedAt
        ? video.processingEndedAt.getTime() - video.processingStartedAt.getTime()
        : undefined,
    }))

    return NextResponse.json(videosWithMetadata, {
      headers: {
        'X-Total-Count': total.toString(),
        'X-Page': page.toString(),
        'X-Limit': limit.toString(),
      },
    })

  } catch (error) {
    console.error('Videos fetch error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 })
  }
}