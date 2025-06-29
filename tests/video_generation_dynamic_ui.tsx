// Exemplo de implementação do sistema dinâmico de seleção de vídeo

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Video, Sparkles, Zap, Crown } from 'lucide-react';

// Configuração completa das APIs e suas capacidades
const VIDEO_API_CONFIG = {
  // LUMA LABS
  'luma-ray2-flash': {
    name: 'Luma Ray2-Flash',
    icon: Zap,
    description: 'Geração ultra-rápida, ideal para previews',
    formats: [
      { value: '540p', label: '540p (960×540)', width: 960, height: 540 }
    ],
    durations: [5], // apenas 5 segundos
    pricing: {
      '540p': {
        5: { credits: 50, apiCost: 0.14 }
      }
    }
  },
  
  'luma-ray2': {
    name: 'Luma Ray2',
    icon: Sparkles,
    description: 'Alta qualidade com múltiplas resoluções',
    formats: [
      { value: '720p', label: 'HD 720p (1280×720)', width: 1280, height: 720 },
      { value: '1080p', label: 'Full HD 1080p (1920×1080)', width: 1920, height: 1080 },
      { value: '4k', label: '4K Ultra HD (3840×2160)', width: 3840, height: 2160 }
    ],
    durations: [5, 9], // 5 ou 9 segundos
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
  
  // KLING AI
  'kling-standard': {
    name: 'Kling Standard',
    icon: Video,
    description: 'Ótimo custo-benefício para uso geral',
    formats: [
      { value: '720p', label: 'HD 720p', width: 1280, height: 720 },
      { value: '1080p', label: 'Full HD 1080p', width: 1920, height: 1080 }
    ],
    durations: [5, 10], // 5 ou 10 segundos
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
    icon: Crown,
    description: 'Qualidade cinematográfica premium',
    formats: [
      { value: '1080p', label: 'Full HD 1080p', width: 1920, height: 1080 },
      { value: '4k', label: '4K Ultra HD', width: 3840, height: 2160 }
    ],
    durations: [5, 10, 30, 60], // até 60 segundos!
    pricing: {
      '1080p': {
        5: { credits: 125, apiCost: 0.35 },
        10: { credits: 250, apiCost: 0.70 },
        30: { credits: 750, apiCost: 2.10 },
        60: { credits: 1500, apiCost: 4.20 }
      },
      '4k': {
        5: { credits: 188, apiCost: 0.525 },
        10: { credits: 375, apiCost: 1.05 },
        30: { credits: 1125, apiCost: 3.15 },
        60: { credits: 2250, apiCost: 6.30 }
      }
    }
  }
};

export function VideoGenerationDynamicUI() {
  const [selectedApi, setSelectedApi] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Obter configuração da API selecionada
  const apiConfig = selectedApi ? VIDEO_API_CONFIG[selectedApi] : null;
  
  // Obter formatos disponíveis para a API selecionada
  const availableFormats = apiConfig?.formats || [];
  
  // Obter durações disponíveis para o formato selecionado
  const availableDurations = apiConfig && selectedFormat 
    ? apiConfig.durations.filter(duration => 
        apiConfig.pricing[selectedFormat]?.[duration] !== undefined
      )
    : [];

  // Calcular preço atual
  const currentPricing = apiConfig && selectedFormat && selectedDuration
    ? apiConfig.pricing[selectedFormat]?.[selectedDuration]
    : null;

  // Reset dependentes quando API muda
  const handleApiChange = (value: string) => {
    setSelectedApi(value);
    setSelectedFormat('');
    setSelectedDuration(0);
  };

  // Reset duração quando formato muda
  const handleFormatChange = (value: string) => {
    setSelectedFormat(value);
    setSelectedDuration(0);
  };

  const handleGenerate = () => {
    if (!currentPricing) return;
    
    setIsGenerating(true);
    // Aqui você chamaria a API real
    console.log('Gerando vídeo:', {
      api: selectedApi,
      format: selectedFormat,
      duration: selectedDuration,
      credits: currentPricing.credits
    });
    
    // Simular geração
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurar Geração de Vídeo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Etapa 1: Selecionar API */}
          <div className="space-y-2">
            <Label>1. Escolha o Modelo de IA</Label>
            <Select value={selectedApi} onValueChange={handleApiChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um modelo..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(VIDEO_API_CONFIG).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{config.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {config.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Etapa 2: Selecionar Formato (aparece após selecionar API) */}
          {selectedApi && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <Label>2. Escolha a Resolução</Label>
              <Select value={selectedFormat} onValueChange={handleFormatChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a resolução..." />
                </SelectTrigger>
                <SelectContent>
                  {availableFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Etapa 3: Selecionar Duração (aparece após selecionar formato) */}
          {selectedFormat && availableDurations.length > 0 && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <Label>3. Escolha a Duração</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableDurations.map((duration) => {
                  const pricing = apiConfig!.pricing[selectedFormat][duration];
                  const isSelected = selectedDuration === duration;
                  
                  return (
                    <button
                      key={duration}
                      onClick={() => setSelectedDuration(duration)}
                      className={`
                        relative p-4 rounded-lg border-2 transition-all
                        ${isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="font-semibold">{duration}s</div>
                      <div className="text-sm text-muted-foreground">
                        {pricing.credits} créditos
                      </div>
                      {isSelected && (
                        <Badge className="absolute -top-2 -right-2" variant="default">
                          Selecionado
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resumo e Botão de Gerar */}
          {currentPricing && (
            <div className="space-y-4 animate-in slide-in-from-top-2">
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Modelo:</span>
                      <span className="font-medium">{apiConfig?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Resolução:</span>
                      <span className="font-medium">{selectedFormat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Duração:</span>
                      <span className="font-medium">{selectedDuration} segundos</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total:</span>
                        <span className="text-xl font-bold text-primary">
                          {currentPricing.credits} créditos
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        Valor: ${(currentPricing.credits * 0.005625).toFixed(2)} - ${(currentPricing.credits * 0.008).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating}
                size="lg"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando vídeo...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Gerar Vídeo ({currentPricing.credits} créditos)
                  </>
                )}
              </Button>
            </div>
          )}
          
        </CardContent>
      </Card>
    </div>
  );
}

// Hook para usar no componente real
export function useVideoGeneration() {
  const generateVideo = async (params: {
    api: string;
    format: string;
    duration: number;
    prompt: string;
  }) => {
    // Extrair provider e modelo da API selecionada
    const [provider, ...modelParts] = params.api.split('-');
    const model = modelParts.join('-');
    
    // Chamar API apropriada
    const response = await fetch('/api/videos/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider,
        model,
        resolution: params.format,
        duration: params.duration,
        prompt: params.prompt,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao gerar vídeo');
    }

    return response.json();
  };

  return { generateVideo };
}