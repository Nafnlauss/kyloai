import { VideoProvider, VideoGenerationOptions, GenerationJob, GenerationStatus } from './types'
import crypto from 'crypto'

// Tipo de API a ser usada
export type KlingAPIType = 'official' | 'piapi' | 'unofficial'

export class KlingProviderV2 implements VideoProvider {
  private apiType: KlingAPIType
  private apiKey: string
  private accessKey?: string
  private secretKey?: string
  private version: 'v1' | 'v2'
  private baseUrl: string

  constructor(
    apiType: KlingAPIType = 'piapi',
    credentials: {
      apiKey?: string
      accessKey?: string
      secretKey?: string
    },
    version: 'v1' | 'v2' = 'v1'
  ) {
    this.apiType = apiType
    this.version = version

    // Configurar baseURL e credenciais baseado no tipo de API
    switch (apiType) {
      case 'official':
        if (!credentials.accessKey || !credentials.secretKey) {
          throw new Error('Official Kling API requires accessKey and secretKey')
        }
        this.accessKey = credentials.accessKey
        this.secretKey = credentials.secretKey
        this.apiKey = '' // Não usado na API oficial
        this.baseUrl = 'https://api.klingai.com/v1'
        break
      
      case 'piapi':
        if (!credentials.apiKey) {
          throw new Error('PiAPI requires apiKey')
        }
        this.apiKey = credentials.apiKey
        this.baseUrl = 'https://api.piapi.ai/v1/kling'
        break
      
      case 'unofficial':
      default:
        if (!credentials.apiKey) {
          throw new Error('Unofficial API requires apiKey')
        }
        this.apiKey = credentials.apiKey
        this.baseUrl = 'https://api-singapore.klingai.com/v1'
        break
    }
  }

  async generate(prompt: string, options: VideoGenerationOptions): Promise<GenerationJob> {
    if (this.apiType === 'piapi') {
      return this.generateViaPiAPI(prompt, options)
    } else if (this.apiType === 'official') {
      return this.generateViaOfficial(prompt, options)
    } else {
      return this.generateViaUnofficial(prompt, options)
    }
  }

