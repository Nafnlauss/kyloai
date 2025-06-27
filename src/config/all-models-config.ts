// Configuração completa das 85 APIs/Modelos
// Organizado por provider e tipo de mídia

export interface ModelConfig {
  id: string
  label: string
  provider: string
  mediaType: 'video' | 'image' | 'audio'
  costTier: 'low' | 'mid' | 'high'
  capabilities: {
    aspectRatios?: string[]
    resolutions?: string[]
    durations?: number[] // em segundos
    maxCharacters?: number
    dimensions?: string[]
    lipSync?: boolean
    lipSyncAvailable?: boolean // Novo campo para indicar que Lip-Sync pode ser habilitado
    imageRef?: boolean
    audioRef?: boolean
  }
  credits: {
    base: number
    perSecond?: boolean
    per1kChars?: boolean
    imageRef?: number // Custo adicional por referência de imagem (0 = grátis)
    lipSync?: number
  }
  summary?: string // Campo opcional para descrição do modelo
}

// Mapeamento de providers para seus modelos
export const PROVIDERS = {
  luma: 'Luma Labs',
  kling: 'KlingAI',
  bfl: 'BFL.ai (FLUX)',
  elevenlabs: 'ElevenLabs',
  piapi: 'PiAPI',
  newport: 'NewportAI'
} as const

