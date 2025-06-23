import { Queue, Worker, Job, QueueEvents } from 'bullmq'
import Redis from 'ioredis'
import { prisma } from '@/lib/prisma'
import { getVideoProvider } from '@/lib/video-providers'
import { sendVideoCompletedEmail, sendVideoFailedEmail } from '@/lib/email/email-service'

// Lazy-loaded Redis connection
let connection: Redis | null = null
let videoQueue: Queue | null = null
let videoQueueEvents: QueueEvents | null = null

// Check if Redis should be initialized (not during build)
const shouldInitializeRedis = () => {
  // Skip Redis initialization during build
  if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL) {
    return false
  }
  // Skip if explicitly disabled
  if (process.env.SKIP_REDIS === 'true') {
    return false
  }
  return true
}

// Get or create Redis connection
function getRedisConnection(): Redis {
  if (!connection && shouldInitializeRedis()) {
    connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    })
  }
  
  if (!connection) {
    throw new Error('Redis connection not available')
  }
  
  return connection
}

// Get or create video queue
export function getVideoQueue(): Queue {
  if (!videoQueue && shouldInitializeRedis()) {
    videoQueue = new Queue('video-generation', {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: {
          age: 3600, // Keep completed jobs for 1 hour
          count: 100, // Keep max 100 completed jobs
        },
        removeOnFail: {
          age: 24 * 3600, // Keep failed jobs for 24 hours
        },
      },
    })
  }
  
  if (!videoQueue) {
    throw new Error('Video queue not available')
  }
  
  return videoQueue
}

// Get or create queue events
export function getVideoQueueEvents(): QueueEvents {
  if (!videoQueueEvents && shouldInitializeRedis()) {
    videoQueueEvents = new QueueEvents('video-generation', {
      connection: getRedisConnection().duplicate(),
    })
  }
  
  if (!videoQueueEvents) {
    throw new Error('Video queue events not available')
  }
  
  return videoQueueEvents
}

// Job data types
interface VideoGenerationJobData {
  videoId: string
  userId: string
  provider: 'LUMA_V1' | 'LUMA_V2' | 'KLING_V1' | 'KLING_V2'
  jobId: string
}

// Lazy-loaded worker
let videoWorker: Worker<VideoGenerationJobData> | null = null

