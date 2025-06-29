'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Plus, Zap, Loader2, Image, Music, Video } from 'lucide-react';
import { toast } from 'sonner';

// Tipos
interface MediaAPI {
  id: string;
  name: string;
  provider: string;
  model: string;
  type: 'video' | 'image' | 'audio';
  icon?: string;
}

interface MediaFormat {
  format_value: string;
  format_label: string;
}

interface MediaPricing {
  duration: number;
  credits: number;
}

// Dados mockados estruturados por API -> Modelos
const API_STRUCTURE = {
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
      'Professional': {
        id: 'kling-professional',
        description: 'Cinema Quality',
        formats: ['1080p', '4K'],
        durations: [5, 10, 30, 60, 120],
        aspectRatios: ['16:9', '1:1', '9:16', '4:3', '21:9']
      }
    }
  },
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
      }
    }
  },
  'ElevenLabs': {
    icon: 'Music',
    type: 'audio',
    models: {
      'Multilingual V2': {
        id: 'elevenlabs-multilingual-v2',
        description: '29 Languages',
        formats: ['MP3', 'WAV'],
        voices: ['Rachel', 'Drew', 'Clyde', 'Paul', 'Domi', 'Dave', 'Fin', 'Bella', 'Antoni', 'Thomas']
      },
      'Turbo V2.5': {
        id: 'elevenlabs-turbo-v2.5',
        description: 'Fast & Balanced',
        formats: ['MP3'],
        voices: ['Rachel', 'Drew', 'Clyde', 'Paul', 'Domi']
      },
      'Flash V2.5': {
        id: 'elevenlabs-flash-v2.5',
        description: 'Ultra Fast',
        formats: ['MP3'],
        voices: ['Rachel', 'Drew', 'Clyde']
      }
    }
  }
};

// Preços mockados (depois virão do Supabase)
const PRICING_DATA = {
  // Vídeos
  'luma-ray2-flash': { '540p-5': 50 },
  'luma-ray2': { 
    '720p-5': 253, '720p-7': 355, '720p-9': 458,
    '1080p-5': 355, '1080p-7': 458, '1080p-9': 560,
    '4K-5': 458, '4K-7': 560, '4K-9': 613
  },
  'kling-1.0': { '540p-5': 30, '540p-10': 60, '720p-5': 40, '720p-10': 80, '1080p-5': 50, '1080p-10': 100 },
  'kling-1.1': { '540p-5': 35, '540p-10': 70, '720p-5': 45, '720p-10': 90, '1080p-5': 60, '1080p-10': 120 },
  'kling-1.2': { '540p-5': 40, '540p-10': 80, '540p-15': 120, '720p-5': 50, '720p-10': 100, '720p-15': 150, '1080p-5': 70, '1080p-10': 140, '1080p-15': 210 },
  'kling-2.0': { '720p-5': 80, '720p-10': 160, '720p-30': 480, '1080p-5': 100, '1080p-10': 200, '1080p-30': 600, '4K-5': 150, '4K-10': 300, '4K-30': 900 },
  'kling-2.1': { '720p-5': 90, '720p-10': 180, '720p-30': 540, '1080p-5': 110, '1080p-10': 220, '1080p-30': 660, '4K-5': 170, '4K-10': 340, '4K-30': 1020 },
  'kling-professional': { '1080p-5': 125, '1080p-10': 250, '1080p-30': 750, '1080p-60': 1500, '1080p-120': 3000, '4K-5': 225, '4K-10': 450, '4K-30': 1350, '4K-60': 2700, '4K-120': 5400 },
  // Imagens
  'bfl-flux-schnell': { 'all': 5 },
  'bfl-flux-dev': { 'all': 9 },
  'bfl-flux-1.1-pro': { 'all': 15 },
  'bfl-flux-1.0-pro': { 'all': 18 },
  'bfl-flux-ultra': { 'Standard': 36, 'HD': 43, 'Portrait': 43 },
  'bfl-flux-raw': { 'all': 25 },
  // Áudio (por 1000 caracteres)
  'elevenlabs-multilingual-v2': { 'per1k': 65 },
  'elevenlabs-turbo-v2.5': { 'per1k': 33 },
  'elevenlabs-flash-v2.5': { 'per1k': 33 }
};

