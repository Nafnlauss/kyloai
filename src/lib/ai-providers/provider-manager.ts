import { 
  ImageProvider, 
  AudioProvider, 
  MultiServiceProvider, 
  AIProviderError,
  ProviderConfig 
} from './types'

import { createBFLProvider } from './image/bfl'
import { createElevenLabsProvider } from './audio/elevenlabs'
import { createPiAPIProvider } from './multi-service/piapi'
import { createNewportAIProvider } from './multi-service/newport'

// Provider instances cache
const providerCache: Map<string, any> = new Map()

// Get or create provider instance
export function getProvider<T>(providerId: string): T {
  if (providerCache.has(providerId)) {
    return providerCache.get(providerId) as T
  }

  let provider: any

  switch (providerId) {
    case 'bfl':
      provider = createBFLProvider()
      break
    case 'elevenlabs':
      provider = createElevenLabsProvider()
      break
    case 'piapi':
      provider = createPiAPIProvider()
      break
    case 'newport':
      provider = createNewportAIProvider()
      break
    default:
      throw new AIProviderError(`Unknown provider: ${providerId}`, 'ProviderManager')
  }

  providerCache.set(providerId, provider)
  return provider as T
}

// Get image provider
export function getImageProvider(providerId: string): ImageProvider {
  const provider = getProvider<any>(providerId)
  
  // Check if provider supports image generation
  if (!provider.generateImage && !provider.generateMidjourneyImage && !provider.generateFluxImage) {
    throw new AIProviderError(
      `Provider ${providerId} does not support image generation`,
      'ProviderManager'
    )
  }

  // Create adapter for multi-service providers
  if (providerId === 'piapi') {
    return {
      name: provider.name,
      version: provider.version,
      apiKey: provider.apiKey,
      generateImage: async (prompt, options) => {
        // Use Flux by default for PiAPI
        return provider.generateFluxImage(prompt, options)
      },
      getImageStatus: async (id) => {
        throw new AIProviderError('Status checking not implemented for PiAPI images', 'PiAPI')
      }
    }
  }

  if (providerId === 'newport') {
    return {
      name: provider.name,
      version: provider.version,
      apiKey: provider.apiKey,
      generateImage: provider.generateImage.bind(provider),
      getImageStatus: async (id) => {
        throw new AIProviderError('Status checking not implemented for Newport images', 'NewportAI')
      }
    }
  }

  return provider as ImageProvider
}

// Get audio provider
export function getAudioProvider(providerId: string): AudioProvider {
  const provider = getProvider<any>(providerId)
  
  if (!provider.generateSpeech) {
    throw new AIProviderError(
      `Provider ${providerId} does not support audio generation`,
      'ProviderManager'
    )
  }

  return provider as AudioProvider
}

// Get multi-service provider
export function getMultiServiceProvider(providerId: string): MultiServiceProvider {
  const provider = getProvider<any>(providerId)
  
  if (!provider.capabilities) {
    throw new AIProviderError(
      `Provider ${providerId} is not a multi-service provider`,
      'ProviderManager'
    )
  }

  return provider as MultiServiceProvider
}

// Check if provider is available (has API key)
export function isProviderAvailable(providerId: string): boolean {
  try {
    const envVarMap: Record<string, string> = {
      'bfl': 'BFL_API_KEY',
      'elevenlabs': 'ELEVENLABS_API_KEY',
      'piapi': 'PIAPI_API_KEY',
      'newport': 'NEWPORT_API_KEY'
    }

    const envVar = envVarMap[providerId]
    return !!process.env[envVar]
  } catch {
    return false
  }
}

// Get available providers
export function getAvailableProviders(type?: 'image' | 'audio' | 'video' | 'multi'): string[] {
  const providers = ['bfl', 'elevenlabs', 'piapi', 'newport']
  const typeMap: Record<string, string[]> = {
    image: ['bfl', 'piapi', 'newport'],
    audio: ['elevenlabs', 'piapi'],
    video: ['piapi', 'newport'],
    multi: ['piapi', 'newport']
  }

  const filteredProviders = type ? typeMap[type] || [] : providers
  return filteredProviders.filter(isProviderAvailable)
}

// Clear provider cache
export function clearProviderCache(): void {
  providerCache.clear()
}

// Provider cost estimation (credits per operation)
export const PROVIDER_COSTS = {
  bfl: {
    'flux-schnell': 1,
    'flux-dev': 3,
    'flux-pro': 5
  },
  elevenlabs: {
    'speech': 0.1 // per 1000 characters
  },
  piapi: {
    'midjourney': 5,
    'flux': 2,
    'suno': 10,
    'kling': 15,
    'luma': 10
  },
  newport: {
    'image': 2,
    'video': 20,
    'text': 0.01 // per token
  }
}

// Calculate operation cost
export function calculateOperationCost(
  providerId: string, 
  operation: string, 
  options?: any
): number {
  const costs = PROVIDER_COSTS[providerId as keyof typeof PROVIDER_COSTS]
  if (!costs) return 0

  if (providerId === 'elevenlabs' && operation === 'speech') {
    const textLength = options?.textLength || 0
    return (textLength / 1000) * costs.speech
  }

  if (providerId === 'newport' && operation === 'text') {
    const tokens = options?.tokens || 0
    return tokens * costs.text
  }

  return costs[operation as keyof typeof costs] || 0
}