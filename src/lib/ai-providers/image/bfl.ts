import { ImageProvider, ImageGenerationOptions, ImageGenerationResult, AIProviderError } from '../types'

export class BFLProvider implements ImageProvider {
  name = 'Black Forest Labs'
  version = '1.0'
  apiKey: string
  private baseUrl = 'https://api.bfl.ai' // Atualizado para endpoint oficial

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new AIProviderError('BFL API key is required', 'BFL')
    }
    this.apiKey = apiKey
  }

  async generateImage(prompt: string, options?: ImageGenerationOptions): Promise<ImageGenerationResult> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-key': this.apiKey // Header correto conforme documentação oficial
        },
        body: JSON.stringify({
          prompt,
          width: options?.width || 1024,
          height: options?.height || 1024,
          steps: options?.steps || 50,
          guidance_scale: options?.guidance || 7.5,
          model: options?.model || 'flux-schnell',
          seed: options?.seed,
          negative_prompt: options?.negativePrompt
        })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }))
        throw new AIProviderError(
          error.message || `BFL API error: ${response.status}`,
          'BFL',
          response.status,
          error
        )
      }

      const data = await response.json()

      // BFL returns a task ID, we need to poll for the result
      const result = await this.pollForResult(data.id)

      return {
        id: data.id,
        url: result.result.sample,
        width: options?.width || 1024,
        height: options?.height || 1024,
        createdAt: new Date(),
        metadata: {
          model: options?.model || 'flux-schnell',
          seed: result.result.seed
        }
      }
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'BFL'
      )
    }
  }

  private async pollForResult(taskId: string, maxAttempts = 60): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(`${this.baseUrl}/v1/get_result?id=${taskId}`, {
        headers: {
          'x-key': this.apiKey
        }
      })

      if (!response.ok) {
        throw new AIProviderError(
          `Failed to get result: ${response.status}`,
          'BFL',
          response.status
        )
      }

      const data = await response.json()

      if (data.status === 'Ready') {
        return data
      } else if (data.status === 'Failed') {
        throw new AIProviderError(
          'Image generation failed',
          'BFL',
          500,
          data
        )
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    throw new AIProviderError('Image generation timed out', 'BFL')
  }

  async getImageStatus(id: string): Promise<ImageGenerationResult> {
    try {
      const result = await this.pollForResult(id, 1)
      return {
        id,
        url: result.result.sample,
        width: result.result.width || 1024,
        height: result.result.height || 1024,
        createdAt: new Date(result.created_at || Date.now()),
        metadata: {
          seed: result.result.seed
        }
      }
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to get image status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'BFL'
      )
    }
  }
}

// Available models for BFL - Atualizado conforme documentação oficial
export const BFL_MODELS = {
  FLUX_SCHNELL: 'flux-schnell',
  FLUX_DEV: 'flux-dev',
  FLUX_PRO: 'flux-pro',
  FLUX_PRO_1_1: 'flux-pro-1.1',
  FLUX_ULTRA: 'flux-pro-1.1-ultra'
}

// Factory function
export function createBFLProvider(): BFLProvider {
  const apiKey = process.env.BFL_API_KEY
  if (!apiKey) {
    throw new AIProviderError('BFL_API_KEY environment variable is not set', 'BFL')
  }
  return new BFLProvider(apiKey)
}