// Get or create video worker
export function getVideoWorker(): Worker<VideoGenerationJobData> {
  if (!videoWorker && shouldInitializeRedis()) {
    videoWorker = new Worker<VideoGenerationJobData>(
      'video-generation',
      async (job: Job<VideoGenerationJobData>) => {
    const { videoId, userId, provider, jobId } = job.data
    
    try {
      // Update video status to processing
      await prisma.video.update({
        where: { id: videoId },
        data: { status: 'PROCESSING' },
      })
      
      // Get the provider instance
      const videoProvider = getVideoProvider(provider)
      
      // Poll for status with exponential backoff
      let attempts = 0
      const maxAttempts = 60 // Max 5 minutes of polling
      const baseDelay = 5000 // Start with 5 seconds
      
      while (attempts < maxAttempts) {
        attempts++
        
        try {
          const status = await videoProvider.checkStatus(jobId)
          
          // Update job progress
          const progress = status.progress || (attempts / maxAttempts) * 100
          await job.updateProgress(progress)
          
          // Emit real-time update via Socket.IO
          try {
            const { emitVideoStatusUpdate } = await import('@/lib/socket/socket-server')
            emitVideoStatusUpdate(userId, videoId, {
              videoId,
              status: 'PROCESSING',
              progress,
            })
          } catch (error) {
            console.error('Failed to emit socket update:', error)
          }
          
          if (status.state === 'COMPLETED' && status.url) {
            // Video generation completed successfully
            await prisma.video.update({
              where: { id: videoId },
              data: {
                status: 'COMPLETED',
                url: status.url,
                thumbnailUrl: status.thumbnailUrl,
                processingEndedAt: new Date(),
              },
            })
            
            // Send completion email
            const user = await prisma.user.findUnique({
              where: { id: userId },
              select: { email: true, name: true },
            })
            
            if (user) {
              await sendVideoCompletedEmail({
                email: user.email,
                name: user.name || 'User',
                videoUrl: status.url,
                thumbnailUrl: status.thumbnailUrl,
              })
            }
            
            // Emit completion status
            try {
              const { emitVideoStatusUpdate, emitNotification } = await import('@/lib/socket/socket-server')
              emitVideoStatusUpdate(userId, videoId, {
                videoId,
                status: 'COMPLETED',
                progress: 100,
                url: status.url,
                thumbnailUrl: status.thumbnailUrl,
              })
              
              emitNotification(userId, {
                id: `video-completed-${videoId}`,
                type: 'success',
                title: 'Vídeo pronto!',
                message: 'Seu vídeo foi gerado com sucesso.',
                timestamp: new Date(),
              })
            } catch (error) {
              console.error('Failed to emit socket update:', error)
            }
            
            return { success: true, url: status.url }
          }
          
          if (status.state === 'FAILED') {
            throw new Error(status.error || 'Video generation failed')
          }
          
          // Calculate next delay with exponential backoff
          const delay = Math.min(baseDelay * Math.pow(1.5, Math.floor(attempts / 10)), 30000)
          await new Promise(resolve => setTimeout(resolve, delay))
          
        } catch (error) {
          console.error(`Error checking status for job ${jobId}:`, error)
          
          // If it's a temporary error and we have attempts left, continue
          if (attempts < maxAttempts - 1) {
            await new Promise(resolve => setTimeout(resolve, baseDelay))
            continue
          }
          
          throw error
        }
      }
      
      // Timeout reached
      throw new Error('Video generation timeout')
      
    } catch (error) {
      console.error(`Video generation failed for ${videoId}:`, error)
      
      // Update video status to failed
      await prisma.video.update({
        where: { id: videoId },
        data: {
          status: 'FAILED',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          processingEndedAt: new Date(),
        },
      })
      
      // Send failure email
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, name: true },
      })
      
      if (user) {
        await sendVideoFailedEmail({
          email: user.email,
          name: user.name || 'User',
          reason: error instanceof Error ? error.message : 'Unknown error',
        })
      }
      
      throw error
    }
  },
  {
    connection: getRedisConnection(),
    concurrency: 5, // Process up to 5 videos simultaneously
    limiter: {
      max: 100,
      duration: 60000, // Max 100 jobs per minute
    },
  }
)

    // Worker event handlers
    videoWorker.on('completed', (job) => {
      console.log(`Job ${job.id} completed successfully`)
    })

    videoWorker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed:`, err)
    })

    videoWorker.on('active', (job) => {
      console.log(`Job ${job.id} is now active`)
    })

    videoWorker.on('stalled', (job) => {
      console.warn(`Job ${job} has stalled`)
    })
  }
  
  if (!videoWorker) {
    throw new Error('Video worker not available')
  }
  
  return videoWorker
}

// Add a job to the queue
export async function queueVideoGeneration(data: VideoGenerationJobData) {
  if (!shouldInitializeRedis()) {
    console.warn('Redis not available, skipping video queue')
    return null
  }
  
  const queue = getVideoQueue()
  const job = await queue.add('generate-video', data, {
    priority: data.provider.includes('V2') ? 1 : 2, // V2 providers get higher priority
  })
  
  return job
}

// Get job status
export async function getJobStatus(jobId: string) {
  if (!shouldInitializeRedis()) {
    return null
  }
  
  const queue = getVideoQueue()
  const job = await queue.getJob(jobId)
  
  if (!job) {
    return null
  }
  
  const state = await job.getState()
  const progress = job.progress
  
  return {
    id: job.id,
    state,
    progress,
    data: job.data,
    failedReason: job.failedReason,
    attemptsMade: job.attemptsMade,
  }
}

// Clean up old jobs
export async function cleanupOldJobs() {
  if (!shouldInitializeRedis()) {
    return
  }
  
  const queue = getVideoQueue()
  const completed = await queue.clean(1000, 1000, 'completed')
  const failed = await queue.clean(1000, 1000, 'failed')
  
  console.log(`Cleaned up ${completed.length} completed and ${failed.length} failed jobs`)
}

// Initialize worker (call this when starting the server in production)
export async function initializeWorker() {
  if (!shouldInitializeRedis()) {
    console.log('Redis not configured, skipping worker initialization')
    return false
  }
  
  try {
    getVideoWorker()
    console.log('Video worker initialized successfully')
    return true
  } catch (error) {
    console.error('Failed to initialize video worker:', error)
    return false
  }
}

// Graceful shutdown
export async function shutdownWorkers() {
  if (videoWorker) {
    await videoWorker.close()
  }
  if (videoQueue) {
    await videoQueue.close()
  }
  if (connection) {
    await connection.quit()
  }
}