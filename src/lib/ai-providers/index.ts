// Central export for all AI providers

// Export types
export * from './types'

// Image providers
export { BFLProvider, createBFLProvider, BFL_MODELS } from './image/bfl'

// Audio providers
export { 
  ElevenLabsProvider, 
  createElevenLabsProvider, 
  ELEVENLABS_MODELS,
  ELEVENLABS_VOICES 
} from './audio/elevenlabs'

// Multi-service providers
export { 
  PiAPIProvider, 
  createPiAPIProvider,
  PIAPI_SERVICES 
} from './multi-service/piapi'

export { 
  NewportAIProvider, 
  createNewportAIProvider,
  NEWPORT_MODELS 
} from './multi-service/newport'

// Provider registry
export const AI_PROVIDERS = {
  // Image
  BFL: 'bfl',
  
  // Audio
  ELEVENLABS: 'elevenlabs',
  
  // Multi-service
  PIAPI: 'piapi',
  NEWPORT: 'newport',
  
  // Existing video providers (from video-providers directory)
  LUMA: 'luma',
  KLING: 'kling'
} as const

export type AIProviderType = typeof AI_PROVIDERS[keyof typeof AI_PROVIDERS]

// Provider configuration
export const PROVIDER_CONFIGS = {
  [AI_PROVIDERS.BFL]: {
    name: 'Black Forest Labs',
    type: 'image',
    description: 'High-quality image generation with FLUX models',
    features: ['Text to Image', 'Multiple Models', 'High Resolution'],
    models: ['flux-schnell', 'flux-dev', 'flux-pro']
  },
  [AI_PROVIDERS.ELEVENLABS]: {
    name: 'ElevenLabs',
    type: 'audio',
    description: 'Premium text-to-speech with natural voices',
    features: ['Text to Speech', 'Multiple Voices', 'Multiple Languages'],
    models: ['eleven_monolingual_v1', 'eleven_multilingual_v2', 'eleven_turbo_v2']
  },
  [AI_PROVIDERS.PIAPI]: {
    name: 'PiAPI',
    type: 'multi',
    description: 'Access to multiple AI services through one API',
    features: ['Midjourney', 'FLUX', 'Suno Music', 'Kling Video', 'Luma Video'],
    services: ['midjourney', 'flux', 'suno', 'kling', 'luma']
  },
  [AI_PROVIDERS.NEWPORT]: {
    name: 'Newport AI',
    type: 'multi',
    description: 'Comprehensive AI platform with multiple models',
    features: ['Image Generation', 'Video Generation', 'LLM Text', 'Multiple Models'],
    models: ['sdxl', 'dalle-3', 'svd', 'llama-3-70b']
  }
}