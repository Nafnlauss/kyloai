// Configuração completa e atualizada de todas as APIs de vídeo
// Este arquivo deve ser usado como fonte única de verdade para capacidades e preços

export interface VideoFormat {
  value: string;
  label: string;
  width: number;
  height: number;
  aspectRatio?: string;
}

export interface ApiPricing {
  credits: number;
  apiCost: number;
}

export interface VideoApiConfig {
  name: string;
  provider: 'luma' | 'kling';
  model: string;
  icon?: any;
  description: string;
  formats: VideoFormat[];
  durations: number[];
  features?: string[];
  limitations?: string[];
  pricing: {
    [format: string]: {
      [duration: number]: ApiPricing;
    };
  };
}

export const VIDEO_API_CONFIGURATIONS: Record<string, VideoApiConfig> = {
  // ========== LUMA LABS ==========
  'luma-ray2-flash': {
    name: 'Luma Ray2-Flash',
    provider: 'luma',
    model: 'ray2-flash',
    description: 'Modelo econômico para previews rápidos',
    formats: [
      { 
        value: '540p', 
        label: '540p (960×540)', 
        width: 960, 
        height: 540,
        aspectRatio: '16:9'
      }
    ],
    durations: [5],
    features: [
      'Geração ultra-rápida (30-60s)',
      'Ideal para testar ideias',
      'Menor custo por vídeo'
    ],
    limitations: [
      'Apenas 540p de resolução',
      'Máximo 5 segundos',
      'Qualidade reduzida'
    ],
    pricing: {
      '540p': {
        5: { credits: 50, apiCost: 0.14 }
      }
    }
  },

  'luma-ray2': {
    name: 'Luma Ray2',
    provider: 'luma',
    model: 'ray2',
    description: 'Modelo premium com alta qualidade e múltiplas resoluções',
    formats: [
      { 
        value: '720p', 
        label: 'HD 720p (1280×720)', 
        width: 1280, 
        height: 720,
        aspectRatio: '16:9'
      },
      { 
        value: '1080p', 
        label: 'Full HD 1080p (1920×1080)', 
        width: 1920, 
        height: 1080,
        aspectRatio: '16:9'
      },
      { 
        value: '4k', 
        label: '4K Ultra HD (3840×2160)', 
        width: 3840, 
        height: 2160,
        aspectRatio: '16:9'
      }
    ],
    durations: [5, 9],
    features: [
      'Qualidade cinematográfica',
      'Suporte até 4K',
      'Movimentos fluidos e realistas',
      'Melhor aderência ao prompt'
    ],
    limitations: [
      'Máximo 9 segundos',
      '4K disponível apenas para 9s'
    ],
    pricing: {
      '720p': {
        5: { credits: 253, apiCost: 0.71 }
      },
      '1080p': {
        5: { credits: 275, apiCost: 0.77 },
        9: { credits: 549, apiCost: 1.54 }
      },
      '4k': {
        9: { credits: 613, apiCost: 1.72 }
      }
    }
  },

  // ========== KLING AI ==========
  'kling-standard': {
    name: 'Kling Standard',
    provider: 'kling',
    model: 'standard',
    description: 'Qualidade padrão com ótimo custo-benefício',
    formats: [
      { 
        value: '720p', 
        label: 'HD 720p', 
        width: 1280, 
        height: 720,
        aspectRatio: '16:9'
      },
      { 
        value: '1080p', 
        label: 'Full HD 1080p', 
        width: 1920, 
        height: 1080,
        aspectRatio: '16:9'
      }
    ],
    durations: [5, 10],
    features: [
      'Boa qualidade geral',
      'Processamento rápido',
      'Suporta múltiplos idiomas',
      'Bom para conteúdo comercial'
    ],
    limitations: [
      'Máximo 10 segundos',
      'Menos detalhes que Professional'
    ],
    pricing: {
      '720p': {
        5: { credits: 50, apiCost: 0.14 },
        10: { credits: 100, apiCost: 0.28 }
      },
      '1080p': {
        5: { credits: 50, apiCost: 0.14 },
        10: { credits: 100, apiCost: 0.28 }
      }
    }
  },

  'kling-professional': {
    name: 'Kling Professional',
    provider: 'kling',
    model: 'professional',
    description: 'Qualidade cinematográfica com vídeos longos',
    formats: [
      { 
        value: '1080p', 
        label: 'Full HD 1080p', 
        width: 1920, 
        height: 1080,
        aspectRatio: '16:9'
      },
      { 
        value: '4k', 
        label: '4K Ultra HD', 
        width: 3840, 
        height: 2160,
        aspectRatio: '16:9'
      }
    ],
    durations: [5, 10, 30, 60, 120], // Kling suporta vídeos LONGOS!
    features: [
      'Máxima qualidade disponível',
      'Vídeos até 2 minutos',
      'Movimentos complexos',
      'Ideal para produção profissional',
      'Melhor física e realismo'
    ],
    limitations: [
      'Processamento mais demorado',
      'Custo elevado para vídeos longos'
    ],
    pricing: {
      '1080p': {
        5: { credits: 125, apiCost: 0.35 },
        10: { credits: 250, apiCost: 0.70 },
        30: { credits: 750, apiCost: 2.10 },
        60: { credits: 1500, apiCost: 4.20 },
        120: { credits: 3000, apiCost: 8.40 }
      },
      '4k': {
        5: { credits: 188, apiCost: 0.525 }, // +50% sobre 1080p
        10: { credits: 375, apiCost: 1.05 },
        30: { credits: 1125, apiCost: 3.15 },
        60: { credits: 2250, apiCost: 6.30 },
        120: { credits: 4500, apiCost: 12.60 }
      }
    }
  }
};

