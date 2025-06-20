# QueueAgent - Job Queue Specialist
**Library:** bullmq@5.25.6
**Backend:** Redis
**Patterns:** Priority queues, retry logic

## Queue Setup
```typescript
import { Queue, Worker, Job } from 'bullmq'
import Redis from 'ioredis'

const connection = new Redis(process.env.REDIS_URL!)

// Video generation queue
export const videoQueue = new Queue('video-generation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 24 * 3600, // 24 hours
      count: 100,
    },
    removeOnFail: {
      age: 7 * 24 * 3600, // 7 days
    },
  },
})

// Priority based on subscription
export async function addVideoJob(data: VideoJobData, userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: { include: { plan: true } } },
  })
  
  const priority = user?.subscription?.plan.priorityQueue ? 1 : 10
  
  return videoQueue.add('generate', data, {
    priority,
    delay: 0,
  })
}
```

## Worker Processing
```typescript
const videoWorker = new Worker(
  'video-generation',
  async (job: Job<VideoJobData>) => {
    const { videoId, provider, prompt, options } = job.data
    
    try {
      // Update status
      await updateVideoStatus(videoId, 'PROCESSING')
      
      // Generate video
      const providerInstance = getProvider(provider)
      const result = await providerInstance.generate(prompt, options)
      
      // Poll for completion
      let status = await providerInstance.checkStatus(result.id)
      while (status.state === 'processing') {
        await job.updateProgress(status.progress)
        await sleep(5000)
        status = await providerInstance.checkStatus(result.id)
      }
      
      if (status.state === 'completed') {
        await processCompletedVideo(videoId, status.url)
      } else {
        throw new Error(status.error || 'Generation failed')
      }
    } catch (error) {
      await updateVideoStatus(videoId, 'FAILED', error.message)
      throw error
    }
  },
  { connection, concurrency: 5 }
)
```

## Queue Features
- Priority processing for premium users
- Automatic retries with exponential backoff
- Dead letter queue for failed jobs
- Progress tracking
- Job persistence