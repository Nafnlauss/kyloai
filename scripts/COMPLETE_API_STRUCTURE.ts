// ESTRUTURA COMPLETA DE TODAS AS APIS COM TODOS OS MODELOS
// Atualizado com TODAS as descobertas da pesquisa

export const COMPLETE_API_STRUCTURE = {
  // LUMA LABS - 3 modelos confirmados
  'Luma': {
    icon: 'Sparkles',
    type: 'video',
    models: {
      'Ray2-Flash': {
        id: 'luma-ray2-flash',
        description: 'Fast & Economical',
        formats: ['540p'],
        durations: [5],
        aspectRatios: ['16:9', '1:1', '9:16']
      },
      'Ray2': {
        id: 'luma-ray2',
        description: 'High Quality',
        formats: ['720p', '1080p', '4K'],
        durations: [5, 7, 9],
        aspectRatios: ['16:9', '1:1', '9:16', '4:3']
      },
      'Ray 1.6': {
        id: 'luma-ray1.6',
        description: 'Legacy Model',
        formats: ['720p', '1080p'],
        durations: [5, 10],
        aspectRatios: ['16:9', '1:1', '9:16']
      }
    }
  },

  // KLING AI - 9 modelos (incluindo novos descobertos)
  'Kling': {
    icon: 'Video',
    type: 'video',
    models: {
      '1.0': {
        id: 'kling-1.0',
        description: 'Original Model',
        formats: ['540p', '720p', '1080p'],
        durations: [5, 10],
        aspectRatios: ['16:9', '1:1', '9:16']
      },
      '1.1': {
        id: 'kling-1.1',
        description: 'Better Motion',
        formats: ['540p', '720p', '1080p'],
        durations: [5, 10],
        aspectRatios: ['16:9', '1:1', '9:16']
      },
      '1.2': {
        id: 'kling-1.2',
        description: 'Latest Stable',
        formats: ['540p', '720p', '1080p'],
        durations: [5, 10, 15],
        aspectRatios: ['16:9', '1:1', '9:16']
      },
      '1.5': {
        id: 'kling-1.5',
        description: 'Enhanced Motion',
        formats: ['540p', '720p', '1080p'],
        durations: [5, 10, 15],
        aspectRatios: ['16:9', '1:1', '9:16', '4:3']
      },
      '1.6': {
        id: 'kling-1.6',
        description: 'Latest 1.x Gen',
        formats: ['540p', '720p', '1080p'],
        durations: [5, 10, 15, 20],
        aspectRatios: ['16:9', '1:1', '9:16', '4:3']
      },
      '2.0': {
        id: 'kling-2.0',
        description: 'Next Generation',
        formats: ['720p', '1080p', '4K'],
        durations: [5, 10, 15, 30],
        aspectRatios: ['16:9', '1:1', '9:16', '4:3']
      },
      '2.1': {
        id: 'kling-2.1',
        description: 'Latest AI',
        formats: ['720p', '1080p', '4K'],
        durations: [5, 10, 15, 30],
        aspectRatios: ['16:9', '1:1', '9:16', '4:3']
      },
      '2.1 Master': {
        id: 'kling-2.1-master',
        description: 'Master Quality',
        formats: ['720p', '1080p', '4K', '8K'],
        durations: [5, 10, 30, 60],
        aspectRatios: ['16:9', '1:1', '9:16', '4:3', '21:9', '32:9']
      },
      'Professional': {
        id: 'kling-professional',
        description: 'Cinema Quality',
        formats: ['1080p', '4K'],
        durations: [5, 10, 30, 60, 120],
        aspectRatios: ['16:9', '1:1', '9:16', '4:3', '21:9']
      }
    }
  },

  // BFL.AI - 10 modelos (incluindo novos descobertos)
  'BFL': {
    icon: 'Image',
    type: 'image',
    models: {
      'FLUX Schnell': {
        id: 'bfl-flux-schnell',
        description: 'Free & Fast',
        formats: ['Standard', 'HD', 'Portrait'],
        aspectRatios: ['1:1', '16:9', '9:16', '4:5']
      },
      'FLUX Dev': {
        id: 'bfl-flux-dev',
        description: 'Development',
        formats: ['Standard', 'HD', 'Portrait'],
        aspectRatios: ['1:1', '16:9', '9:16', '4:5']
      },
      'FLUX 1.1 Pro': {
        id: 'bfl-flux-1.1-pro',
        description: 'Latest Pro',
        formats: ['Standard', 'HD', 'Portrait'],
        aspectRatios: ['1:1', '16:9', '9:16', '4:5', '3:2']
      },
      'FLUX 1.0 Pro': {
        id: 'bfl-flux-1.0-pro',
        description: 'Stable Pro',
        formats: ['Standard', 'HD', 'Portrait'],
        aspectRatios: ['1:1', '16:9', '9:16', '4:5', '3:2']
      },
      'FLUX Ultra': {
        id: 'bfl-flux-ultra',
        description: 'Ultra Quality',
        formats: ['Standard', 'HD', 'Portrait'],
        aspectRatios: ['1:1', '16:9', '9:16', '4:5', '3:2']
      },
      'FLUX Raw': {
        id: 'bfl-flux-raw',
        description: 'Raw Output',
        formats: ['Standard', 'HD', 'Portrait'],
        aspectRatios: ['1:1', '16:9', '9:16', '4:5']
      },
      'FLUX Fill': {
        id: 'bfl-flux-fill',
        description: 'Inpainting/Outpainting',
        formats: ['Custom', 'Standard', 'HD'],
        aspectRatios: ['1:1', '16:9', '9:16', 'Custom'],
        features: ['mask_input', 'expand_canvas', 'smart_fill']
      },
      'FLUX Depth': {
        id: 'bfl-flux-depth',
        description: 'Depth Control',
        formats: ['Standard', 'HD'],
        aspectRatios: ['1:1', '16:9', '9:16'],
        features: ['depth_map', '3d_awareness']
      },
      'FLUX Canny': {
        id: 'bfl-flux-canny',
        description: 'Edge Control',
        formats: ['Standard', 'HD'],
        aspectRatios: ['1:1', '16:9', '9:16'],
        features: ['edge_map', 'line_weight']
      },
      'FLUX Redux': {
        id: 'bfl-flux-redux',
        description: 'Image Mixing',
        formats: ['Standard', 'HD'],
        aspectRatios: ['1:1', '16:9', '9:16'],
        features: ['style_mixing', 'variation_strength']
      }
    }
  },

  // ELEVENLABS - 8 modelos (incluindo novos descobertos)
  'ElevenLabs': {
    icon: 'Music',
    type: 'audio',
    models: {
      'v3': {
        id: 'elevenlabs-v3',
        description: 'Latest Flagship',
        formats: ['MP3', 'WAV'],
        voices: ['All voices'],
        languages: ['All 29 languages'],
        features: ['emotion_control', 'voice_cloning', 'ssml_pro']
      },
      'Multilingual V1': {
        id: 'elevenlabs-multilingual-v1',
        description: '7 Languages',
        formats: ['MP3', 'WAV'],
        voices: ['Rachel', 'Drew', 'Clyde', 'Paul', 'Domi'],
        languages: ['EN', 'ES', 'FR', 'DE', 'IT', 'PT', 'PL']
      },
      'Multilingual V2': {
        id: 'elevenlabs-multilingual-v2',
        description: '29 Languages',
        formats: ['MP3', 'WAV'],
        voices: ['Rachel', 'Drew', 'Clyde', 'Paul', 'Domi', 'Dave', 'Fin', 'Bella', 'Antoni', 'Thomas']
      },
      'English V1': {
        id: 'elevenlabs-english-v1',
        description: 'English Only',
        formats: ['MP3'],
        voices: ['Rachel', 'Drew', 'Clyde'],
        languages: ['EN']
      },
      'Turbo V2': {
        id: 'elevenlabs-turbo-v2',
        description: 'Fast Original',
        formats: ['MP3'],
        voices: ['Rachel', 'Drew', 'Clyde', 'Paul'],
        languages: ['Multiple']
      },
      'Turbo V2.5': {
        id: 'elevenlabs-turbo-v2.5',
        description: 'Fast & Balanced',
        formats: ['MP3'],
        voices: ['Rachel', 'Drew', 'Clyde', 'Paul', 'Domi']
      },
      'Flash': {
        id: 'elevenlabs-flash',
        description: 'Ultra Fast Original',
        formats: ['MP3'],
        voices: ['Rachel', 'Drew'],
        languages: ['EN']
      },
      'Flash V2.5': {
        id: 'elevenlabs-flash-v2.5',
        description: 'Ultra Fast',
        formats: ['MP3'],
        voices: ['Rachel', 'Drew', 'Clyde']
      }
    }
  },

  // PIAPI - Agregador de APIs
  'PiAPI': {
    icon: 'Layers',
    type: 'multi',
    models: {
      'Midjourney v6': {
        id: 'piapi-midjourney',
        description: 'Artistic Images',
        type: 'image',
        formats: ['Standard', 'HD', 'Portrait', 'Landscape'],
        aspectRatios: ['1:1', '2:3', '3:2', '4:3', '16:9'],
        features: ['variations', 'upscale', 'remix']
      },
      'FaceSwap': {
        id: 'piapi-faceswap',
        description: 'Face Swapping',
        type: 'special',
        formats: ['Image', 'Video'],
        aspectRatios: ['1:1', '16:9']
      },
      'Suno v3': {
        id: 'piapi-suno',
        description: 'Music Generation',
        type: 'audio',
        formats: ['MP3', 'WAV'],
        durations: [30, 60, 120, 180, 300]
      }
    }
  }
};