// Todos os 85 modelos organizados por provider
export const ALL_MODELS: Record<string, ModelConfig[]> = {
  // === LUMA LABS (3 modelos) ===
  luma: [
    {
      id: 'luma-ray2-flash',
      label: 'Ray2-Flash',
      provider: 'Luma Labs',
      mediaType: 'video',
      costTier: 'low',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['540p'],
        durations: [5],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 50, imageRef: 0 },
      summary: 'Fast and affordable video generation with basic quality'
    },
    {
      id: 'luma-ray2',
      label: 'Ray2',
      provider: 'Luma Labs',
      mediaType: 'video',
      costTier: 'high',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16', '4:3'],
        resolutions: ['720p', '1080p', '4K'],
        durations: [5, 9],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 253, perSecond: true, imageRef: 0 },
      summary: 'Premium quality video generation with 4K support and advanced features'
    },
    {
      id: 'luma-ray-1.6',
      label: 'Ray 1.6 (Legacy)',
      provider: 'Luma Labs',
      mediaType: 'video',
      costTier: 'mid',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['720p', '1080p'],
        durations: [5, 10],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 200, perSecond: true, imageRef: 0 },
      summary: 'Stable legacy model with proven results'
    }
  ],

  // === KLING AI (9 modelos) ===
  kling: [
    {
      id: 'kling-1.0',
      label: 'Kling 1.0',
      provider: 'KlingAI',
      mediaType: 'video',
      costTier: 'low',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['540p', '720p', '1080p'],
        durations: [5, 10],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 30, perSecond: true, imageRef: 0 },
      summary: 'Affordable video generation with good quality and natural motion'
    },
    {
      id: 'kling-1.1',
      label: 'Kling 1.1',
      provider: 'KlingAI',
      mediaType: 'video',
      costTier: 'low',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['540p', '720p', '1080p'],
        durations: [5, 10],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 35, perSecond: true, imageRef: 0 },
      summary: 'Enhanced version with improved motion and quality'
    },
    {
      id: 'kling-1.2',
      label: 'Kling 1.2',
      provider: 'KlingAI',
      mediaType: 'video',
      costTier: 'low',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['540p', '720p', '1080p'],
        durations: [5, 10, 15],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 40, perSecond: true, imageRef: 0 },
      summary: 'Advanced model with extended duration support'
    },
    {
      id: 'kling-1.5',
      label: 'Kling 1.5',
      provider: 'KlingAI',
      mediaType: 'video',
      costTier: 'mid',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16', '4:3'],
        resolutions: ['720p', '1080p'],
        durations: [5, 10, 15, 20],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 50, perSecond: true, imageRef: 0 },
      summary: 'Professional grade with better resolution and duration options'
    },
    {
      id: 'kling-1.6',
      label: 'Kling 1.6',
      provider: 'KlingAI',
      mediaType: 'video',
      costTier: 'mid',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16', '4:3'],
        resolutions: ['720p', '1080p'],
        durations: [5, 10, 15, 20],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 60, perSecond: true, imageRef: 0 },
      summary: 'Refined model with optimized performance'
    },
    {
      id: 'kling-2.0',
      label: 'Kling 2.0',
      provider: 'KlingAI',
      mediaType: 'video',
      costTier: 'mid',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16', '4:3'],
        resolutions: ['720p', '1080p', '4K'],
        durations: [5, 10, 15, 20, 30],
        lipSync: true,
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 80, perSecond: true, imageRef: 0, lipSync: 30 },
      summary: 'Next-gen video model with native lip-sync and 4K support'
    },
    {
      id: 'kling-2.1',
      label: 'Kling 2.1',
      provider: 'KlingAI',
      mediaType: 'video',
      costTier: 'mid',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16', '4:3'],
        resolutions: ['720p', '1080p', '4K'],
        durations: [5, 10, 15, 20, 30],
        lipSync: true,
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 90, perSecond: true, imageRef: 0, lipSync: 35 },
      summary: 'Latest version with enhanced features and quality'
    },
    {
      id: 'kling-2.1-master',
      label: 'Kling 2.1 Master (8K)',
      provider: 'KlingAI',
      mediaType: 'video',
      costTier: 'high',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16', '4:3', '21:9'],
        resolutions: ['1080p', '4K', '8K'],
        durations: [5, 10, 15, 20, 30, 60],
        lipSync: true,
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 150, perSecond: true, imageRef: 0, lipSync: 50 },
      summary: 'Ultimate quality with 8K resolution and extended durations'
    },
    {
      id: 'kling-professional',
      label: 'Kling Professional (120s)',
      provider: 'KlingAI',
      mediaType: 'video',
      costTier: 'high',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16', '4:3', '21:9'],
        resolutions: ['1080p', '4K'],
        durations: [5, 10, 15, 20, 30, 60, 90, 120],
        lipSync: true,
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 125, perSecond: true, imageRef: 0, lipSync: 50 },
      summary: 'Enterprise-grade with up to 120s duration and premium features'
    }
  ],

  // === BFL.AI FLUX (10 modelos) ===
  bfl: [
    {
      id: 'bfl-flux-schnell',
      label: 'FLUX Schnell',
      provider: 'BFL.ai',
      mediaType: 'image',
      costTier: 'low',
      capabilities: {
        dimensions: ['1024x1024', '1536x768', '768x1536'],
        aspectRatios: ['1:1', '16:9', '9:16', '4:5']
      },
      credits: { base: 5 },
      summary: 'Ultra-fast image generation for quick prototyping'
    },
    {
      id: 'bfl-flux-dev',
      label: 'FLUX Dev',
      provider: 'BFL.ai',
      mediaType: 'image',
      costTier: 'low',
      capabilities: {
        dimensions: ['1024x1024', '1536x768', '768x1536'],
        aspectRatios: ['1:1', '16:9', '9:16', '4:5'],
        imageRef: true
      },
      credits: { base: 9, imageRef: 0 },
      summary: 'Development-friendly image generation for rapid prototyping'
    },
    {
      id: 'bfl-flux-1.1-pro',
      label: 'FLUX 1.1 Pro',
      provider: 'BFL.ai',
      mediaType: 'image',
      costTier: 'mid',
      capabilities: {
        dimensions: ['1024x1024', '1536x768', '768x1536', '2048x2048'],
        aspectRatios: ['1:1', '16:9', '9:16', '4:5', '3:2'],
        imageRef: true
      },
      credits: { base: 15, imageRef: 0 },
      summary: 'Professional image generation with enhanced quality'
    },
    {
      id: 'bfl-flux-1.0-pro',
      label: 'FLUX 1.0 Pro',
      provider: 'BFL.ai',
      mediaType: 'image',
      costTier: 'mid',
      capabilities: {
        dimensions: ['1024x1024', '1536x768', '768x1536', '2048x2048'],
        aspectRatios: ['1:1', '16:9', '9:16', '4:5', '3:2'],
        imageRef: true
      },
      credits: { base: 18, imageRef: 0 },
      summary: 'Stable professional model with reliable results'
    },
    {
      id: 'bfl-flux-ultra',
      label: 'FLUX Ultra',
      provider: 'BFL.ai',
      mediaType: 'image',
      costTier: 'high',
      capabilities: {
        dimensions: ['1024x1024', '2048x2048', '4096x4096'],
        aspectRatios: ['1:1', '16:9', '9:16', '4:5', '3:2', '21:9'],
        imageRef: true
      },
      credits: { base: 50, imageRef: 0 },
      summary: 'Ultra-high quality images up to 4K resolution'
    },
    {
      id: 'bfl-flux-raw',
      label: 'FLUX Raw',
      provider: 'BFL.ai',
      mediaType: 'image',
      costTier: 'mid',
      capabilities: {
        dimensions: ['1024x1024', '1536x768', '768x1536'],
        aspectRatios: ['1:1', '16:9', '9:16', '4:5'],
        imageRef: true
      },
      credits: { base: 12, imageRef: 0 },
      summary: 'Raw photographic style for realistic images'
    },
    {
      id: 'bfl-flux-fill',
      label: 'FLUX Fill',
      provider: 'BFL.ai',
      mediaType: 'image',
      costTier: 'low',
      capabilities: {
        dimensions: ['1024x1024'],
        aspectRatios: ['1:1'],
        imageRef: true
      },
      credits: { base: 8, imageRef: 0 },
      summary: 'Specialized for image inpainting and filling'
    },
    {
      id: 'bfl-flux-depth',
      label: 'FLUX Depth',
      provider: 'BFL.ai',
      mediaType: 'image',
      costTier: 'mid',
      capabilities: {
        dimensions: ['1024x1024', '1536x768', '768x1536'],
        aspectRatios: ['1:1', '16:9', '9:16'],
        imageRef: true
      },
      credits: { base: 10, imageRef: 0 },
      summary: 'Depth-aware image generation for 3D effects'
    },
    {
      id: 'bfl-flux-canny',
      label: 'FLUX Canny',
      provider: 'BFL.ai',
      mediaType: 'image',
      costTier: 'mid',
      capabilities: {
        dimensions: ['1024x1024', '1536x768', '768x1536'],
        aspectRatios: ['1:1', '16:9', '9:16'],
        imageRef: true
      },
      credits: { base: 10, imageRef: 0 },
      summary: 'Edge-guided image generation for precise control'
    },
    {
      id: 'bfl-flux-redux',
      label: 'FLUX Redux',
      provider: 'BFL.ai',
      mediaType: 'image',
      costTier: 'low',
      capabilities: {
        dimensions: ['1024x1024'],
        aspectRatios: ['1:1'],
        imageRef: true
      },
      credits: { base: 6, imageRef: 0 },
      summary: 'Lightweight model for fast image generation'
    }
  ],

  // === ELEVENLABS (8 modelos) ===
  elevenlabs: [
    {
      id: 'elevenlabs-v3',
      label: 'v3',
      provider: 'ElevenLabs',
      mediaType: 'audio',
      costTier: 'mid',
      capabilities: {
        maxCharacters: 5000
      },
      credits: { base: 50, per1kChars: true },
      summary: 'Standard text-to-speech with natural voices'
    },
    {
      id: 'elevenlabs-multilingual-v1',
      label: 'Multilingual V1',
      provider: 'ElevenLabs',
      mediaType: 'audio',
      costTier: 'mid',
      capabilities: {
        maxCharacters: 5000
      },
      credits: { base: 55, per1kChars: true },
      summary: 'Multilingual TTS supporting 18 languages'
    },
    {
      id: 'elevenlabs-multilingual-v2',
      label: 'Multilingual V2',
      provider: 'ElevenLabs',
      mediaType: 'audio',
      costTier: 'mid',
      capabilities: {
        maxCharacters: 5000
      },
      credits: { base: 65, per1kChars: true },
      summary: 'Advanced multilingual TTS with 27+ languages and natural voices'
    },
    {
      id: 'elevenlabs-english-v1',
      label: 'English V1',
      provider: 'ElevenLabs',
      mediaType: 'audio',
      costTier: 'low',
      capabilities: {
        maxCharacters: 5000
      },
      credits: { base: 30, per1kChars: true },
      summary: 'English-only TTS with optimized performance'
    },
    {
      id: 'elevenlabs-turbo-v2',
      label: 'Turbo V2',
      provider: 'ElevenLabs',
      mediaType: 'audio',
      costTier: 'low',
      capabilities: {
        maxCharacters: 5000
      },
      credits: { base: 30, per1kChars: true },
      summary: 'Fast TTS with 8 language support'
    },
    {
      id: 'elevenlabs-turbo-v2.5',
      label: 'Turbo V2.5',
      provider: 'ElevenLabs',
      mediaType: 'audio',
      costTier: 'low',
      capabilities: {
        maxCharacters: 5000
      },
      credits: { base: 33, per1kChars: true },
      summary: 'Enhanced turbo model with Arabic support'
    },
    {
      id: 'elevenlabs-flash',
      label: 'Flash',
      provider: 'ElevenLabs',
      mediaType: 'audio',
      costTier: 'low',
      capabilities: {
        maxCharacters: 2500
      },
      credits: { base: 25, per1kChars: true },
      summary: 'Ultra-fast English-only TTS'
    },
    {
      id: 'elevenlabs-flash-v2.5',
      label: 'Flash V2.5',
      provider: 'ElevenLabs',
      mediaType: 'audio',
      costTier: 'low',
      capabilities: {
        maxCharacters: 2500
      },
      credits: { base: 33, per1kChars: true },
      summary: 'Latest flash model with improved quality'
    }
  ],

  // === PIAPI (15 modelos únicos) ===
  piapi: [
    // Vídeo (5)
    {
      id: 'piapi-hailuo',
      label: 'Hailuo',
      provider: 'PiAPI',
      mediaType: 'video',
      costTier: 'mid',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['720p', '1080p'],
        durations: [5, 10],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 70, perSecond: true, imageRef: 0 },
      summary: 'Versatile video generation with balanced quality and speed'
    },
    {
      id: 'piapi-hunyuan',
      label: 'Hunyuan (Tencent)',
      provider: 'PiAPI',
      mediaType: 'video',
      costTier: 'mid',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['720p', '1080p'],
        durations: [5, 10, 15],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 80, perSecond: true, imageRef: 0 },
      summary: 'Tencent advanced video model with excellent motion understanding'
    },
    {
      id: 'piapi-omnihuman',
      label: 'OmniHuman',
      provider: 'PiAPI',
      mediaType: 'video',
      costTier: 'high',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['1080p', '4K'],
        durations: [5, 10, 15, 20],
        lipSync: true,
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 120, perSecond: true, imageRef: 0, lipSync: 40 },
      summary: 'Specialized in human video generation with native lip-sync'
    },
    {
      id: 'piapi-skyreels',
      label: 'Skyreels',
      provider: 'PiAPI',
      mediaType: 'video',
      costTier: 'high',
      capabilities: {
        aspectRatios: ['16:9', '21:9'],
        resolutions: ['1080p', '4K'],
        durations: [5, 10, 15, 20, 30],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 150, perSecond: true, imageRef: 0 },
      summary: 'Cinematic video generation with up to 4K resolution'
    },
    {
      id: 'piapi-wan-2.1',
      label: 'Wan 2.1',
      provider: 'PiAPI',
      mediaType: 'video',
      costTier: 'low',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['540p', '720p'],
        durations: [5, 10],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 40, perSecond: true, imageRef: 0 },
      summary: 'Efficient video model for quick generation'
    },
    // Imagem (2)
    {
      id: 'piapi-midjourney-v6',
      label: 'Midjourney v6',
      provider: 'PiAPI',
      mediaType: 'image',
      costTier: 'high',
      capabilities: {
        dimensions: ['1024x1024', '1792x1024', '1024x1792'],
        aspectRatios: ['1:1', '16:9', '9:16', '4:5', '5:4']
      },
      credits: { base: 40 },
      summary: 'Premium artistic image generation'
    },
    {
      id: 'piapi-gpt-image-1',
      label: 'GPT-Image-1',
      provider: 'PiAPI',
      mediaType: 'image',
      costTier: 'mid',
      capabilities: {
        dimensions: ['1024x1024', '1792x1024', '1024x1792'],
        aspectRatios: ['1:1', '16:9', '9:16']
      },
      credits: { base: 20 },
      summary: 'AI-powered image generation with good quality'
    },
    // Áudio (7)
    {
      id: 'piapi-suno-v3',
      label: 'Suno v3 (Music)',
      provider: 'PiAPI',
      mediaType: 'audio',
      costTier: 'high',
      capabilities: {
        maxCharacters: 3000
      },
      credits: { base: 200 },
      summary: 'Generate complete songs with vocals and instrumentals' // Por música
    },
    {
      id: 'piapi-diffrhythm',
      label: 'Diffrhythm',
      provider: 'PiAPI',
      mediaType: 'audio',
      costTier: 'mid',
      capabilities: {
        maxCharacters: 1000
      },
      credits: { base: 100 },
      summary: 'Instrumental music generation for background tracks' // Por faixa
    },
    {
      id: 'piapi-udio',
      label: 'Udio',
      provider: 'PiAPI',
      mediaType: 'audio',
      costTier: 'high',
      capabilities: {
        maxCharacters: 3000
      },
      credits: { base: 250 },
      summary: 'Advanced music generation with multiple vocal styles' // Por música
    },
    {
      id: 'piapi-moshi',
      label: 'Moshi',
      provider: 'PiAPI',
      mediaType: 'audio',
      costTier: 'low',
      capabilities: {
        maxCharacters: 5000
      },
      credits: { base: 30, per1kChars: true },
      summary: 'Simple and efficient text-to-speech'
    },
    {
      id: 'piapi-f5-tts',
      label: 'F5 TTS',
      provider: 'PiAPI',
      mediaType: 'audio',
      costTier: 'low',
      capabilities: {
        maxCharacters: 10000
      },
      credits: { base: 20, per1kChars: true },
      summary: 'Fast text-to-speech with Chinese support'
    },
    {
      id: 'piapi-mmaudio',
      label: 'MMAudio',
      provider: 'PiAPI',
      mediaType: 'audio',
      costTier: 'mid',
      capabilities: {
        maxCharacters: 5000
      },
      credits: { base: 50, per1kChars: true },
      summary: 'Generate sound effects and ambient audio'
    },
    {
      id: 'piapi-ace-step-ai',
      label: 'ACE Step AI',
      provider: 'PiAPI',
      mediaType: 'audio',
      costTier: 'mid',
      capabilities: {
        maxCharacters: 5000
      },
      credits: { base: 60 },
      summary: 'AI-powered music composition' // Por geração
    }
  ],

  // === NEWPORTAI (40 modelos) ===
  newport: [
    // Image Generator (1)
    {
      id: 'newport-ai-portrait',
      label: 'AI Portrait Generator',
      provider: 'NewportAI',
      mediaType: 'image',
      costTier: 'mid',
      capabilities: {
        dimensions: ['1024x1024', '1536x1536'],
        aspectRatios: ['1:1'],
        imageRef: true
      },
      credits: { base: 30, imageRef: 0 },
      summary: 'Generate professional AI portraits'
    },
    // AI Clothes Changer (4)
    {
      id: 'newport-clothing-matting',
      label: 'Clothing Matting',
      provider: 'NewportAI',
      mediaType: 'image',
      costTier: 'low',
      capabilities: {
        dimensions: ['Original'],
        imageRef: true
      },
      credits: { base: 15, imageRef: 0 },
      summary: 'Extract clothing from images precisely'
    },
    {
      id: 'newport-human-matting',
      label: 'Human Matting',
      provider: 'NewportAI',
      mediaType: 'image',
      costTier: 'low',
      capabilities: {
        dimensions: ['Original'],
        imageRef: true
      },
      credits: { base: 15, imageRef: 0 },
      summary: 'Remove backgrounds from human subjects'
    },
    {
      id: 'newport-ai-model',
      label: 'AI Model',
      provider: 'NewportAI',
      mediaType: 'image',
      costTier: 'mid',
      capabilities: {
        dimensions: ['1024x1024', '1536x1536'],
        aspectRatios: ['1:1', '3:4', '9:16'],
        imageRef: true
      },
      credits: { base: 40, imageRef: 0 },
      summary: 'Create AI fashion model images'
    },
    // Image Editor (10)
    {
      id: 'newport-remove-background',
      label: 'Remove Background',
      provider: 'NewportAI',
      mediaType: 'image',
      costTier: 'low',
      capabilities: {
        dimensions: ['Original'],
        imageRef: true
      },
      credits: { base: 10, imageRef: 0 },
      summary: 'Fast and accurate background removal'
    },
    {
      id: 'newport-replace-background',
      label: 'Replace Background',
      provider: 'NewportAI',
      mediaType: 'image',
      costTier: 'low',
      capabilities: {
        dimensions: ['Original'],
        imageRef: true
      },
      credits: { base: 20, imageRef: 0 },
      summary: 'Replace image backgrounds seamlessly'
    },
    {
      id: 'newport-enhance',
      label: 'Enhance',
      provider: 'NewportAI',
      mediaType: 'image',
      costTier: 'low',
      capabilities: {
        dimensions: ['Original', '2x', '4x'],
        imageRef: true
      },
      credits: { base: 25, imageRef: 0 },
      summary: 'Upscale and enhance image quality up to 4x'
    },
    {
      id: 'newport-colorize',
      label: 'Colorize',
      provider: 'NewportAI',
      mediaType: 'image',
      costTier: 'low',
      capabilities: {
        dimensions: ['Original'],
        imageRef: true
      },
      credits: { base: 20, imageRef: 0 },
      summary: 'Add natural colors to black and white images'
    },
    // Face Editor (2)
    {
      id: 'newport-restore-face',
      label: 'Restore Face',
      provider: 'NewportAI',
      mediaType: 'image',
      costTier: 'low',
      capabilities: {
        dimensions: ['Original'],
        imageRef: true
      },
      credits: { base: 20, imageRef: 0 },
      summary: 'Restore and enhance facial details'
    },
    // Video Generator (14)
    {
      id: 'newport-pag-merge',
      label: 'PAG Merge',
      provider: 'NewportAI',
      mediaType: 'video',
      costTier: 'mid',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['720p', '1080p'],
        durations: [5, 10],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 60, perSecond: true, imageRef: 0 },
      summary: 'Merge multiple images into video'
    },
    {
      id: 'newport-talking-image',
      label: 'Talking Image',
      provider: 'NewportAI',
      mediaType: 'video',
      costTier: 'mid',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['720p', '1080p'],
        durations: [5, 10, 15],
        imageRef: true,
        audioRef: true
      },
      credits: { base: 80, perSecond: true, imageRef: 0 },
      summary: 'Animate portraits with synchronized speech'
    },
    {
      id: 'newport-text-to-video',
      label: 'Text To Video',
      provider: 'NewportAI',
      mediaType: 'video',
      costTier: 'mid',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['720p', '1080p'],
        durations: [5, 10, 15],
        lipSyncAvailable: true
      },
      credits: { base: 70, perSecond: true },
      summary: 'Convert text descriptions into engaging videos'
    },
    {
      id: 'newport-image-to-video',
      label: 'Image To Video',
      provider: 'NewportAI',
      mediaType: 'video',
      costTier: 'mid',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['720p', '1080p'],
        durations: [5, 10],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 60, perSecond: true, imageRef: 0 },
      summary: 'Animate static images into dynamic videos'
    },
    {
      id: 'newport-character-to-video',
      label: 'Character To Video',
      provider: 'NewportAI',
      mediaType: 'video',
      costTier: 'high',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['720p', '1080p'],
        durations: [5, 10, 15],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 90, perSecond: true, imageRef: 0 },
      summary: 'Create character-driven video content'
    },
    {
      id: 'newport-image-to-video-sonic',
      label: 'Image To Video (Sonic)',
      provider: 'NewportAI',
      mediaType: 'video',
      costTier: 'low',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['540p', '720p'],
        durations: [5],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 30, imageRef: 0 },
      summary: 'Fast image animation with basic quality'
    },
    {
      id: 'newport-text-to-video-wan2',
      label: 'Text To Video (Wan2.0)',
      provider: 'NewportAI',
      mediaType: 'video',
      costTier: 'low',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['540p', '720p'],
        durations: [5, 10],
        lipSyncAvailable: true
      },
      credits: { base: 35, perSecond: true },
      summary: 'Efficient text-to-video generation'
    },
    {
      id: 'newport-image-to-video-wan2',
      label: 'Image To Video (Wan2.0)',
      provider: 'NewportAI',
      mediaType: 'video',
      costTier: 'low',
      capabilities: {
        aspectRatios: ['16:9', '1:1', '9:16'],
        resolutions: ['540p', '720p'],
        durations: [5, 10],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 40, perSecond: true, imageRef: 0 },
      summary: 'Quick image-to-video conversion'
    },
    // Text To Speech (4)
    {
      id: 'newport-do-tts-common',
      label: 'Do TTS Common',
      provider: 'NewportAI',
      mediaType: 'audio',
      costTier: 'low',
      capabilities: {
        maxCharacters: 10000
      },
      credits: { base: 20, per1kChars: true },
      summary: 'Standard TTS with Portuguese focus and 16 voices'
    },
    {
      id: 'newport-do-tts-pro',
      label: 'Do TTS Pro',
      provider: 'NewportAI',
      mediaType: 'audio',
      costTier: 'mid',
      capabilities: {
        maxCharacters: 10000
      },
      credits: { base: 40, per1kChars: true },
      summary: 'Professional TTS with 22 voices and 11 languages'
    },
    // Speech To Text (2)
    // Video Replace Background (2)
    {
      id: 'newport-composite-after-matting',
      label: 'Composite After Video Matting',
      provider: 'NewportAI',
      mediaType: 'video',
      costTier: 'mid',
      capabilities: {
        aspectRatios: ['Original'],
        resolutions: ['Original'],
        durations: [5, 10, 15, 20, 30],
        imageRef: true,
        lipSyncAvailable: true
      },
      credits: { base: 60, perSecond: true, imageRef: 0 },
      summary: 'Composite videos after background removal'
    },
    // Dashboard (1)
  ]
}