// Função helper para obter todas as opções únicas
export function getUniqueVideoOptions() {
  const allFormats = new Set<string>();
  const allDurations = new Set<number>();
  
  Object.values(VIDEO_API_CONFIGURATIONS).forEach(config => {
    config.formats.forEach(format => allFormats.add(format.value));
    config.durations.forEach(duration => allDurations.add(duration));
  });
  
  return {
    formats: Array.from(allFormats).sort(),
    durations: Array.from(allDurations).sort((a, b) => a - b)
  };
}

// Função para validar se uma combinação é válida
export function isValidCombination(
  api: string, 
  format: string, 
  duration: number
): boolean {
  const config = VIDEO_API_CONFIGURATIONS[api];
  if (!config) return false;
  
  return config.pricing[format]?.[duration] !== undefined;
}

// Função para obter o melhor preço para uma necessidade específica
export function getBestPriceForNeeds(
  minResolution: string,
  minDuration: number,
  preferredProvider?: 'luma' | 'kling'
) {
  let bestOption = null;
  let lowestCredits = Infinity;
  
  Object.entries(VIDEO_API_CONFIGURATIONS).forEach(([key, config]) => {
    // Filtrar por provider se especificado
    if (preferredProvider && config.provider !== preferredProvider) return;
    
    // Verificar cada combinação
    config.formats.forEach(format => {
      config.durations.forEach(duration => {
        if (duration >= minDuration) {
          const pricing = config.pricing[format.value]?.[duration];
          if (pricing && pricing.credits < lowestCredits) {
            // Verificar se atende resolução mínima
            const resolutionOrder = ['540p', '720p', '1080p', '4k'];
            const formatIndex = resolutionOrder.indexOf(format.value);
            const minIndex = resolutionOrder.indexOf(minResolution);
            
            if (formatIndex >= minIndex) {
              lowestCredits = pricing.credits;
              bestOption = {
                api: key,
                config,
                format: format.value,
                duration,
                credits: pricing.credits,
                cost: pricing.apiCost
              };
            }
          }
        }
      });
    });
  });
  
  return bestOption;
}

// Adicionar features especiais (para futuro)
export const SPECIAL_FEATURES = {
  'luma-audio': {
    name: 'Adicionar Áudio',
    creditsPerSecond: 8,
    apiCostPerSecond: 0.02,
    description: 'Adiciona trilha sonora ao vídeo'
  },
  'luma-upscale': {
    name: 'Upscaling',
    creditsRange: [8, 40],
    apiCostRange: [0.02, 0.11],
    description: 'Melhora a qualidade/resolução'
  },
  'lip-sync': {
    name: 'Sincronização Labial',
    baseCredits: 36,
    baseCost: 0.10,
    description: 'Sincroniza fala com movimento labial'
  }
};