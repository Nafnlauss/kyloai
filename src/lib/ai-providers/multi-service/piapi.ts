import { 
  MultiServiceProvider, 
  MultiServiceCapabilities,
  ImageGenerationOptions,
  ImageGenerationResult,
  AIProviderError 
} from '../types'

export class PiAPIProvider implements MultiServiceProvider {
  name = 'PiAPI'
  version = '1.0'
  apiKey: string
  capabilities: MultiServiceCapabilities = {
    video: true,
    image: true,
    audio: true,
    text: false
  }
  private baseUrl = 'https://api.piapi.ai'

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new AIProviderError('PiAPI API key is required', 'PiAPI')
    }
    this.apiKey = apiKey
  }

  // Midjourney image generation through PiAPI
  async generateMidjourneyImage(prompt: string, options?: any): Promise<ImageGenerationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/mj/v2/imagine`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          prompt,
          process_mode: options?.processMode || 'fast',
          aspect_ratio: options?.aspectRatio || '1:1',
          model: options?.model || 'v6',
          ...options
        })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new AIProviderError(
          error.message || `PiAPI error: ${response.status}`,
          'PiAPI',
          response.status,
          error
        )
      }

      const data = await response.json()
      
      // Poll for result
      const result = await this.pollForResult(data.task_id, 'midjourney')

      return {
        id: data.task_id,
        url: result.task_result.image_url,
        width: result.task_result.width || 1024,
        height: result.task_result.height || 1024,
        createdAt: new Date(),
        metadata: {
          model: options?.model || 'v6',
          taskId: data.task_id
        }
      }
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to generate Midjourney image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PiAPI'
      )
    }
  }

  // Flux image generation through PiAPI
  async generateFluxImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/flux/v1/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          model: options?.model || 'flux-schnell',
          prompt,
          width: options?.width || 1024,
          height: options?.height || 1024,
          steps: options?.steps || 4,
          guidance_scale: options?.guidance || 3.5,
          seed: options?.seed
        })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new AIProviderError(
          error.message || `PiAPI Flux error: ${response.status}`,
          'PiAPI',
          response.status,
          error
        )
      }

      const data = await response.json()

      return {
        id: `flux_${Date.now()}`,
        url: data.data[0].url,
        width: options?.width || 1024,
        height: options?.height || 1024,
        createdAt: new Date(),
        metadata: {
          model: options?.model || 'flux-schnell'
        }
      }
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to generate Flux image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PiAPI'
      )
    }
  }

  // Suno music generation through PiAPI
  async generateMusic(prompt: string, options?: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/suno/v1/music`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          prompt,
          make_instrumental: options?.instrumental || false,
          model: options?.model || 'chirp-v3-5',
          ...options
        })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new AIProviderError(
          error.message || `PiAPI Suno error: ${response.status}`,
          'PiAPI',
          response.status,
          error
        )
      }

      const data = await response.json()
      
      // Poll for result
      const result = await this.pollForResult(data.task_id, 'suno')

      return {
        id: data.task_id,
        urls: result.task_result.audio_urls,
        createdAt: new Date(),
        metadata: {
          model: options?.model || 'chirp-v3-5',
          duration: result.task_result.duration
        }
      }
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to generate music: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PiAPI'
      )
    }
  }

  // Kling video generation through PiAPI
  async generateKlingVideo(prompt: string, options?: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/kling/v1/video/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey
        },
        body: JSON.stringify({
          prompt,
          aspect_ratio: options?.aspectRatio || '16:9',
          duration: options?.duration || 5,
          model: options?.model || 'v1.5',
          ...options
        })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new AIProviderError(
          error.message || `PiAPI Kling error: ${response.status}`,
          'PiAPI',
          response.status,
          error
        )
      }

      const data = await response.json()
      
      // Poll for result
      const result = await this.pollForResult(data.task_id, 'kling')

      return {
        id: data.task_id,
        url: result.task_result.video_url,
        createdAt: new Date(),
        metadata: {
          model: options?.model || 'v1.5',
          duration: options?.duration || 5
        }
      }
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to generate Kling video: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PiAPI'
      )
    }
  }

  private async pollForResult(taskId: string, service: string, maxAttempts = 120): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`${this.baseUrl}/common/v1/task/status?task_id=${taskId}`, {
        headers: {
          'X-API-Key': this.apiKey
        }
      })

      if (!response.ok) {
        throw new AIProviderError(
          `Failed to get task status: ${response.status}`,
          'PiAPI',
          response.status
        )
      }

      const data = await response.json()

      if (data.task_status === 'succeed') {
        return data
      } else if (data.task_status === 'failed') {
        throw new AIProviderError(
          `${service} generation failed: ${data.task_status_msg}`,
          'PiAPI',
          500,
          data
        )
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    throw new AIProviderError(`${service} generation timed out`, 'PiAPI')
  }

  // Get remaining credits
  async getCredits(): Promise<{ credits: number; used: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/common/v1/user/info`, {
        headers: {
          'X-API-Key': this.apiKey
        }
      })

      if (!response.ok) {
        throw new AIProviderError(
          `Failed to get user info: ${response.status}`,
          'PiAPI',
          response.status
        )
      }

      const data = await response.json()
      
      return {
        credits: data.credit_balance,
        used: data.credit_used
      }
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to get credits: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PiAPI'
      )
    }
  }
}

// Available services and models
export const PIAPI_SERVICES = {
  MIDJOURNEY: {
    models: ['v6', 'v5.2', 'v5.1', 'v5', 'v4'],
    aspectRatios: ['1:1', '4:3', '3:4', '16:9', '9:16']
  },
  FLUX: {
    models: ['flux-schnell', 'flux-dev', 'flux-pro']
  },
  SUNO: {
    models: ['chirp-v3-5', 'chirp-v3']
  },
  KLING: {
    models: ['v2.0', 'v1.5', 'v1.0'],
    durations: [5, 10]
  },
  LUMA: {
    models: ['dream-machine-v1']
  }
}

// Factory function
export function createPiAPIProvider(): PiAPIProvider {
  const apiKey = process.env.PIAPI_API_KEY
  if (!apiKey) {
    throw new AIProviderError('PIAPI_API_KEY environment variable is not set', 'PiAPI')
  }
  return new PiAPIProvider(apiKey)
}