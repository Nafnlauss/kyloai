import { VideoProvider, VideoGenerationOptions, GenerationJob, GenerationStatus } from './types'
import crypto from 'crypto'

export class KlingProvider implements VideoProvider {
  private accessKey: string
  private secretKey: string
  private version: 'v1' | 'v2'
  private baseUrl = 'https://api-singapore.klingai.com/v1'

  constructor(accessKey: string, secretKey: string, version: 'v1' | 'v2' = 'v1') {
    this.accessKey = accessKey
    this.secretKey = secretKey
    this.version = version
  }

  async generate(prompt: string, options: VideoGenerationOptions): Promise<GenerationJob> {
    const endpoint = '/videos/text2video'
    const timestamp = Date.now()
    const nonce = crypto.randomBytes(16).toString('hex')
    
    // Generate signature for authentication
    const signature = this.generateSignature(endpoint, timestamp, nonce)

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': this.accessKey,
        'X-Timestamp': timestamp.toString(),
        'X-Nonce': nonce,
        'X-Signature': signature,
      },
      body: JSON.stringify({
        prompt: options.enhancePrompt ? await this.enhancePrompt(prompt) : prompt,
        model_version: this.version === 'v1' ? 'v1' : 'v2.1',
        mode: this.version === 'v1' ? 'std' : 'pro', // V1 uses standard, V2 uses pro mode
        aspect_ratio: this.mapAspectRatio(options.aspectRatio),
        duration: options.duration || 5,
        cfg_scale: this.version === 'v1' ? 7 : 9, // Higher cfg_scale for V2
        negative_prompt: options.negativePrompt || '',
        // V2 specific quality enhancements
        ...(this.version === 'v2' && {
          num_inference_steps: 50, // More steps for better quality
          use_refiner: true, // Enable refiner model for V2
        }),
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Kling generation failed: ${error.message || response.statusText}`)
    }

    const data = await response.json()
    
    return {
      id: data.task_id,
      provider: this.version === 'v1' ? 'KLING_V1' : 'KLING_V2',
      status: 'PENDING',
      prompt: prompt,
      createdAt: new Date(),
    }
  }

  async checkStatus(jobId: string): Promise<GenerationStatus> {
    const endpoint = `/videos/status/${jobId}`
    const timestamp = Date.now()
    const nonce = crypto.randomBytes(16).toString('hex')
    const signature = this.generateSignature(endpoint, timestamp, nonce)

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'X-Access-Key': this.accessKey,
        'X-Timestamp': timestamp.toString(),
        'X-Nonce': nonce,
        'X-Signature': signature,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to check status: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      state: this.mapStatus(data.status),
      progress: data.progress || 0,
      url: data.video_url,
      thumbnailUrl: data.cover_url,
      error: data.error_message,
    }
  }

  async cancel(jobId: string): Promise<void> {
    const endpoint = `/videos/cancel/${jobId}`
    const timestamp = Date.now()
    const nonce = crypto.randomBytes(16).toString('hex')
    const signature = this.generateSignature(endpoint, timestamp, nonce)

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'X-Access-Key': this.accessKey,
        'X-Timestamp': timestamp.toString(),
        'X-Nonce': nonce,
        'X-Signature': signature,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to cancel: ${response.statusText}`)
    }
  }

  private generateSignature(endpoint: string, timestamp: number, nonce: string): string {
    const message = `${endpoint}${timestamp}${nonce}`
    const hmac = crypto.createHmac('sha256', this.secretKey)
    hmac.update(message)
    return hmac.digest('hex')
  }

  private async enhancePrompt(prompt: string): Promise<string> {
    // Kling specific prompt optimization
    const maxLength = 2500
    
    if (prompt.length > maxLength) {
      prompt = prompt.substring(0, maxLength)
    }
    
    // Add quality modifiers if not present
    if (!prompt.toLowerCase().includes('quality')) {
      prompt += ', high quality, professional'
    }
    
    return prompt
  }

  private mapAspectRatio(ratio?: string): string {
    const ratioMap: Record<string, string> = {
      '16:9': '16:9',
      '9:16': '9:16',
      '1:1': '1:1',
    }
    
    return ratioMap[ratio || '16:9'] || '16:9'
  }

  private mapStatus(klingStatus: string): string {
    const statusMap: Record<string, string> = {
      'waiting': 'PENDING',
      'pending': 'PENDING',
      'processing': 'PROCESSING',
      'completed': 'COMPLETED',
      'failed': 'FAILED',
      'cancelled': 'CANCELLED',
    }
    
    return statusMap[klingStatus.toLowerCase()] || 'PENDING'
  }

  // Kling specific features
  async getResourcePackage(): Promise<{ credits: number; expires: Date }> {
    const endpoint = '/user/resource-package'
    const timestamp = Date.now()
    const nonce = crypto.randomBytes(16).toString('hex')
    const signature = this.generateSignature(endpoint, timestamp, nonce)

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'X-Access-Key': this.accessKey,
        'X-Timestamp': timestamp.toString(),
        'X-Nonce': nonce,
        'X-Signature': signature,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get resource package')
    }

    const data = await response.json()
    return {
      credits: data.remaining_credits || 0,
      expires: new Date(data.expires_at),
    }
  }

  // Advanced Kling features
  async generateWithImage(imageUrl: string, prompt: string, options: VideoGenerationOptions): Promise<GenerationJob> {
    const endpoint = '/videos/image2video'
    const timestamp = Date.now()
    const nonce = crypto.randomBytes(16).toString('hex')
    const signature = this.generateSignature(endpoint, timestamp, nonce)

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': this.accessKey,
        'X-Timestamp': timestamp.toString(),
        'X-Nonce': nonce,
        'X-Signature': signature,
      },
      body: JSON.stringify({
        image_url: imageUrl,
        prompt: prompt,
        model_version: options.modelVersion || 'v2.1',
        mode: options.mode || 'std',
        duration: options.duration || 5,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Kling image2video failed: ${error.message || response.statusText}`)
    }

    const data = await response.json()
    
    return {
      id: data.task_id,
      provider: this.version === 'v1' ? 'KLING_V1' : 'KLING_V2',
      status: 'PENDING',
      prompt: prompt,
      createdAt: new Date(),
    }
  }
}