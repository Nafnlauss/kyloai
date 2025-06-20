import { VideoProvider, VideoGenerationOptions, GenerationJob, GenerationStatus } from './types'

export class LumaProvider implements VideoProvider {
  private apiKey: string
  private baseUrl = 'https://api.lumalabs.ai/dream-machine/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generate(prompt: string, options: VideoGenerationOptions): Promise<GenerationJob> {
    const response = await fetch(`${this.baseUrl}/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: options.enhancePrompt ? await this.enhancePrompt(prompt) : prompt,
        aspect_ratio: options.aspectRatio || '16:9',
        loop: false,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Luma generation failed: ${error.message || response.statusText}`)
    }

    const data = await response.json()
    
    return {
      id: data.id,
      provider: 'LUMA',
      status: this.mapStatus(data.state),
      prompt: data.request.prompt,
      createdAt: new Date(data.created_at),
    }
  }

  async checkStatus(jobId: string): Promise<GenerationStatus> {
    const response = await fetch(`${this.baseUrl}/generations/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to check status: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      state: this.mapStatus(data.state),
      progress: data.state === 'processing' ? 50 : 100,
      url: data.video?.url,
      thumbnailUrl: data.video?.thumbnail_url,
      error: data.failure_reason,
    }
  }

  async cancel(jobId: string): Promise<void> {
    // Luma doesn't support cancellation in their public API
    throw new Error('Cancellation not supported by Luma')
  }

  private async enhancePrompt(prompt: string): Promise<string> {
    // Simple prompt enhancement - in production, use AI
    const enhancers = [
      'cinematic',
      'high quality',
      'detailed',
      'professional',
      '4K',
    ]
    
    const randomEnhancer = enhancers[Math.floor(Math.random() * enhancers.length)]
    return `${prompt}, ${randomEnhancer}`
  }

  private mapStatus(lumaState: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'PENDING',
      'processing': 'PROCESSING',
      'completed': 'COMPLETED',
      'failed': 'FAILED',
    }
    
    return statusMap[lumaState] || 'PENDING'
  }

  // Luma specific features
  async getCreditsRemaining(): Promise<number> {
    const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/user', {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get credits')
    }

    const data = await response.json()
    return data.credits_remaining || 0
  }
}