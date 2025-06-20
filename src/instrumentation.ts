export async function register() {
  // Only run on server-side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only initialize worker in production with Redis configured
    if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
      console.log('Initializing video processing worker...')
      
      try {
        const { initializeWorker } = await import('@/lib/queue/video-queue')
        await initializeWorker()
      } catch (error) {
        console.error('Failed to initialize video worker:', error)
      }
    }
  }
}