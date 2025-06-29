export interface ApiConfig {
  id: string
  name: string
  badge: string
  badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline'
  description: string
  creditsPerSecond?: number
  creditsPerRequest?: number
  creditsPerCharacter?: number
  baseCredits: number
  generationTime: string
  maxDuration?: number
  features: string[]
  provider: 'LUMA' | 'KLING' | 'BFL' | 'ELEVENLABS' | 'PIAPI' | 'NEWPORT'
  version: string
  quality: 'PRO' | 'BEST'
  type: 'video' | 'image' | 'audio' | 'multi'
}

export const API_CONFIGS: Record<string, ApiConfig> = {
  LUMA_V1: {
    id: 'LUMA_V1',
    name: 'Luma V1',
    badge: 'PRO',
    badgeVariant: 'secondary',
    description: 'Fast generation, great for most use cases',
    creditsPerSecond: 3,
    baseCredits: 0,
    generationTime: '~2-3 min',
    maxDuration: 5,
    features: [
      'Fast processing',
      'Good quality',
      'Reliable',
      'Best for prototypes',
      'Natural motion'
    ],
    provider: 'LUMA',
    version: '1.0',
    quality: 'PRO'
  },
  LUMA_V2: {
    id: 'LUMA_V2',
    name: 'Luma V2',
    badge: 'BEST',
    badgeVariant: 'default',
    description: 'Enhanced quality, ultra-realistic results',
    creditsPerSecond: 5,
    baseCredits: 0,
    generationTime: '~3-4 min',
    maxDuration: 10,
    features: [
      'Ultra HD quality',
      'Photorealistic',
      'Advanced AI',
      'Camera controls',
      'Professional results'
    ],
    provider: 'LUMA',
    version: '2.0',
    quality: 'BEST'
  },
  KLING_V1: {
    id: 'KLING_V1',
    name: 'Kling 1.6 Pro',
    badge: 'PRO',
    badgeVariant: 'secondary',
    description: 'Creative and artistic, professional quality',
    creditsPerSecond: 5,
    baseCredits: 0,
    generationTime: '~2-3 min',
    maxDuration: 5,
    features: [
      'Artistic style',
      'Creative freedom',
      'Good for animation',
      'Stylized output',
      'Fast rendering'
    ],
    provider: 'KLING',
    version: '1.0',
    quality: 'PRO'
  },
  KLING_V2: {
    id: 'KLING_V2',
    name: 'Kling V2.1 (PRO)',
    badge: 'BEST',
    badgeVariant: 'default',
    description: 'Latest model, cinematic quality, advanced features',
    creditsPerSecond: 10,
    baseCredits: 0,
    generationTime: '~4-5 min',
    maxDuration: 15,
    features: [
      'Cinematic quality',
      'Director mode',
      'Pro features',
      'Motion control',
      'Film-grade output',
      'Advanced physics'
    ],
    provider: 'KLING',
    version: '2.1',
    quality: 'BEST'
  }
}

// Helper functions
export function calculateCredits(provider: string, duration: number): number {
  const config = API_CONFIGS[provider]
  if (!config) return 0
  
  return config.baseCredits + (config.creditsPerSecond * duration)
}

export function getProviderConfig(provider: string): ApiConfig | null {
  return API_CONFIGS[provider] || null
}

export function getProvidersByQuality(quality: 'PRO' | 'BEST'): ApiConfig[] {
  return Object.values(API_CONFIGS).filter(config => config.quality === quality)
}

export function getProvidersByProvider(provider: 'LUMA' | 'KLING'): ApiConfig[] {
  return Object.values(API_CONFIGS).filter(config => config.provider === provider)
}