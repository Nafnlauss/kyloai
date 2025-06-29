// Base types for AI providers

export interface BaseProvider {
  name: string
  version: string
  apiKey: string
}

// Image Generation Types
export interface ImageGenerationOptions {
  width?: number
  height?: number
  steps?: number
  guidance?: number
  model?: string
  seed?: number
  negativePrompt?: string
  style?: string
}

export interface ImageGenerationResult {
  id: string
  url: string
  width: number
  height: number
  createdAt: Date
  metadata?: Record<string, any>
}

export interface ImageProvider extends BaseProvider {
  generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult>
  getImageStatus?(id: string): Promise<ImageGenerationResult>
}

// Audio Generation Types
export interface AudioGenerationOptions {
  voiceId?: string
  language?: string
  speed?: number
  pitch?: number
  model?: string
  format?: 'mp3' | 'wav' | 'ogg'
}

export interface AudioGenerationResult {
  id: string
  url: string
  duration: number
  format: string
  createdAt: Date
  metadata?: Record<string, any>
}

export interface AudioProvider extends BaseProvider {
  generateSpeech(text: string, options?: AudioGenerationOptions): Promise<AudioGenerationResult>
  getVoices?(): Promise<Array<{ id: string; name: string; language: string }>>
}

// Multi-Service Provider Types
export interface MultiServiceCapabilities {
  video?: boolean
  image?: boolean
  audio?: boolean
  text?: boolean
}

export interface MultiServiceProvider extends BaseProvider {
  capabilities: MultiServiceCapabilities
  // Methods will be defined based on capabilities
}

// Error Types
export class AIProviderError extends Error {
  constructor(
    message: string,
    public provider: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'AIProviderError'
  }
}

// Provider Configuration
export interface ProviderConfig {
  id: string
  name: string
  type: 'image' | 'audio' | 'video' | 'multi'
  description: string
  features: string[]
  pricing: {
    model: string
    costPerRequest?: number
    costPerSecond?: number
    costPerCharacter?: number
  }
  limits?: {
    maxRequests?: number
    maxDuration?: number
    maxResolution?: string
  }
}