export interface VideoGenerationOptions {
  aspectRatio?: string
  duration?: number
  enhancePrompt?: boolean
  modelVersion?: string // For Kling
  mode?: 'std' | 'pro' // For Kling
  negativePrompt?: string // For Kling
}

export interface GenerationJob {
  id: string
  provider: 'LUMA_V1' | 'LUMA_V2' | 'KLING_V1' | 'KLING_V2'
  status: string
  prompt: string
  createdAt: Date
}

export interface GenerationStatus {
  state: string
  progress: number
  url?: string
  thumbnailUrl?: string
  error?: string
}

export interface VideoProvider {
  generate(prompt: string, options: VideoGenerationOptions): Promise<GenerationJob>
  checkStatus(jobId: string): Promise<GenerationStatus>
  cancel?(jobId: string): Promise<void>
}

export class VideoGenerationError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'VideoGenerationError'
  }
}