// Componente de Dropdown customizado
function CustomDropdown({ 
  value, 
  options, 
  onChange, 
  placeholder = "Select",
  disabled = false,
  displayValue
}: {
  value: string;
  options: { value: string; label: string; description?: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  displayValue?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg
          text-left text-white flex items-center justify-between
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#555] cursor-pointer'}
          ${isOpen ? 'border-purple-500' : ''}
        `}
        disabled={disabled}
      >
        <span className={value ? 'text-white' : 'text-gray-500'}>
          {displayValue || value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-[#2a2a2a] transition-colors"
            >
              <div>
                <div className="font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-xs text-gray-400 mt-0.5">{option.description}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function MediaGenerationStudio() {
  const [prompt, setPrompt] = useState('');
  const [selectedApi, setSelectedApi] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9');
  const [selectedResolution, setSelectedResolution] = useState('Auto');
  const [selectedDuration, setSelectedDuration] = useState('Auto');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [audioCharCount, setAudioCharCount] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Obter tipo de mídia atual
  const currentApiData = selectedApi ? API_STRUCTURE[selectedApi as keyof typeof API_STRUCTURE] : null;
  const currentType = currentApiData?.type;
  const currentModelData = selectedModel && currentApiData ? currentApiData.models[selectedModel as keyof typeof currentApiData.models] : null;

  // Opções disponíveis
  const apiOptions = Object.keys(API_STRUCTURE).map(api => ({
    value: api,
    label: api,
    description: API_STRUCTURE[api as keyof typeof API_STRUCTURE].type.charAt(0).toUpperCase() + API_STRUCTURE[api as keyof typeof API_STRUCTURE].type.slice(1) + ' Generation'
  }));

  const modelOptions = selectedApi && currentApiData ? 
    Object.entries(currentApiData.models).map(([model, data]) => ({
      value: model,
      label: model,
      description: (data as any).description
    })) : [];

  const aspectRatioOptions = currentModelData?.aspectRatios?.map(ratio => ({
    value: ratio,
    label: ratio
  })) || [];

  const resolutionOptions = currentType === 'video' && currentModelData?.formats?.map(format => ({
    value: format,
    label: format
  })) || currentType === 'image' && currentModelData?.formats?.map(format => ({
    value: format,
    label: format
  })) || [];

  const durationOptions = currentType === 'video' && currentModelData?.durations?.map(dur => ({
    value: `${dur}s`,
    label: `${dur} seconds`
  })) || [];

  const voiceOptions = currentType === 'audio' && currentModelData?.voices?.map(voice => ({
    value: voice,
    label: voice
  })) || [];

  // Calcular custo total
  useEffect(() => {
    if (!currentModelData) {
      setTotalCost(0);
      return;
    }

    const modelId = currentModelData.id;
    let cost = 0;

    if (currentType === 'video') {
      // Para vídeos: formato-duração
      if (selectedResolution !== 'Auto' && selectedDuration !== 'Auto') {
        const key = `${selectedResolution}-${parseInt(selectedDuration)}`;
        cost = PRICING_DATA[modelId as keyof typeof PRICING_DATA]?.[key as keyof typeof PRICING_DATA['luma-ray2']] || 0;
      }
    } else if (currentType === 'image') {
      // Para imagens
      const pricing = PRICING_DATA[modelId as keyof typeof PRICING_DATA];
      if (pricing) {
        cost = pricing[selectedResolution as keyof typeof pricing] || pricing['all' as keyof typeof pricing] || 0;
      }
    } else if (currentType === 'audio') {
      // Para áudio: baseado em caracteres
      const charBlocks = Math.ceil(audioCharCount / 1000);
      const perBlock = PRICING_DATA[modelId as keyof typeof PRICING_DATA]?.['per1k' as keyof typeof PRICING_DATA['elevenlabs-multilingual-v2']] || 0;
      cost = charBlocks * (perBlock as number);
    }

    setTotalCost(cost);
  }, [selectedModel, selectedResolution, selectedDuration, currentType, currentModelData, audioCharCount]);

  // Reset ao mudar API
  const handleApiChange = (api: string) => {
    setSelectedApi(api);
    setSelectedModel('');
    setSelectedResolution('Auto');
    setSelectedDuration('Auto');
    setSelectedVoice('');
    setSelectedAspectRatio('16:9');
  };

  // Reset ao mudar modelo
  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    setSelectedResolution('Auto');
    setSelectedDuration('Auto');
    
    // Definir aspect ratio padrão baseado no modelo
    const modelData = currentApiData?.models[model as keyof typeof currentApiData.models];
    if (modelData?.aspectRatios?.length > 0) {
      setSelectedAspectRatio(modelData.aspectRatios[0]);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please describe what you want to generate');
      return;
    }

    if (!selectedApi || !selectedModel) {
      toast.error('Please select API and model');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simular geração
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${currentType?.charAt(0).toUpperCase()}${currentType?.slice(1)} generation started!`);
    } catch (error) {
      toast.error('Failed to generate');
    } finally {
      setIsGenerating(false);
    }
  };

  // Ícone baseado no tipo
  const getIcon = () => {
    if (!currentType) return <Zap className="w-8 h-8 text-white" />;
    switch (currentType) {
      case 'video': return <Video className="w-8 h-8 text-white" />;
      case 'image': return <Image className="w-8 h-8 text-white" />;
      case 'audio': return <Music className="w-8 h-8 text-white" />;
      default: return <Zap className="w-8 h-8 text-white" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
            {getIcon()}
          </div>
          <h1 className="text-3xl font-semibold">Create with AI Model</h1>
          <p className="text-gray-400">
            Select your API and model to generate amazing content
          </p>
        </div>

        {/* Dropdowns em 5 etapas */}
        <div className="space-y-3">
          {/* 1. API Selection */}
          <CustomDropdown
            value={selectedApi}
            options={apiOptions}
            onChange={handleApiChange}
            placeholder="Select API"
          />

          {/* 2. Model Selection */}
          <CustomDropdown
            value={selectedModel}
            options={modelOptions}
            onChange={handleModelChange}
            placeholder={selectedApi ? "Select Model" : "Select API first"}
            disabled={!selectedApi}
          />

          {/* 3. Aspect Ratio (para vídeo e imagem) */}
          {currentType !== 'audio' && aspectRatioOptions.length > 0 && (
            <CustomDropdown
              value={selectedAspectRatio}
              options={aspectRatioOptions}
              onChange={setSelectedAspectRatio}
              placeholder="16:9"
              disabled={!selectedModel}
            />
          )}

          {/* 4. Resolution/Format (para vídeo e imagem) */}
          {currentType !== 'audio' && resolutionOptions.length > 0 && (
            <CustomDropdown
              value={selectedResolution}
              options={[{ value: 'Auto', label: 'Auto' }, ...resolutionOptions]}
              onChange={setSelectedResolution}
              placeholder="Auto"
              disabled={!selectedModel}
            />
          )}

          {/* 5. Duration (apenas para vídeo) */}
          {currentType === 'video' && durationOptions.length > 0 && (
            <CustomDropdown
              value={selectedDuration}
              options={[{ value: 'Auto', label: 'Auto' }, ...durationOptions]}
              onChange={setSelectedDuration}
              placeholder="Auto"
              disabled={!selectedResolution || selectedResolution === 'Auto'}
            />
          )}

          {/* Voice selection (apenas para áudio) */}
          {currentType === 'audio' && voiceOptions.length > 0 && (
            <CustomDropdown
              value={selectedVoice}
              options={voiceOptions}
              onChange={setSelectedVoice}
              placeholder="Select Voice"
              disabled={!selectedModel}
            />
          )}
        </div>

        {/* Prompt Input */}
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (currentType === 'audio') {
                setAudioCharCount(e.target.value.length);
              }
            }}
            placeholder={
              currentType === 'video' ? "Describe your video idea..." :
              currentType === 'image' ? "Describe the image you want..." :
              currentType === 'audio' ? "Enter the text to convert to speech..." :
              "Describe what you want to create..."
            }
            className="w-full h-32 px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500 transition-colors"
          />
          
          {currentType === 'audio' && (
            <div className="text-sm text-gray-400 text-right">
              {audioCharCount} characters
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <button className="text-gray-400 text-sm flex items-center gap-2 hover:text-white transition-colors">
              <Zap className="w-4 h-4" />
              Inspire me
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || !selectedModel}
              className="p-3 bg-[#1a1a1a] border border-[#333] rounded-lg hover:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12L19 12M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Additional Options */}
        {currentType === 'video' && (
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-[#1a1a1a] border border-[#333] rounded-lg flex flex-col items-center gap-2 hover:border-[#555] transition-colors">
              <Plus className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-400">Audio script</span>
            </button>
            
            <button className="p-4 bg-[#1a1a1a] border border-[#333] rounded-lg flex flex-col items-center gap-2 hover:border-[#555] transition-colors">
              <Plus className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-400">Start frame</span>
            </button>
          </div>
        )}

        {/* Total Cost Estimate */}
        <div className="text-center p-4 bg-[#1a1a1a] border border-[#333] rounded-lg">
          <p className="text-gray-400 mb-2">Estimated cost:</p>
          <p className="text-3xl font-bold text-purple-500">
            {totalCost} credits
          </p>
          {totalCost > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              ${(totalCost * 0.005625).toFixed(2)} - ${(totalCost * 0.008).toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Credits Counter */}
      <div className="fixed bottom-6 left-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">◐</span>
        </div>
        <span className="text-2xl font-semibold">300</span>
      </div>

      {/* User Avatar */}
      <div className="fixed bottom-6 right-6">
        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
          U
        </div>
      </div>
    </div>
  );
}