  private async generateViaPiAPI(prompt: string, options: VideoGenerationOptions): Promise<GenerationJob> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.apiKey,
      },
      body: JSON.stringify({
        prompt: options.enhancePrompt ? await this.enhancePrompt(prompt) : prompt,
        model: this.mapModelVersion(),
        ratio: this.mapAspectRatio(options.aspectRatio),
        duration: options.duration || 5,
        camera: options.cameraMovement || 'auto',
        webhook_url: options.webhookUrl,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Kling generation failed: ${error.message || response.statusText}`)
    }

    const data = await response.json()
    
    return {
      id: data.task_id || data.id,
      provider: this.version === 'v1' ? 'KLING_V1' : 'KLING_V2',
      status: 'PENDING',
      prompt: prompt,
      createdAt: new Date(),
    }
  }

  private async generateViaOfficial(prompt: string, options: VideoGenerationOptions): Promise<GenerationJob> {
    const endpoint = '/text-to-video/tasks'
    const timestamp = Date.now()
    const nonce = crypto.randomBytes(16).toString('hex')
    const signature = this.generateSignature(endpoint, timestamp, nonce)

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': this.accessKey!,
        'X-Timestamp': timestamp.toString(),
        'X-Nonce': nonce,
        'X-Signature': signature,
      },
      body: JSON.stringify({
        prompt: options.enhancePrompt ? await this.enhancePrompt(prompt) : prompt,
        model: this.mapModelVersion(),
        ratio: this.mapAspectRatio(options.aspectRatio),
        duration: options.duration || 5,
        mode: this.version === 'v1' ? 'standard' : 'professional',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Kling generation failed: ${error.message || response.statusText}`)
    }

    const data = await response.json()
    
    return {
      id: data.data.task_id,
      provider: this.version === 'v1' ? 'KLING_V1' : 'KLING_V2',
      status: 'PENDING',
      prompt: prompt,
      createdAt: new Date(),
    }
  }

  private async generateViaUnofficial(prompt: string, options: VideoGenerationOptions): Promise<GenerationJob> {
    // Implementação similar à original, mas com API key simples
    const response = await fetch(`${this.baseUrl}/videos/text2video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        prompt: options.enhancePrompt ? await this.enhancePrompt(prompt) : prompt,
        model_version: this.mapModelVersion(),
        aspect_ratio: this.mapAspectRatio(options.aspectRatio),
        duration: options.duration || 5,
        cfg_scale: this.version === 'v1' ? 7 : 9,
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
    if (this.apiType === 'piapi') {
      return this.checkStatusViaPiAPI(jobId)
    } else if (this.apiType === 'official') {
      return this.checkStatusViaOfficial(jobId)
    } else {
      return this.checkStatusViaUnofficial(jobId)
    }
  }

  private async checkStatusViaPiAPI(jobId: string): Promise<GenerationStatus> {
    const response = await fetch(`${this.baseUrl}/status/${jobId}`, {
      headers: {
        'X-API-Key': this.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to check status: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      state: this.mapPiAPIStatus(data.status),
      progress: data.progress || 0,
      url: data.output?.video_url,
      thumbnailUrl: data.output?.thumbnail_url,
      error: data.error?.message,
    }
  }

  private async checkStatusViaOfficial(jobId: string): Promise<GenerationStatus> {
    const endpoint = `/text-to-video/tasks/${jobId}`
    const timestamp = Date.now()
    const nonce = crypto.randomBytes(16).toString('hex')
    const signature = this.generateSignature(endpoint, timestamp, nonce)

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'X-Access-Key': this.accessKey!,
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
      state: this.mapOfficialStatus(data.data.status),
      progress: data.data.progress || 0,
      url: data.data.outputs?.[0]?.video_url,
      thumbnailUrl: data.data.outputs?.[0]?.cover_url,
      error: data.data.error_msg,
    }
  }

  private async checkStatusViaUnofficial(jobId: string): Promise<GenerationStatus> {
    const response = await fetch(`${this.baseUrl}/videos/status/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
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
    if (this.apiType === 'piapi') {
      // PiAPI não suporta cancelamento
      throw new Error('Cancellation not supported by PiAPI')
    } else if (this.apiType === 'official') {
      const endpoint = `/text-to-video/tasks/${jobId}/cancel`
      const timestamp = Date.now()
      const nonce = crypto.randomBytes(16).toString('hex')
      const signature = this.generateSignature(endpoint, timestamp, nonce)

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'X-Access-Key': this.accessKey!,
          'X-Timestamp': timestamp.toString(),
          'X-Nonce': nonce,
          'X-Signature': signature,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to cancel: ${response.statusText}`)
      }
    } else {
      // Implementação para API não-oficial
      const response = await fetch(`${this.baseUrl}/videos/cancel/${jobId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to cancel: ${response.statusText}`)
      }
    }
  }

  private generateSignature(endpoint: string, timestamp: number, nonce: string): string {
    const message = `${endpoint}${timestamp}${nonce}`
    const hmac = crypto.createHmac('sha256', this.secretKey!)
    hmac.update(message)
    return hmac.digest('hex')
  }

  private async enhancePrompt(prompt: string): Promise<string> {
    const maxLength = 2500
    
    if (prompt.length > maxLength) {
      prompt = prompt.substring(0, maxLength)
    }
    
    if (!prompt.toLowerCase().includes('quality')) {
      prompt += ', high quality, professional'
    }
    
    return prompt
  }

  private mapModelVersion(): string {
    // Mapeamento para cada tipo de API
    if (this.apiType === 'piapi') {
      return this.version === 'v1' ? 'kling-1.0' : 'kling-2.1'
    } else if (this.apiType === 'official') {
      return this.version === 'v1' ? 'kling_v1' : 'kling_v2.1'
    } else {
      return this.version === 'v1' ? 'v1' : 'v2.1'
    }
  }

  private mapAspectRatio(ratio?: string): string {
    const ratioMap: Record<string, string> = {
      '16:9': '16:9',
      '9:16': '9:16',
      '1:1': '1:1',
      '4:3': '4:3',
      '21:9': '21:9',
    }
    
    return ratioMap[ratio || '16:9'] || '16:9'
  }

  private mapStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'waiting': 'PENDING',
      'pending': 'PENDING',
      'processing': 'PROCESSING',
      'completed': 'COMPLETED',
      'failed': 'FAILED',
      'cancelled': 'CANCELLED',
    }
    
    return statusMap[status.toLowerCase()] || 'PENDING'
  }

  private mapPiAPIStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'PENDING',
      'processing': 'PROCESSING',
      'succeeded': 'COMPLETED',
      'failed': 'FAILED',
      'canceled': 'CANCELLED',
    }
    
    return statusMap[status.toLowerCase()] || 'PENDING'
  }

  private mapOfficialStatus(status: number): string {
    // API oficial usa códigos numéricos
    const statusMap: Record<number, string> = {
      0: 'PENDING',
      1: 'PROCESSING',
      2: 'COMPLETED',
      3: 'FAILED',
      4: 'CANCELLED',
    }
    
    return statusMap[status] || 'PENDING'
  }
}