// Helper para obter todos os modelos de um tipo específico
export function getModelsByMediaType(mediaType: 'video' | 'image' | 'audio'): ModelConfig[] {
  const models: ModelConfig[] = []
  
  Object.values(ALL_MODELS).forEach(providerModels => {
    models.push(...providerModels.filter(model => model.mediaType === mediaType))
  })
  
  // Ordenar por custo (low -> mid -> high) e depois por nome
  return models.sort((a, b) => {
    const tierOrder = { low: 0, mid: 1, high: 2 }
    if (tierOrder[a.costTier] !== tierOrder[b.costTier]) {
      return tierOrder[a.costTier] - tierOrder[b.costTier]
    }
    return a.label.localeCompare(b.label)
  })
}

// Helper para obter modelos por provider
export function getModelsByProvider(provider: string): ModelConfig[] {
  return ALL_MODELS[provider] || []
}

// Helper para obter um modelo específico
export function getModelById(modelId: string): ModelConfig | undefined {
  for (const providerModels of Object.values(ALL_MODELS)) {
    const model = providerModels.find(m => m.id === modelId)
    if (model) return model
  }
  return undefined
}

// Helper para calcular custo total
export function calculateTotalCost(
  modelId: string,
  options: {
    duration?: number // segundos para vídeo
    characters?: number // caracteres para áudio
    hasImageRef?: boolean
    hasLipSync?: boolean
  }
): number {
  const model = getModelById(modelId)
  if (!model) return 0

  let cost = model.credits.base

  // Calcular por segundo (vídeo)
  if (model.credits.perSecond && options.duration) {
    cost = Math.ceil((model.credits.base * options.duration) / 5) // Base é para 5 segundos
  }

  // Calcular por 1000 caracteres (áudio)
  if (model.credits.per1kChars && options.characters) {
    const blocks = Math.ceil(options.characters / 1000)
    cost = model.credits.base * blocks
  }

  // Adicionar custo de imagem de referência
  if (options.hasImageRef && model.credits.imageRef) {
    cost += model.credits.imageRef
  }

  // Adicionar custo de lip sync
  if (options.hasLipSync) {
    // Se tem lipSync nativo, usa o custo definido
    if (model.capabilities.lipSync && model.credits.lipSync) {
      cost += model.credits.lipSync
    } 
    // Se tem lipSyncAvailable, usa a função helper
    else if (model.capabilities.lipSyncAvailable) {
      cost += getLipSyncCost(model)
    }
  }

  return cost
}