// PRICING DATA - Todos os preços com margem 100%
export const COMPLETE_PRICING_DATA = {
  // Vídeos - Luma
  'luma-ray2-flash': { '540p-5': 50 },
  'luma-ray2': { 
    '720p-5': 253, '720p-7': 355, '720p-9': 458,
    '1080p-5': 355, '1080p-7': 458, '1080p-9': 560,
    '4K-5': 458, '4K-7': 560, '4K-9': 613
  },
  'luma-ray1.6': {
    '720p-5': 200, '720p-10': 400,
    '1080p-5': 300, '1080p-10': 600
  },
  
  // Vídeos - Kling (todos os 9 modelos)
  'kling-1.0': { '540p-5': 30, '540p-10': 60, '720p-5': 40, '720p-10': 80, '1080p-5': 50, '1080p-10': 100 },
  'kling-1.1': { '540p-5': 35, '540p-10': 70, '720p-5': 45, '720p-10': 90, '1080p-5': 60, '1080p-10': 120 },
  'kling-1.2': { '540p-5': 40, '540p-10': 80, '540p-15': 120, '720p-5': 50, '720p-10': 100, '720p-15': 150, '1080p-5': 70, '1080p-10': 140, '1080p-15': 210 },
  'kling-1.5': { '540p-5': 38, '540p-10': 76, '540p-15': 114, '720p-5': 48, '720p-10': 96, '720p-15': 144, '1080p-5': 65, '1080p-10': 130, '1080p-15': 195 },
  'kling-1.6': { '540p-5': 45, '540p-10': 90, '540p-15': 135, '540p-20': 180, '720p-5': 55, '720p-10': 110, '720p-15': 165, '720p-20': 220, '1080p-5': 75, '1080p-10': 150, '1080p-15': 225, '1080p-20': 300 },
  'kling-2.0': { '720p-5': 80, '720p-10': 160, '720p-30': 480, '1080p-5': 100, '1080p-10': 200, '1080p-30': 600, '4K-5': 150, '4K-10': 300, '4K-30': 900 },
  'kling-2.1': { '720p-5': 90, '720p-10': 180, '720p-30': 540, '1080p-5': 110, '1080p-10': 220, '1080p-30': 660, '4K-5': 170, '4K-10': 340, '4K-30': 1020 },
  'kling-2.1-master': { 
    '720p-5': 120, '720p-10': 240, '720p-30': 720, '720p-60': 1440,
    '1080p-5': 150, '1080p-10': 300, '1080p-30': 900, '1080p-60': 1800,
    '4K-5': 250, '4K-10': 500, '4K-30': 1500, '4K-60': 3000,
    '8K-5': 500, '8K-10': 1000, '8K-30': 3000, '8K-60': 6000
  },
  'kling-professional': { 
    '1080p-5': 125, '1080p-10': 250, '1080p-30': 750, '1080p-60': 1500, '1080p-120': 3000,
    '4K-5': 225, '4K-10': 450, '4K-30': 1350, '4K-60': 2700, '4K-120': 5400
  },
  
  // Imagens - BFL (todos os 10 modelos)
  'bfl-flux-schnell': { 'all': 5 },
  'bfl-flux-dev': { 'all': 9 },
  'bfl-flux-1.1-pro': { 'all': 15 },
  'bfl-flux-1.0-pro': { 'all': 18 },
  'bfl-flux-ultra': { 'Standard': 36, 'HD': 43, 'Portrait': 43 },
  'bfl-flux-raw': { 'all': 25 },
  'bfl-flux-fill': { 'Custom': 30, 'Standard': 25, 'HD': 35 },
  'bfl-flux-depth': { 'Standard': 22, 'HD': 28 },
  'bfl-flux-canny': { 'Standard': 22, 'HD': 28 },
  'bfl-flux-redux': { 'Standard': 20, 'HD': 26 },
  
  // Áudio - ElevenLabs (todos os 8 modelos)
  'elevenlabs-v3': { 'per1k': 90 },
  'elevenlabs-multilingual-v1': { 'per1k': 50 },
  'elevenlabs-multilingual-v2': { 'per1k': 65 },
  'elevenlabs-english-v1': { 'per1k': 25 },
  'elevenlabs-turbo-v2': { 'per1k': 30 },
  'elevenlabs-turbo-v2.5': { 'per1k': 33 },
  'elevenlabs-flash': { 'per1k': 25 },
  'elevenlabs-flash-v2.5': { 'per1k': 33 },
  
  // PiAPI - Agregador
  'piapi-midjourney': { 'Standard': 40, 'HD': 60, 'Portrait': 50, 'Landscape': 50 },
  'piapi-faceswap': { 'Image': 15, 'Video-10': 150 },
  'piapi-suno': { '30s': 100, '60s': 200, '120s': 400, '180s': 600, '300s': 1000 }
};

// Estatísticas de modelos
export const API_STATISTICS = {
  totalAPIs: 5,
  totalModels: 30,
  breakdown: {
    'Luma': 3,
    'Kling': 9,
    'BFL': 10,
    'ElevenLabs': 8,
    'PiAPI': 3
  },
  types: {
    'video': 12,
    'image': 10,
    'audio': 8,
    'special': 1,
    'music': 1
  }
};