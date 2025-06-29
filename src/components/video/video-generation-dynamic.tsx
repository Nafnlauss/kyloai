'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Video, Sparkles, Zap, Crown, Film } from 'lucide-react';
import { toast } from 'sonner';
import { VideoAPIClient, VideoAPIOption } from '@/lib/supabase/video-api-client-browser';

// Ícones para as APIs
const API_ICONS = {
  'Zap': Zap,
  'Sparkles': Sparkles,
  'Video': Video,
  'Crown': Crown,
  'Film': Film,
};

export function VideoGenerationDynamic() {
  const [isLoading, setIsLoading] = useState(true);
  const [videoOptions, setVideoOptions] = useState<VideoAPIOption[]>([]);
  
  const [selectedApi, setSelectedApi] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('16:9');
  
  const [isGenerating, setIsGenerating] = useState(false);

  // Carregar opções do banco de dados
  useEffect(() => {
    loadVideoOptions();
  }, []);

  const loadVideoOptions = async () => {
    try {
      setIsLoading(true);
      const options = await VideoAPIClient.getAllVideoOptions();
      setVideoOptions(options);
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
      toast.error('Erro ao carregar configurações de vídeo');
    } finally {
      setIsLoading(false);
    }
  };

  // Obter configuração da API selecionada
  const selectedApiConfig = videoOptions.find(opt => opt.api_id === selectedApi);
  
  // Obter formatos disponíveis
  const availableFormats = selectedApiConfig?.formats || [];
  
  // Obter durações disponíveis para o formato selecionado
  const selectedFormatData = availableFormats.find(f => f.format_value === selectedFormat);
  const availableDurations = selectedFormatData?.durations || [];
  
  // Obter preço atual
  const currentPricing = availableDurations.find(d => d.duration === selectedDuration);

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

  const handleGenerate = async () => {
    if (!currentPricing || !selectedApiConfig) return;
    
    setIsGenerating(true);
    
    try {
      // Aqui você faria a chamada real para a API
      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_id: selectedApi,
          provider: selectedApiConfig.provider,
          model: selectedApiConfig.model,
          format: selectedFormat,
          duration: selectedDuration,
          aspect_ratio: selectedAspectRatio,
          credits: currentPricing.credits,
          // prompt será adicionado quando implementarmos o campo de texto
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar vídeo');
      }

      const result = await response.json();
      toast.success('Vídeo sendo gerado! ID: ' + result.id);
      
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao gerar vídeo');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

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
                {videoOptions.map((option) => {
                  const Icon = option.icon ? API_ICONS[option.icon as keyof typeof API_ICONS] : Video;
                  return (
                    <SelectItem key={option.api_id} value={option.api_id}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{option.api_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            {/* Mostrar features e limitações */}
            {selectedApiConfig && (
              <div className="mt-3 space-y-2">
                {selectedApiConfig.features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedApiConfig.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        ✓ {feature}
                      </Badge>
                    ))}
                  </div>
                )}
                {selectedApiConfig.limitations.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedApiConfig.limitations.map((limitation, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs text-orange-600">
                        ⚠ {limitation}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Etapa 2: Selecionar Aspect Ratio */}
          {selectedApi && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <Label>2. Escolha a Proporção</Label>
              <div className="grid grid-cols-3 gap-3">
                {['16:9', '1:1', '9:16'].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setSelectedAspectRatio(ratio)}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${selectedAspectRatio === ratio 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                      }
                    `}
                  >
                    <div className="font-medium">{ratio}</div>
                    <div className="text-xs text-muted-foreground">
                      {ratio === '16:9' && 'Paisagem'}
                      {ratio === '1:1' && 'Quadrado'}
                      {ratio === '9:16' && 'Retrato'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Etapa 3: Selecionar Formato/Resolução */}
          {selectedApi && selectedAspectRatio && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <Label>3. Escolha a Resolução</Label>
              <Select value={selectedFormat} onValueChange={handleFormatChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a resolução..." />
                </SelectTrigger>
                <SelectContent>
                  {availableFormats.map((format) => (
                    <SelectItem key={format.format_value} value={format.format_value}>
                      {format.format_label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Etapa 4: Selecionar Duração */}
          {selectedFormat && availableDurations.length > 0 && (
            <div className="space-y-2 animate-in slide-in-from-top-2">
              <Label>4. Escolha a Duração</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableDurations.map((pricing) => {
                  const isSelected = selectedDuration === pricing.duration;
                  
                  return (
                    <button
                      key={pricing.duration}
                      onClick={() => setSelectedDuration(pricing.duration)}
                      className={`
                        relative p-4 rounded-lg border-2 transition-all
                        ${isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="font-semibold">{pricing.duration}s</div>
                      <div className="text-sm text-muted-foreground">
                        {pricing.credits} créditos
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${pricing.api_cost} custo
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
                      <span className="font-medium">{selectedApiConfig?.api_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Proporção:</span>
                      <span className="font-medium">{selectedAspectRatio}</span>
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
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">
                            {currentPricing.credits} créditos
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Valor: ${(currentPricing.credits * 0.005625).toFixed(2)} - ${(currentPricing.credits * 0.008).toFixed(2)}
                          </div>
                        </div>
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