// Audio capabilities por modelo específico
export const AUDIO_CAPABILITIES = {
  'elevenlabs-v3': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' },
      { value: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
      { value: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
      { value: 'LcfcDJNUP1GQjkzn1xUU', label: 'Emily' },
      { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli' },
      { value: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
      { value: 'ODq5zmih8GrVes37Dizd', label: 'Patrick' },
      { value: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
      { value: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
      { value: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy' },
      { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
      { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
      { value: 'XB0fDUnXU5powFXDhCwa', label: 'Charlotte' },
      { value: 'XrExE9yKIg1WjnnlVkGX', label: 'Alice' },
      { value: 'Yko7PKHZNXotIFUBG7I9', label: 'Daniel' },
      { value: 'ZQe5CZNOzWyzPSCn5a3c', label: 'Matilda' },
      { value: 'Zlb1dXrM653N07WRdFW3', label: 'Lily' },
      { value: 'bVMeCyTHy58xNoL34h3p', label: 'Jeremy' },
      { value: 'flq6f7yk4E4fJM5XTYuZ', label: 'Michael' },
      { value: 'g5CIjZEefAph4nQFvHAz', label: 'Ethan' },
      { value: 'jBpfuIE2acCO8z3wKNLl', label: 'Gigi' },
      { value: 'jsCqWAovK2LkecY7zXl4', label: 'Freya' },
      { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
      { value: 'oWAxZDx7w5VEj9dCyTzz', label: 'Grace' },
      { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Serena' },
      { value: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
      { value: 'pMsXgVXv3BLzUgSXRplE', label: 'Sarah' },
      { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
      { value: 'piTKgcLEGmPE4e6mEKli', label: 'Nicole' },
      { value: 't0jbNlBVZ17f02VDIeMI', label: 'Jessie' },
      { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam' },
      { value: 'z9fAnlkpzviPz146aGWa', label: 'Glinda' },
      { value: 'zcAOhNBS3c14rBihAFp1', label: 'Giovanni' },
      { value: 'zrHiDhphv9ZnVXBqCLjz', label: 'Mimi' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'ar', label: 'Arabic' },
      { value: 'bg', label: 'Bulgarian' },
      { value: 'zh', label: 'Chinese' },
      { value: 'hr', label: 'Croatian' },
      { value: 'cs', label: 'Czech' },
      { value: 'da', label: 'Danish' },
      { value: 'nl', label: 'Dutch' },
      { value: 'fil', label: 'Filipino' },
      { value: 'fi', label: 'Finnish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'el', label: 'Greek' },
      { value: 'hi', label: 'Hindi' },
      { value: 'id', label: 'Indonesian' },
      { value: 'it', label: 'Italian' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ko', label: 'Korean' },
      { value: 'ms', label: 'Malay' },
      { value: 'pl', label: 'Polish' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'ro', label: 'Romanian' },
      { value: 'ru', label: 'Russian' },
      { value: 'sk', label: 'Slovak' },
      { value: 'es', label: 'Spanish' },
      { value: 'sv', label: 'Swedish' },
      { value: 'ta', label: 'Tamil' },
      { value: 'tr', label: 'Turkish' },
      { value: 'uk', label: 'Ukrainian' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-english-v1': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' },
      { value: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
      { value: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
      { value: 'LcfcDJNUP1GQjkzn1xUU', label: 'Emily' },
      { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli' },
      { value: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
      { value: 'ODq5zmih8GrVes37Dizd', label: 'Patrick' },
      { value: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
      { value: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
      { value: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy' },
      { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
      { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
      { value: 'XB0fDUnXU5powFXDhCwa', label: 'Charlotte' },
      { value: 'XrExE9yKIg1WjnnlVkGX', label: 'Alice' },
      { value: 'Yko7PKHZNXotIFUBG7I9', label: 'Daniel' },
      { value: 'ZQe5CZNOzWyzPSCn5a3c', label: 'Matilda' },
      { value: 'Zlb1dXrM653N07WRdFW3', label: 'Lily' },
      { value: 'bVMeCyTHy58xNoL34h3p', label: 'Jeremy' },
      { value: 'flq6f7yk4E4fJM5XTYuZ', label: 'Michael' },
      { value: 'g5CIjZEefAph4nQFvHAz', label: 'Ethan' },
      { value: 'jBpfuIE2acCO8z3wKNLl', label: 'Gigi' },
      { value: 'jsCqWAovK2LkecY7zXl4', label: 'Freya' },
      { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
      { value: 'oWAxZDx7w5VEj9dCyTzz', label: 'Grace' },
      { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Serena' },
      { value: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
      { value: 'pMsXgVXv3BLzUgSXRplE', label: 'Sarah' },
      { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
      { value: 'piTKgcLEGmPE4e6mEKli', label: 'Nicole' },
      { value: 't0jbNlBVZ17f02VDIeMI', label: 'Jessie' },
      { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam' },
      { value: 'z9fAnlkpzviPz146aGWa', label: 'Glinda' },
      { value: 'zcAOhNBS3c14rBihAFp1', label: 'Giovanni' },
      { value: 'zrHiDhphv9ZnVXBqCLjz', label: 'Mimi' }
    ],
    languages: [
      { value: 'en', label: 'English' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-multilingual-v1': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' },
      { value: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
      { value: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
      { value: 'LcfcDJNUP1GQjkzn1xUU', label: 'Emily' },
      { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli' },
      { value: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
      { value: 'ODq5zmih8GrVes37Dizd', label: 'Patrick' },
      { value: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
      { value: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
      { value: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy' },
      { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
      { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
      { value: 'XB0fDUnXU5powFXDhCwa', label: 'Charlotte' },
      { value: 'XrExE9yKIg1WjnnlVkGX', label: 'Alice' },
      { value: 'Yko7PKHZNXotIFUBG7I9', label: 'Daniel' },
      { value: 'ZQe5CZNOzWyzPSCn5a3c', label: 'Matilda' },
      { value: 'Zlb1dXrM653N07WRdFW3', label: 'Lily' },
      { value: 'bVMeCyTHy58xNoL34h3p', label: 'Jeremy' },
      { value: 'flq6f7yk4E4fJM5XTYuZ', label: 'Michael' },
      { value: 'g5CIjZEefAph4nQFvHAz', label: 'Ethan' },
      { value: 'jBpfuIE2acCO8z3wKNLl', label: 'Gigi' },
      { value: 'jsCqWAovK2LkecY7zXl4', label: 'Freya' },
      { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
      { value: 'oWAxZDx7w5VEj9dCyTzz', label: 'Grace' },
      { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Serena' },
      { value: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
      { value: 'pMsXgVXv3BLzUgSXRplE', label: 'Sarah' },
      { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
      { value: 'piTKgcLEGmPE4e6mEKli', label: 'Nicole' },
      { value: 't0jbNlBVZ17f02VDIeMI', label: 'Jessie' },
      { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam' },
      { value: 'z9fAnlkpzviPz146aGWa', label: 'Glinda' },
      { value: 'zcAOhNBS3c14rBihAFp1', label: 'Giovanni' },
      { value: 'zrHiDhphv9ZnVXBqCLjz', label: 'Mimi' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'ja', label: 'Japanese' },
      { value: 'zh', label: 'Chinese' },
      { value: 'de', label: 'German' },
      { value: 'hi', label: 'Hindi' },
      { value: 'fr', label: 'French' },
      { value: 'ko', label: 'Korean' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'it', label: 'Italian' },
      { value: 'es', label: 'Spanish' },
      { value: 'id', label: 'Indonesian' },
      { value: 'nl', label: 'Dutch' },
      { value: 'tr', label: 'Turkish' },
      { value: 'pl', label: 'Polish' },
      { value: 'sv', label: 'Swedish' },
      { value: 'fil', label: 'Filipino' },
      { value: 'ms', label: 'Malay' },
      { value: 'ro', label: 'Romanian' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-multilingual-v2': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' },
      { value: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
      { value: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
      { value: 'LcfcDJNUP1GQjkzn1xUU', label: 'Emily' },
      { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli' },
      { value: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
      { value: 'ODq5zmih8GrVes37Dizd', label: 'Patrick' },
      { value: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
      { value: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
      { value: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy' },
      { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
      { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
      { value: 'XB0fDUnXU5powFXDhCwa', label: 'Charlotte' },
      { value: 'XrExE9yKIg1WjnnlVkGX', label: 'Alice' },
      { value: 'Yko7PKHZNXotIFUBG7I9', label: 'Daniel' },
      { value: 'ZQe5CZNOzWyzPSCn5a3c', label: 'Matilda' },
      { value: 'Zlb1dXrM653N07WRdFW3', label: 'Lily' },
      { value: 'bVMeCyTHy58xNoL34h3p', label: 'Jeremy' },
      { value: 'flq6f7yk4E4fJM5XTYuZ', label: 'Michael' },
      { value: 'g5CIjZEefAph4nQFvHAz', label: 'Ethan' },
      { value: 'jBpfuIE2acCO8z3wKNLl', label: 'Gigi' },
      { value: 'jsCqWAovK2LkecY7zXl4', label: 'Freya' },
      { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
      { value: 'oWAxZDx7w5VEj9dCyTzz', label: 'Grace' },
      { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Serena' },
      { value: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
      { value: 'pMsXgVXv3BLzUgSXRplE', label: 'Sarah' },
      { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
      { value: 'piTKgcLEGmPE4e6mEKli', label: 'Nicole' },
      { value: 't0jbNlBVZ17f02VDIeMI', label: 'Jessie' },
      { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam' },
      { value: 'z9fAnlkpzviPz146aGWa', label: 'Glinda' },
      { value: 'zcAOhNBS3c14rBihAFp1', label: 'Giovanni' },
      { value: 'zrHiDhphv9ZnVXBqCLjz', label: 'Mimi' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'ar', label: 'Arabic' },
      { value: 'bg', label: 'Bulgarian' },
      { value: 'zh', label: 'Chinese' },
      { value: 'hr', label: 'Croatian' },
      { value: 'cs', label: 'Czech' },
      { value: 'da', label: 'Danish' },
      { value: 'nl', label: 'Dutch' },
      { value: 'fil', label: 'Filipino' },
      { value: 'fi', label: 'Finnish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'el', label: 'Greek' },
      { value: 'hi', label: 'Hindi' },
      { value: 'id', label: 'Indonesian' },
      { value: 'it', label: 'Italian' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ko', label: 'Korean' },
      { value: 'ms', label: 'Malay' },
      { value: 'pl', label: 'Polish' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'ro', label: 'Romanian' },
      { value: 'ru', label: 'Russian' },
      { value: 'sk', label: 'Slovak' },
      { value: 'es', label: 'Spanish' },
      { value: 'sv', label: 'Swedish' },
      { value: 'ta', label: 'Tamil' },
      { value: 'tr', label: 'Turkish' },
      { value: 'uk', label: 'Ukrainian' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' },
      { value: 'pcm_16000', label: 'PCM (16kHz)' },
      { value: 'pcm_22050', label: 'PCM (22kHz)' },
      { value: 'pcm_24000', label: 'PCM (24kHz)' },
      { value: 'pcm_44100', label: 'PCM (44.1kHz)' }
    ]
  },
  'elevenlabs-turbo-v2': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' },
      { value: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
      { value: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
      { value: 'LcfcDJNUP1GQjkzn1xUU', label: 'Emily' },
      { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli' },
      { value: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
      { value: 'ODq5zmih8GrVes37Dizd', label: 'Patrick' },
      { value: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
      { value: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
      { value: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy' },
      { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
      { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
      { value: 'XB0fDUnXU5powFXDhCwa', label: 'Charlotte' },
      { value: 'XrExE9yKIg1WjnnlVkGX', label: 'Alice' },
      { value: 'Yko7PKHZNXotIFUBG7I9', label: 'Daniel' },
      { value: 'ZQe5CZNOzWyzPSCn5a3c', label: 'Matilda' },
      { value: 'Zlb1dXrM653N07WRdFW3', label: 'Lily' },
      { value: 'bVMeCyTHy58xNoL34h3p', label: 'Jeremy' },
      { value: 'flq6f7yk4E4fJM5XTYuZ', label: 'Michael' },
      { value: 'g5CIjZEefAph4nQFvHAz', label: 'Ethan' },
      { value: 'jBpfuIE2acCO8z3wKNLl', label: 'Gigi' },
      { value: 'jsCqWAovK2LkecY7zXl4', label: 'Freya' },
      { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
      { value: 'oWAxZDx7w5VEj9dCyTzz', label: 'Grace' },
      { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Serena' },
      { value: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
      { value: 'pMsXgVXv3BLzUgSXRplE', label: 'Sarah' },
      { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
      { value: 'piTKgcLEGmPE4e6mEKli', label: 'Nicole' },
      { value: 't0jbNlBVZ17f02VDIeMI', label: 'Jessie' },
      { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam' },
      { value: 'z9fAnlkpzviPz146aGWa', label: 'Glinda' },
      { value: 'zcAOhNBS3c14rBihAFp1', label: 'Giovanni' },
      { value: 'zrHiDhphv9ZnVXBqCLjz', label: 'Mimi' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'de', label: 'German' },
      { value: 'pl', label: 'Polish' },
      { value: 'es', label: 'Spanish' },
      { value: 'it', label: 'Italian' },
      { value: 'fr', label: 'French' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'hi', label: 'Hindi' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-turbo-v2.5': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' },
      { value: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
      { value: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
      { value: 'LcfcDJNUP1GQjkzn1xUU', label: 'Emily' },
      { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli' },
      { value: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
      { value: 'ODq5zmih8GrVes37Dizd', label: 'Patrick' },
      { value: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
      { value: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
      { value: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy' },
      { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
      { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
      { value: 'XB0fDUnXU5powFXDhCwa', label: 'Charlotte' },
      { value: 'XrExE9yKIg1WjnnlVkGX', label: 'Alice' },
      { value: 'Yko7PKHZNXotIFUBG7I9', label: 'Daniel' },
      { value: 'ZQe5CZNOzWyzPSCn5a3c', label: 'Matilda' },
      { value: 'Zlb1dXrM653N07WRdFW3', label: 'Lily' },
      { value: 'bVMeCyTHy58xNoL34h3p', label: 'Jeremy' },
      { value: 'flq6f7yk4E4fJM5XTYuZ', label: 'Michael' },
      { value: 'g5CIjZEefAph4nQFvHAz', label: 'Ethan' },
      { value: 'jBpfuIE2acCO8z3wKNLl', label: 'Gigi' },
      { value: 'jsCqWAovK2LkecY7zXl4', label: 'Freya' },
      { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
      { value: 'oWAxZDx7w5VEj9dCyTzz', label: 'Grace' },
      { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Serena' },
      { value: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
      { value: 'pMsXgVXv3BLzUgSXRplE', label: 'Sarah' },
      { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
      { value: 'piTKgcLEGmPE4e6mEKli', label: 'Nicole' },
      { value: 't0jbNlBVZ17f02VDIeMI', label: 'Jessie' },
      { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam' },
      { value: 'z9fAnlkpzviPz146aGWa', label: 'Glinda' },
      { value: 'zcAOhNBS3c14rBihAFp1', label: 'Giovanni' },
      { value: 'zrHiDhphv9ZnVXBqCLjz', label: 'Mimi' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'de', label: 'German' },
      { value: 'pl', label: 'Polish' },
      { value: 'es', label: 'Spanish' },
      { value: 'it', label: 'Italian' },
      { value: 'fr', label: 'French' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'hi', label: 'Hindi' },
      { value: 'ar', label: 'Arabic' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-flash': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' }
    ],
    languages: [
      { value: 'en', label: 'English' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' }
    ]
  },
  'elevenlabs-flash-v2.5': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' }
    ],
    languages: [
      { value: 'en', label: 'English' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  // PiAPI models
  'piapi-suno-v3': {
    voices: [
      { value: 'male-pop', label: 'Male Pop' },
      { value: 'female-pop', label: 'Female Pop' },
      { value: 'male-rock', label: 'Male Rock' },
      { value: 'female-rock', label: 'Female Rock' },
      { value: 'male-jazz', label: 'Male Jazz' },
      { value: 'female-jazz', label: 'Female Jazz' },
      { value: 'choir', label: 'Choir' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'zh', label: 'Chinese' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ko', label: 'Korean' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'it', label: 'Italian' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'ru', label: 'Russian' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' }
    ]
  },
  'piapi-diffrhythm': {
    voices: [
      { value: 'instrumental', label: 'Instrumental Only' }
    ],
    languages: [
      { value: 'none', label: 'No Language (Instrumental)' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' }
    ]
  },
  'piapi-udio': {
    voices: [
      { value: 'auto', label: 'Auto-Select' },
      { value: 'male-vocal', label: 'Male Vocal' },
      { value: 'female-vocal', label: 'Female Vocal' },
      { value: 'duet', label: 'Duet' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'it', label: 'Italian' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ko', label: 'Korean' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' }
    ]
  },
  'piapi-moshi': {
    voices: [
      { value: 'sarah', label: 'Sarah' },
      { value: 'michael', label: 'Michael' },
      { value: 'emily', label: 'Emily' },
      { value: 'kevin', label: 'Kevin' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'fr', label: 'French' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' }
    ]
  },
  'piapi-f5-tts': {
    voices: [
      { value: 'voice1', label: 'Voice 1' },
      { value: 'voice2', label: 'Voice 2' },
      { value: 'voice3', label: 'Voice 3' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'zh', label: 'Chinese' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' }
    ]
  },
  'piapi-mmaudio': {
    voices: [
      { value: 'descriptive', label: 'Descriptive Audio' }
    ],
    languages: [
      { value: 'none', label: 'No Language (Sound Effects)' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' }
    ]
  },
  'piapi-ace-step-ai': {
    voices: [
      { value: 'instrumental', label: 'Instrumental' }
    ],
    languages: [
      { value: 'none', label: 'No Language (Music)' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' }
    ]
  },
  // Newport models
  'newport-do-tts-common': {
    voices: [
      { value: 'pt-BR-Francisca', label: 'Francisca' },
      { value: 'pt-BR-AntonioNeural', label: 'Antonio' },
      { value: 'pt-BR-BrendaNeural', label: 'Brenda' },
      { value: 'pt-BR-DonatoNeural', label: 'Donato' },
      { value: 'pt-BR-ElzaNeural', label: 'Elza' },
      { value: 'pt-BR-FabioNeural', label: 'Fabio' },
      { value: 'pt-BR-GiovannaNeural', label: 'Giovanna' },
      { value: 'pt-BR-HumbertoNeural', label: 'Humberto' },
      { value: 'pt-BR-JulioNeural', label: 'Julio' },
      { value: 'pt-BR-LeilaNeural', label: 'Leila' },
      { value: 'pt-BR-LeticiaNeural', label: 'Leticia' },
      { value: 'pt-BR-ManuelaNeural', label: 'Manuela' },
      { value: 'pt-BR-NicolauNeural', label: 'Nicolau' },
      { value: 'pt-BR-ThalitaNeural', label: 'Thalita' },
      { value: 'pt-BR-ValerioNeural', label: 'Valerio' },
      { value: 'pt-BR-YaraNeural', label: 'Yara' }
    ],
    languages: [
      { value: 'pt-BR', label: 'Portuguese (Brazil)' },
      { value: 'en-US', label: 'English (US)' },
      { value: 'es-ES', label: 'Spanish (Spain)' },
      { value: 'fr-FR', label: 'French' },
      { value: 'de-DE', label: 'German' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' }
    ]
  },
  'newport-do-tts-pro': {
    voices: [
      { value: 'pt-BR-Francisca', label: 'Francisca' },
      { value: 'pt-BR-AntonioNeural', label: 'Antonio' },
      { value: 'pt-BR-BrendaNeural', label: 'Brenda' },
      { value: 'pt-BR-DonatoNeural', label: 'Donato' },
      { value: 'pt-BR-ElzaNeural', label: 'Elza' },
      { value: 'pt-BR-FabioNeural', label: 'Fabio' },
      { value: 'pt-BR-GiovannaNeural', label: 'Giovanna' },
      { value: 'pt-BR-HumbertoNeural', label: 'Humberto' },
      { value: 'pt-BR-JulioNeural', label: 'Julio' },
      { value: 'pt-BR-LeilaNeural', label: 'Leila' },
      { value: 'pt-BR-LeticiaNeural', label: 'Leticia' },
      { value: 'pt-BR-ManuelaNeural', label: 'Manuela' },
      { value: 'pt-BR-NicolauNeural', label: 'Nicolau' },
      { value: 'pt-BR-ThalitaNeural', label: 'Thalita' },
      { value: 'pt-BR-ValerioNeural', label: 'Valerio' },
      { value: 'pt-BR-YaraNeural', label: 'Yara' },
      { value: 'en-US-JennyNeural', label: 'Jenny (US)' },
      { value: 'en-US-GuyNeural', label: 'Guy (US)' },
      { value: 'en-US-AriaNeural', label: 'Aria (US)' },
      { value: 'en-US-DavisNeural', label: 'Davis (US)' },
      { value: 'es-ES-ElviraNeural', label: 'Elvira (Spain)' },
      { value: 'es-ES-AlvaroNeural', label: 'Alvaro (Spain)' }
    ],
    languages: [
      { value: 'pt-BR', label: 'Portuguese (Brazil)' },
      { value: 'en-US', label: 'English (US)' },
      { value: 'en-GB', label: 'English (UK)' },
      { value: 'es-ES', label: 'Spanish (Spain)' },
      { value: 'es-MX', label: 'Spanish (Mexico)' },
      { value: 'fr-FR', label: 'French' },
      { value: 'de-DE', label: 'German' },
      { value: 'it-IT', label: 'Italian' },
      { value: 'zh-CN', label: 'Chinese (Simplified)' },
      { value: 'ja-JP', label: 'Japanese' },
      { value: 'ko-KR', label: 'Korean' }
    ],
    formats: [
      { value: 'mp3', label: 'MP3' },
      { value: 'wav', label: 'WAV' }
    ]
  }
,
  'elevenlabs-english-v1': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' },
      { value: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
      { value: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
      { value: 'LcfcDJNUP1GQjkzn1xUU', label: 'Emily' },
      { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli' },
      { value: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
      { value: 'ODq5zmih8GrVes37Dizd', label: 'Patrick' },
      { value: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
      { value: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
      { value: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy' },
      { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
      { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
      { value: 'XB0fDUnXU5powFXDhCwa', label: 'Charlotte' },
      { value: 'XrExE9yKIg1WjnnlVkGX', label: 'Alice' },
      { value: 'Yko7PKHZNXotIFUBG7I9', label: 'Daniel' },
      { value: 'ZQe5CZNOzWyzPSCn5a3c', label: 'Matilda' },
      { value: 'Zlb1dXrM653N07WRdFW3', label: 'Lily' },
      { value: 'bVMeCyTHy58xNoL34h3p', label: 'Jeremy' },
      { value: 'flq6f7yk4E4fJM5XTYuZ', label: 'Michael' },
      { value: 'g5CIjZEefAph4nQFvHAz', label: 'Ethan' },
      { value: 'jBpfuIE2acCO8z3wKNLl', label: 'Gigi' },
      { value: 'jsCqWAovK2LkecY7zXl4', label: 'Freya' },
      { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
      { value: 'oWAxZDx7w5VEj9dCyTzz', label: 'Grace' },
      { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Serena' },
      { value: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
      { value: 'pMsXgVXv3BLzUgSXRplE', label: 'Sarah' },
      { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
      { value: 'piTKgcLEGmPE4e6mEKli', label: 'Nicole' },
      { value: 't0jbNlBVZ17f02VDIeMI', label: 'Jessie' },
      { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam' },
      { value: 'z9fAnlkpzviPz146aGWa', label: 'Glinda' },
      { value: 'zcAOhNBS3c14rBihAFp1', label: 'Giovanni' },
      { value: 'zrHiDhphv9ZnVXBqCLjz', label: 'Mimi' }
    ],
    languages: [
      { value: 'en', label: 'English' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-multilingual-v1': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' },
      { value: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
      { value: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
      { value: 'LcfcDJNUP1GQjkzn1xUU', label: 'Emily' },
      { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli' },
      { value: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
      { value: 'ODq5zmih8GrVes37Dizd', label: 'Patrick' },
      { value: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
      { value: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
      { value: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy' },
      { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
      { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
      { value: 'XB0fDUnXU5powFXDhCwa', label: 'Charlotte' },
      { value: 'XrExE9yKIg1WjnnlVkGX', label: 'Alice' },
      { value: 'Yko7PKHZNXotIFUBG7I9', label: 'Daniel' },
      { value: 'ZQe5CZNOzWyzPSCn5a3c', label: 'Matilda' },
      { value: 'Zlb1dXrM653N07WRdFW3', label: 'Lily' },
      { value: 'bVMeCyTHy58xNoL34h3p', label: 'Jeremy' },
      { value: 'flq6f7yk4E4fJM5XTYuZ', label: 'Michael' },
      { value: 'g5CIjZEefAph4nQFvHAz', label: 'Ethan' },
      { value: 'jBpfuIE2acCO8z3wKNLl', label: 'Gigi' },
      { value: 'jsCqWAovK2LkecY7zXl4', label: 'Freya' },
      { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
      { value: 'oWAxZDx7w5VEj9dCyTzz', label: 'Grace' },
      { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Serena' },
      { value: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
      { value: 'pMsXgVXv3BLzUgSXRplE', label: 'Sarah' },
      { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
      { value: 'piTKgcLEGmPE4e6mEKli', label: 'Nicole' },
      { value: 't0jbNlBVZ17f02VDIeMI', label: 'Jessie' },
      { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam' },
      { value: 'z9fAnlkpzviPz146aGWa', label: 'Glinda' },
      { value: 'zcAOhNBS3c14rBihAFp1', label: 'Giovanni' },
      { value: 'zrHiDhphv9ZnVXBqCLjz', label: 'Mimi' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'es', label: 'Spanish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'it', label: 'Italian' },
      { value: 'pl', label: 'Polish' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'ru', label: 'Russian' },
      { value: 'nl', label: 'Dutch' },
      { value: 'tr', label: 'Turkish' },
      { value: 'sv', label: 'Swedish' },
      { value: 'id', label: 'Indonesian' },
      { value: 'fil', label: 'Filipino' },
      { value: 'ja', label: 'Japanese' },
      { value: 'uk', label: 'Ukrainian' },
      { value: 'el', label: 'Greek' },
      { value: 'cs', label: 'Czech' },
      { value: 'fi', label: 'Finnish' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-v3': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' },
      { value: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
      { value: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
      { value: 'LcfcDJNUP1GQjkzn1xUU', label: 'Emily' },
      { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli' },
      { value: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
      { value: 'ODq5zmih8GrVes37Dizd', label: 'Patrick' },
      { value: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
      { value: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
      { value: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy' },
      { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
      { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
      { value: 'XB0fDUnXU5powFXDhCwa', label: 'Charlotte' },
      { value: 'XrExE9yKIg1WjnnlVkGX', label: 'Alice' },
      { value: 'Yko7PKHZNXotIFUBG7I9', label: 'Daniel' },
      { value: 'ZQe5CZNOzWyzPSCn5a3c', label: 'Matilda' },
      { value: 'Zlb1dXrM653N07WRdFW3', label: 'Lily' },
      { value: 'bVMeCyTHy58xNoL34h3p', label: 'Jeremy' },
      { value: 'flq6f7yk4E4fJM5XTYuZ', label: 'Michael' },
      { value: 'g5CIjZEefAph4nQFvHAz', label: 'Ethan' },
      { value: 'jBpfuIE2acCO8z3wKNLl', label: 'Gigi' },
      { value: 'jsCqWAovK2LkecY7zXl4', label: 'Freya' },
      { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
      { value: 'oWAxZDx7w5VEj9dCyTzz', label: 'Grace' },
      { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Serena' },
      { value: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
      { value: 'pMsXgVXv3BLzUgSXRplE', label: 'Sarah' },
      { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
      { value: 'piTKgcLEGmPE4e6mEKli', label: 'Nicole' },
      { value: 't0jbNlBVZ17f02VDIeMI', label: 'Jessie' },
      { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam' },
      { value: 'z9fAnlkpzviPz146aGWa', label: 'Glinda' },
      { value: 'zcAOhNBS3c14rBihAFp1', label: 'Giovanni' },
      { value: 'zrHiDhphv9ZnVXBqCLjz', label: 'Mimi' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'ar', label: 'Arabic' },
      { value: 'bg', label: 'Bulgarian' },
      { value: 'zh', label: 'Chinese' },
      { value: 'hr', label: 'Croatian' },
      { value: 'cs', label: 'Czech' },
      { value: 'da', label: 'Danish' },
      { value: 'nl', label: 'Dutch' },
      { value: 'fil', label: 'Filipino' },
      { value: 'fi', label: 'Finnish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'el', label: 'Greek' },
      { value: 'hi', label: 'Hindi' },
      { value: 'id', label: 'Indonesian' },
      { value: 'it', label: 'Italian' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ko', label: 'Korean' },
      { value: 'ms', label: 'Malay' },
      { value: 'pl', label: 'Polish' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'ro', label: 'Romanian' },
      { value: 'ru', label: 'Russian' },
      { value: 'sk', label: 'Slovak' },
      { value: 'es', label: 'Spanish' },
      { value: 'sv', label: 'Swedish' },
      { value: 'ta', label: 'Tamil' },
      { value: 'tr', label: 'Turkish' },
      { value: 'uk', label: 'Ukrainian' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' },
      { value: 'pcm_16000', label: 'PCM (16kHz)' },
      { value: 'pcm_44100', label: 'PCM (44.1kHz)' }
    ]
  },
  'elevenlabs-flash': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' }
    ],
    languages: [
      { value: 'en', label: 'English' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' }
    ]
  },
  'elevenlabs-flash-v2.5': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' }
    ],
    languages: [
      { value: 'en', label: 'English' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-multilingual-v2': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' },
      { value: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
      { value: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
      { value: 'LcfcDJNUP1GQjkzn1xUU', label: 'Emily' },
      { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli' },
      { value: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
      { value: 'ODq5zmih8GrVes37Dizd', label: 'Patrick' },
      { value: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
      { value: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
      { value: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy' },
      { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
      { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
      { value: 'XB0fDUnXU5powFXDhCwa', label: 'Charlotte' },
      { value: 'XrExE9yKIg1WjnnlVkGX', label: 'Alice' },
      { value: 'Yko7PKHZNXotIFUBG7I9', label: 'Daniel' },
      { value: 'ZQe5CZNOzWyzPSCn5a3c', label: 'Matilda' },
      { value: 'Zlb1dXrM653N07WRdFW3', label: 'Lily' },
      { value: 'bVMeCyTHy58xNoL34h3p', label: 'Jeremy' },
      { value: 'flq6f7yk4E4fJM5XTYuZ', label: 'Michael' },
      { value: 'g5CIjZEefAph4nQFvHAz', label: 'Ethan' },
      { value: 'jBpfuIE2acCO8z3wKNLl', label: 'Gigi' },
      { value: 'jsCqWAovK2LkecY7zXl4', label: 'Freya' },
      { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
      { value: 'oWAxZDx7w5VEj9dCyTzz', label: 'Grace' },
      { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Serena' },
      { value: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
      { value: 'pMsXgVXv3BLzUgSXRplE', label: 'Sarah' },
      { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
      { value: 'piTKgcLEGmPE4e6mEKli', label: 'Nicole' },
      { value: 't0jbNlBVZ17f02VDIeMI', label: 'Jessie' },
      { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam' },
      { value: 'z9fAnlkpzviPz146aGWa', label: 'Glinda' },
      { value: 'zcAOhNBS3c14rBihAFp1', label: 'Giovanni' },
      { value: 'zrHiDhphv9ZnVXBqCLjz', label: 'Mimi' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'ar', label: 'Arabic' },
      { value: 'bg', label: 'Bulgarian' },
      { value: 'zh', label: 'Chinese' },
      { value: 'hr', label: 'Croatian' },
      { value: 'cs', label: 'Czech' },
      { value: 'da', label: 'Danish' },
      { value: 'nl', label: 'Dutch' },
      { value: 'fil', label: 'Filipino' },
      { value: 'fi', label: 'Finnish' },
      { value: 'fr', label: 'French' },
      { value: 'de', label: 'German' },
      { value: 'el', label: 'Greek' },
      { value: 'hi', label: 'Hindi' },
      { value: 'id', label: 'Indonesian' },
      { value: 'it', label: 'Italian' },
      { value: 'ja', label: 'Japanese' },
      { value: 'ko', label: 'Korean' },
      { value: 'ms', label: 'Malay' },
      { value: 'pl', label: 'Polish' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'ro', label: 'Romanian' },
      { value: 'ru', label: 'Russian' },
      { value: 'sk', label: 'Slovak' },
      { value: 'es', label: 'Spanish' },
      { value: 'sv', label: 'Swedish' },
      { value: 'ta', label: 'Tamil' },
      { value: 'tr', label: 'Turkish' },
      { value: 'uk', label: 'Ukrainian' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' },
      { value: 'pcm_16000', label: 'PCM (16kHz)' },
      { value: 'pcm_22050', label: 'PCM (22kHz)' },
      { value: 'pcm_24000', label: 'PCM (24kHz)' },
      { value: 'pcm_44100', label: 'PCM (44.1kHz)' }
    ]
  },
  'elevenlabs-turbo-v2': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' },
      { value: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
      { value: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
      { value: 'LcfcDJNUP1GQjkzn1xUU', label: 'Emily' },
      { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli' },
      { value: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
      { value: 'ODq5zmih8GrVes37Dizd', label: 'Patrick' },
      { value: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
      { value: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
      { value: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy' },
      { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
      { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
      { value: 'XB0fDUnXU5powFXDhCwa', label: 'Charlotte' },
      { value: 'XrExE9yKIg1WjnnlVkGX', label: 'Alice' },
      { value: 'Yko7PKHZNXotIFUBG7I9', label: 'Daniel' },
      { value: 'ZQe5CZNOzWyzPSCn5a3c', label: 'Matilda' },
      { value: 'Zlb1dXrM653N07WRdFW3', label: 'Lily' },
      { value: 'bVMeCyTHy58xNoL34h3p', label: 'Jeremy' },
      { value: 'flq6f7yk4E4fJM5XTYuZ', label: 'Michael' },
      { value: 'g5CIjZEefAph4nQFvHAz', label: 'Ethan' },
      { value: 'jBpfuIE2acCO8z3wKNLl', label: 'Gigi' },
      { value: 'jsCqWAovK2LkecY7zXl4', label: 'Freya' },
      { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
      { value: 'oWAxZDx7w5VEj9dCyTzz', label: 'Grace' },
      { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Serena' },
      { value: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
      { value: 'pMsXgVXv3BLzUgSXRplE', label: 'Sarah' },
      { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
      { value: 'piTKgcLEGmPE4e6mEKli', label: 'Nicole' },
      { value: 't0jbNlBVZ17f02VDIeMI', label: 'Jessie' },
      { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam' },
      { value: 'z9fAnlkpzviPz146aGWa', label: 'Glinda' },
      { value: 'zcAOhNBS3c14rBihAFp1', label: 'Giovanni' },
      { value: 'zrHiDhphv9ZnVXBqCLjz', label: 'Mimi' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'de', label: 'German' },
      { value: 'pl', label: 'Polish' },
      { value: 'es', label: 'Spanish' },
      { value: 'it', label: 'Italian' },
      { value: 'fr', label: 'French' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'hi', label: 'Hindi' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
  'elevenlabs-turbo-v2.5': {
    voices: [
      { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel' },
      { value: '29vD33N1CtxCmqQRPOHJ', label: 'Drew' },
      { value: '2EiwWnXFnvU5JabPnv8n', label: 'Clyde' },
      { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul' },
      { value: 'AZnzlk1XvdvUeBnXmlld', label: 'Domi' },
      { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave' },
      { value: 'D38z5RcWu1voky8WS1ja', label: 'Fin' },
      { value: 'EXAVITQu4vr4xnSDxMaL', label: 'Bella' },
      { value: 'ErXwobaYiN019PkySvjV', label: 'Antoni' },
      { value: 'GBv7mTt0atIp3Br8iCZE', label: 'Thomas' },
      { value: 'IKne3meq5aSn9XLyUdCD', label: 'Charlie' },
      { value: 'JBFqnCBsd6RMkjVDRZzb', label: 'George' },
      { value: 'LcfcDJNUP1GQjkzn1xUU', label: 'Emily' },
      { value: 'MF3mGyEYCl7XYWbV9V6O', label: 'Elli' },
      { value: 'N2lVS1w4EtoT3dr4eOWO', label: 'Callum' },
      { value: 'ODq5zmih8GrVes37Dizd', label: 'Patrick' },
      { value: 'SOYHLrjzK2X1ezoPC6cr', label: 'Harry' },
      { value: 'TX3LPaxmHKxFdv7VOQHJ', label: 'Liam' },
      { value: 'ThT5KcBeYPX3keUQqHPh', label: 'Dorothy' },
      { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'Josh' },
      { value: 'VR6AewLTigWG4xSOukaG', label: 'Arnold' },
      { value: 'XB0fDUnXU5powFXDhCwa', label: 'Charlotte' },
      { value: 'XrExE9yKIg1WjnnlVkGX', label: 'Alice' },
      { value: 'Yko7PKHZNXotIFUBG7I9', label: 'Daniel' },
      { value: 'ZQe5CZNOzWyzPSCn5a3c', label: 'Matilda' },
      { value: 'Zlb1dXrM653N07WRdFW3', label: 'Lily' },
      { value: 'bVMeCyTHy58xNoL34h3p', label: 'Jeremy' },
      { value: 'flq6f7yk4E4fJM5XTYuZ', label: 'Michael' },
      { value: 'g5CIjZEefAph4nQFvHAz', label: 'Ethan' },
      { value: 'jBpfuIE2acCO8z3wKNLl', label: 'Gigi' },
      { value: 'jsCqWAovK2LkecY7zXl4', label: 'Freya' },
      { value: 'nPczCjzI2devNBz1zQrb', label: 'Brian' },
      { value: 'oWAxZDx7w5VEj9dCyTzz', label: 'Grace' },
      { value: 'onwK4e9ZLuTAKqWW03F9', label: 'Serena' },
      { value: 'pFZP5JQG7iQjIQuC4Bku', label: 'Lily' },
      { value: 'pMsXgVXv3BLzUgSXRplE', label: 'Sarah' },
      { value: 'pNInz6obpgDQGcFmaJgB', label: 'Adam' },
      { value: 'piTKgcLEGmPE4e6mEKli', label: 'Nicole' },
      { value: 't0jbNlBVZ17f02VDIeMI', label: 'Jessie' },
      { value: 'yoZ06aMxZJJ28mfd3POQ', label: 'Sam' },
      { value: 'z9fAnlkpzviPz146aGWa', label: 'Glinda' },
      { value: 'zcAOhNBS3c14rBihAFp1', label: 'Giovanni' },
      { value: 'zrHiDhphv9ZnVXBqCLjz', label: 'Mimi' }
    ],
    languages: [
      { value: 'en', label: 'English' },
      { value: 'de', label: 'German' },
      { value: 'pl', label: 'Polish' },
      { value: 'es', label: 'Spanish' },
      { value: 'it', label: 'Italian' },
      { value: 'fr', label: 'French' },
      { value: 'pt', label: 'Portuguese' },
      { value: 'hi', label: 'Hindi' },
      { value: 'ar', label: 'Arabic' }
    ],
    formats: [
      { value: 'mp3_44100_128', label: 'MP3 (128kbps)' },
      { value: 'mp3_44100_192', label: 'MP3 (192kbps)' }
    ]
  },
} as const

// Helper para obter capabilities de áudio por modelo
export function getAudioCapabilities(modelId: string) {
  return AUDIO_CAPABILITIES[modelId as keyof typeof AUDIO_CAPABILITIES] || {
    voices: [],
    languages: [],
    formats: []
  }
}

// Função para verificar se um modelo de vídeo pode ter Lip-Sync habilitado
export function canEnableLipSync(modelConfig: ModelConfig): boolean {
  return modelConfig.mediaType === 'video' && (modelConfig.capabilities.lipSyncAvailable === true)
}

// Função para calcular custo adicional de Lip-Sync
export function getLipSyncCost(modelConfig: ModelConfig): number {
  if (!canEnableLipSync(modelConfig)) return 0
  
  // Se o modelo já tem lipSync nativo, não há custo adicional
  if (modelConfig.capabilities.lipSync) return 0
  
  // Custo padrão baseado no tier do modelo
  const costByTier = {
    low: 15,
    mid: 30,
    high: 50
  }
  
  return modelConfig.credits.lipSync || costByTier[modelConfig.costTier]
}
