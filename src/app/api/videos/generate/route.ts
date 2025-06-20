import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { authOptions } from '@/lib/auth/auth-options'
import { prisma } from '@/lib/prisma'
import { getVideoProvider } from '@/lib/video-providers'
import { z } from 'zod'

const generateVideoSchema = z.object({
  prompt: z.string().min(10).max(2500),
  provider: z.enum(['LUMA_V1', 'LUMA_V2', 'KLING_V1', 'KLING_V2']),
  aspectRatio: z.enum(['16:9', '9:16', '1:1']).default('16:9'),
  duration: z.number().min(1).max(30).default(5),
  enhancePrompt: z.boolean().default(true),
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request
    const body = await request.json()
    const validatedData = generateVideoSchema.parse(body)

    // Check user credits
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true, subscription: { include: { plan: true } } },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Import credit costs from config
    const { calculateCredits } = await import('@/lib/video-providers/api-config')
    const creditCost = calculateCredits(validatedData.provider, validatedData.duration)

    if (user.credits < creditCost) {
      return NextResponse.json({ 
        error: 'Insufficient credits',
        required: creditCost,
        available: user.credits,
      }, { status: 402 })
    }

    // Create video record
    const video = await prisma.video.create({
      data: {
        userId: session.user.id,
        prompt: validatedData.prompt,
        provider: validatedData.provider,
        status: 'PENDING',
        aspectRatio: validatedData.aspectRatio,
        duration: validatedData.duration,
        creditsUsed: creditCost,
        metadata: JSON.stringify({
          enhancePrompt: validatedData.enhancePrompt,
          requestedAt: new Date().toISOString(),
        }),
      },
    })

    // Deduct credits
    await prisma.user.update({
      where: { id: session.user.id },
      data: { credits: { decrement: creditCost } },
    })

    // Log the transaction
    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount: -creditCost * 100, // Store as cents
        credits: -creditCost,
        currency: 'USD',
        type: 'ONE_TIME_PURCHASE',
        status: 'COMPLETED',
        gateway: 'MANUAL',
        description: `Video generation - ${validatedData.provider}`,
      },
    })

    // Generate video with provider
    try {
      const provider = getVideoProvider(validatedData.provider)
      const job = await provider.generate(validatedData.prompt, {
        aspectRatio: validatedData.aspectRatio,
        duration: validatedData.duration,
        enhancePrompt: validatedData.enhancePrompt,
      })

      // Update video with provider job ID
      await prisma.video.update({
        where: { id: video.id },
        data: {
          providerJobId: job.id,
          status: 'QUEUED',
          processingStartedAt: new Date(),
          enhancedPrompt: job.prompt, // If prompt was enhanced
        },
      })

      // Queue background job to poll status
      const { queueVideoGeneration } = await import('@/lib/queue/video-queue')
      await queueVideoGeneration({
        videoId: video.id,
        userId: session.user.id,
        provider: validatedData.provider,
        jobId: job.id,
      })

      return NextResponse.json({
        videoId: video.id,
        jobId: job.id,
        status: 'QUEUED',
        estimatedTime: validatedData.duration * 60, // Rough estimate in seconds
        creditsUsed: creditCost,
        creditsRemaining: user.credits - creditCost,
      })

    } catch (error) {
      // Refund credits on generation failure
      await prisma.user.update({
        where: { id: session.user.id },
        data: { credits: { increment: creditCost } },
      })

      await prisma.video.update({
        where: { id: video.id },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Generation failed',
        },
      })

      throw error
    }

  } catch (error) {
    console.error('Video generation error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request',
        details: error.errors,
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error',
    }, { status: 500 })
  }
}