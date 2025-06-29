// Configuração centralizada de capacidades e preços das APIs
// Baseado nos 85 modelos de IA implementados

export interface ApiCapability {
  maxRes?: string[]
  aspectRatios?: string[]
  maxDurationSec?: number
  lipSync?: boolean
  imageRef?: boolean
  // Para áudio
  maxCharacters?: number
  voices?: string[]
  languages?: string[]
  formats?: string[]
  // Para imagem
  dimensions?: string[]
  styles?: string[]
}

export interface ApiPricing {
  base: number           // Custo base em créditos
  imageRef?: number      // Custo adicional para imagem de referência
  lipSync?: number       // Custo adicional para lip-sync
  perSecond?: boolean    // Se o custo é por segundo (vídeo)
  per1kChars?: boolean   // Se o custo é por 1000 caracteres (áudio)
}

// CAPACIDADES DE CADA API
export const API_CAPS: Record<string, ApiCapability> = {
  // === VÍDEO - Luma Labs ===
  'luma-ray2-flash': {
    maxRes: ['540p'],
    aspectRatios: ['16:9', '1:1', '9:16'],
    maxDurationSec: 5,
    lipSync: false,
    imageRef: true
  },
  'luma-ray2': {
    maxRes: ['720p', '1080p', '4K'],
    aspectRatios: ['16:9', '1:1', '9:16', '4:3'],
    maxDurationSec: 9,
    lipSync: false,
    imageRef: true
  },
  'luma-ray-1.6': {
    maxRes: ['720p', '1080p'],
    aspectRatios: ['16:9', '1:1', '9:16'],
    maxDurationSec: 10,
    lipSync: false,
    imageRef: true
  },

  // === VÍDEO - KlingAI ===
  'kling-1.0': {
    maxRes: ['540p', '720p', '1080p'],
    aspectRatios: ['16:9', '1:1', '9:16'],
    maxDurationSec: 10,
    lipSync: false,
    imageRef: true
  },
  'kling-1.1': {
    maxRes: ['540p', '720p', '1080p'],
    aspectRatios: ['16:9', '1:1', '9:16'],
    maxDurationSec: 10,
    lipSync: false,
    imageRef: true
  },
  'kling-1.2': {
    maxRes: ['540p', '720p', '1080p'],
    aspectRatios: ['16:9', '1:1', '9:16'],
    maxDurationSec: 15,
    lipSync: false,
    imageRef: true
  },
  'kling-2.0': {
    maxRes: ['720p', '1080p', '4K'],
    aspectRatios: ['16:9', '1:1', '9:16', '4:3'],
    maxDurationSec: 30,
    lipSync: true,
    imageRef: true
  },
  'kling-2.1': {
    maxRes: ['720p', '1080p', '4K'],
    aspectRatios: ['16:9', '1:1', '9:16', '4:3'],
    maxDurationSec: 30,
    lipSync: true,
    imageRef: true
  },
  'kling-professional': {
    maxRes: ['1080p', '4K'],
    aspectRatios: ['16:9', '1:1', '9:16', '4:3', '21:9'],
    maxDurationSec: 120,
    lipSync: true,
    imageRef: true
  },

  // === IMAGEM - BFL.ai ===
  'bfl-flux-schnell': {
    dimensions: ['1024x1024', '1536x768', '768x1536'],
    aspectRatios: ['1:1', '16:9', '9:16', '4:5'],
    styles: ['vivid', 'natural'],
    imageRef: false
  },
  'bfl-flux-dev': {
    dimensions: ['1024x1024', '1536x768', '768x1536'],
    aspectRatios: ['1:1', '16:9', '9:16', '4:5'],
    styles: ['vivid', 'natural', 'illustration'],
    imageRef: true
  },
  'bfl-flux-1.1-pro': {
    dimensions: ['1024x1024', '1536x768', '768x1536', '2048x2048'],
    aspectRatios: ['1:1', '16:9', '9:16', '4:5', '3:2'],
    styles: ['vivid', 'natural', 'illustration', 'photographic'],
    imageRef: true
  },
  'bfl-flux-1.0-pro': {
    dimensions: ['1024x1024', '1536x768', '768x1536', '2048x2048'],
    aspectRatios: ['1:1', '16:9', '9:16', '4:5', '3:2'],
    styles: ['vivid', 'natural', 'illustration', 'photographic'],
    imageRef: true
  },
  'flux-kontext-pro-t2i': {
    dimensions: ['1024x1024', '1536x768', '768x1536'],
    aspectRatios: ['1:1', '16:9', '9:16', '4:5'],
    styles: ['vivid', 'natural'],
    imageRef: true
  },

  // === ÁUDIO - ElevenLabs ===
  'elevenlabs-multilingual-v2': {
    maxCharacters: 5000,
    voices: ['Rachel', 'Drew', 'Clyde', 'Paul', 'Domi', 'Dave', 'Fin', 'Bella', 'Antoni', 'Thomas'],
    languages: ['en', 'pt', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'zh', 'ru'],
    formats: ['mp3', 'wav']
  },
  'elevenlabs-turbo-v2.5': {
    maxCharacters: 5000,
    voices: ['Rachel', 'Drew', 'Clyde', 'Paul', 'Domi'],
    languages: ['en', 'pt', 'es', 'fr', 'de'],
    formats: ['mp3']
  },
  'elevenlabs-flash-v2.5': {
    maxCharacters: 2500,
    voices: ['Rachel', 'Drew', 'Clyde'],
    languages: ['en', 'pt', 'es'],
    formats: ['mp3']
  }
}

