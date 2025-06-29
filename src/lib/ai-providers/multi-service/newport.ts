import { 
  MultiServiceProvider, 
  MultiServiceCapabilities,
  ImageGenerationOptions,
  ImageGenerationResult,
  AIProviderError 
} from '../types'

export class NewportAIProvider implements MultiServiceProvider {
  name = 'Newport AI'
  version = '1.0'
  apiKey: string
  capabilities: MultiServiceCapabilities = {
    video: true,
    image: true,
    audio: false,
    text: true
  }
  private baseUrl = 'https://api.newportai.com/v1'

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new AIProviderError('Newport AI API key is required', 'NewportAI')
    }
    this.apiKey = apiKey
  }

  // Image generation with various models
  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult> {
    try {
      const model = options?.model || 'sdxl'
      const endpoint = this.getImageEndpoint(model)

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt,
          width: options?.width || 1024,
          height: options?.height || 1024,
          num_inference_steps: options?.steps || 50,
          guidance_scale: options?.guidance || 7.5,
          negative_prompt: options?.negativePrompt,
          seed: options?.seed,
          model: model
        })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
        throw new AIProviderError(
          error.error?.message || `Newport AI error: ${response.status}`,
          'NewportAI',
          response.status,
          error
        )
      }

      const data = await response.json()

      // Handle async generation if needed
      if (data.status === 'processing') {
        const result = await this.pollForResult(data.id, 'image')
        return {
          id: data.id,
          url: result.output[0],
          width: options?.width || 1024,
          height: options?.height || 1024,
          createdAt: new Date(),
          metadata: {
            model,
            seed: result.seed
          }
        }
      }

      // Direct result
      return {
        id: data.id || `newport_${Date.now()}`,
        url: data.output[0],
        width: options?.width || 1024,
        height: options?.height || 1024,
        createdAt: new Date(),
        metadata: {
          model,
          seed: data.seed
        }
      }
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'NewportAI'
      )
    }
  }

  // Video generation
  async generateVideo(prompt: string, options?: any): Promise<any> {
    try {
      const model = options?.model || 'svd'
      const endpoint = this.getVideoEndpoint(model)

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          prompt,
          num_frames: options?.frames || 25,
          fps: options?.fps || 8,
          motion_bucket_id: options?.motionBucketId || 127,
          cond_aug: options?.condAug || 0.02,
          seed: options?.seed,
          ...options
        })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
        throw new AIProviderError(
          error.error?.message || `Newport AI video error: ${response.status}`,
          'NewportAI',
          response.status,
          error
        )
      }

      const data = await response.json()

      // Poll for result
      const result = await this.pollForResult(data.id, 'video')

      return {
        id: data.id,
        url: result.output,
        createdAt: new Date(),
        metadata: {
          model,
          frames: options?.frames || 25,
          fps: options?.fps || 8
        }
      }
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to generate video: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'NewportAI'
      )
    }
  }

  // LLM text generation
  async generateText(prompt: string, options?: any): Promise<any> {
    try {
      const model = options?.model || 'llama-3-70b'

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: options?.temperature || 0.7,
          max_tokens: options?.maxTokens || 1000,
          ...options
        })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
        throw new AIProviderError(
          error.error?.message || `Newport AI LLM error: ${response.status}`,
          'NewportAI',
          response.status,
          error
        )
      }

      const data = await response.json()

      return {
        id: data.id,
        text: data.choices[0].message.content,
        model,
        usage: data.usage,
        createdAt: new Date()
      }
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to generate text: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'NewportAI'
      )
    }
  }

  private getImageEndpoint(model: string): string {
    const endpoints: Record<string, string> = {
      'sdxl': '/images/generations',
      'dalle-3': '/images/generations',
      'midjourney': '/midjourney/imagine',
      'stable-diffusion': '/images/generations',
      'playground': '/images/generations'
    }
    return endpoints[model] || '/images/generations'
  }

  private getVideoEndpoint(model: string): string {
    const endpoints: Record<string, string> = {
      'svd': '/videos/generations',
      'animate-diff': '/videos/animate',
      'modelscope': '/videos/modelscope'
    }
    return endpoints[model] || '/videos/generations'
  }

  private async pollForResult(id: string, type: string, maxAttempts = 60): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`${this.baseUrl}/generations/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })

      if (!response.ok) {
        throw new AIProviderError(
          `Failed to get generation status: ${response.status}`,
          'NewportAI',
          response.status
        )
      }

      const data = await response.json()

      if (data.status === 'succeeded') {
        return data
      } else if (data.status === 'failed') {
        throw new AIProviderError(
          `${type} generation failed: ${data.error}`,
          'NewportAI',
          500,
          data
        )
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    throw new AIProviderError(`${type} generation timed out`, 'NewportAI')
  }

  // Get usage and credits
  async getUsage(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/usage`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })

      if (!response.ok) {
        throw new AIProviderError(
          `Failed to get usage: ${response.status}`,
          'NewportAI',
          response.status
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to get usage: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'NewportAI'
      )
    }
  }
}

// Available models
export const NEWPORT_MODELS = {
  IMAGE: {
    SDXL: 'sdxl',
    DALLE3: 'dalle-3',
    MIDJOURNEY: 'midjourney',
    STABLE_DIFFUSION: 'stable-diffusion',
    PLAYGROUND: 'playground',
    FLUX: 'flux'
  },
  VIDEO: {
    SVD: 'svd',
    ANIMATE_DIFF: 'animate-diff',
    MODELSCOPE: 'modelscope'
  },
  LLM: {
    LLAMA3_70B: 'llama-3-70b',
    LLAMA3_8B: 'llama-3-8b',
    MIXTRAL: 'mixtral-8x7b',
    GPT4: 'gpt-4',
    CLAUDE3: 'claude-3-opus'
  }
}

// Factory function
export function createNewportAIProvider(): NewportAIProvider {
  const apiKey = process.env.NEWPORT_API_KEY
  if (!apiKey) {
    throw new AIProviderError('NEWPORT_API_KEY environment variable is not set', 'NewportAI')
  }
  return new NewportAIProvider(apiKey)
}