// TABELA DE PREÇOS
export const PRICE_TABLE: Record<string, ApiPricing> = {
  // === VÍDEO - Luma Labs ===
  'luma-ray2-flash': { base: 50, imageRef: 10, lipSync: 0 },
  'luma-ray2': { base: 253, imageRef: 20, lipSync: 0, perSecond: true },
  'luma-ray-1.6': { base: 200, imageRef: 15, lipSync: 0, perSecond: true },

  // === VÍDEO - KlingAI ===
  'kling-1.0': { base: 30, imageRef: 5, lipSync: 0, perSecond: true },
  'kling-1.1': { base: 35, imageRef: 7, lipSync: 0, perSecond: true },
  'kling-1.2': { base: 40, imageRef: 8, lipSync: 0, perSecond: true },
  'kling-2.0': { base: 80, imageRef: 15, lipSync: 30, perSecond: true },
  'kling-2.1': { base: 90, imageRef: 18, lipSync: 35, perSecond: true },
  'kling-professional': { base: 125, imageRef: 25, lipSync: 50, perSecond: true },

  // === IMAGEM - BFL.ai ===
  'bfl-flux-schnell': { base: 5, imageRef: 0 },
  'bfl-flux-dev': { base: 9, imageRef: 2 },
  'bfl-flux-1.1-pro': { base: 15, imageRef: 3 },
  'bfl-flux-1.0-pro': { base: 18, imageRef: 4 },
  'flux-kontext-pro-t2i': { base: 2, imageRef: 1 },

  // === ÁUDIO - ElevenLabs ===
  'elevenlabs-multilingual-v2': { base: 65, per1kChars: true },
  'elevenlabs-turbo-v2.5': { base: 33, per1kChars: true },
  'elevenlabs-flash-v2.5': { base: 33, per1kChars: true }
}

// Função helper para calcular custos
export function calculateCost(
  apiId: string,
  options: {
    duration?: number      // Para vídeo (segundos)
    characters?: number    // Para áudio
    hasImageRef?: boolean
    hasLipSync?: boolean
  }
): number {
  const pricing = PRICE_TABLE[apiId]
  if (!pricing) return 0

  let totalCost = pricing.base

  // Para vídeo com custo por segundo
  if (pricing.perSecond && options.duration) {
    totalCost = pricing.base * (options.duration / 5) // Base é para 5 segundos
  }

  // Para áudio com custo por 1000 caracteres
  if (pricing.per1kChars && options.characters) {
    const blocks = Math.ceil(options.characters / 1000)
    totalCost = pricing.base * blocks
  }

  // Adicionar custo de imagem de referência
  if (options.hasImageRef && pricing.imageRef) {
    totalCost += pricing.imageRef
  }

  // Adicionar custo de lip-sync
  if (options.hasLipSync && pricing.lipSync) {
    totalCost += pricing.lipSync
  }

  return Math.ceil(totalCost)
}