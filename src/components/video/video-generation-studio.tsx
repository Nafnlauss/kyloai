'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Plus, Zap, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { VideoAPIClient } from '@/lib/supabase/video-api-client-browser';

// Tipos
interface VideoAPI {
  id: string;
  name: string;
  provider: string;
  model: string;
}

interface VideoFormat {
  format_value: string;
  format_label: string;
}

interface VideoPricing {
  duration: number;
  credits: number;
}

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
  options: { value: string; label: string }[];
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
              className="w-full px-4 py-3 text-left text-white hover:bg-[#2a2a2a] transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function VideoGenerationStudio() {
  const [isLoading, setIsLoading] = useState(true);
  const [apis, setApis] = useState<VideoAPI[]>([]);
  const [videoOptions, setVideoOptions] = useState<any[]>([]);
  
  const [prompt, setPrompt] = useState('');
  const [selectedApi, setSelectedApi] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9');
  const [selectedResolution, setSelectedResolution] = useState('720p');
  const [selectedDuration, setSelectedDuration] = useState('Auto');
  const [estimatedCost, setEstimatedCost] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);

  // Carregar dados do Supabase
  useEffect(() => {
    loadVideoOptions();
  }, []);

  const loadVideoOptions = async () => {
    try {
      setIsLoading(true);
      const options = await VideoAPIClient.getAllVideoOptions();
      setVideoOptions(options);
      
      // Extrair lista única de providers
      const uniqueProviders = [...new Set(options.map(opt => opt.provider))];
      setApis(uniqueProviders);
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
      toast.error('Erro ao carregar configurações de vídeo');
    } finally {
      setIsLoading(false);
    }
  };

  // Obter modelos disponíveis para o provider selecionado
  const availableModels = videoOptions
    .filter(opt => opt.provider === selectedApi)
    .map(opt => ({ value: opt.api_id, label: opt.model }));

  // Obter configuração do modelo selecionado
  const selectedModelConfig = videoOptions.find(opt => opt.api_id === selectedModel);

  // Obter aspect ratios disponíveis
  const availableAspectRatios = ['16:9', '1:1', '9:16', '4:3', '3:4'].map(ratio => ({
    value: ratio,
    label: ratio
  }));

  // Obter resoluções disponíveis
  const availableResolutions = selectedModelConfig?.formats
    .map((f: any) => ({ value: f.format_value, label: f.format_label }))
    .filter((v: any, i: number, a: any[]) => a.findIndex(t => t.value === v.value) === i) || [];

  // Obter durações disponíveis
  const availableDurations = (() => {
    if (!selectedModelConfig || !selectedResolution) return [];
    
    const format = selectedModelConfig.formats.find((f: any) => f.format_value === selectedResolution);
    if (!format) return [];

    const durations = format.durations.map((d: any) => ({
      value: `${d.duration}s`,
      label: `${d.duration}s`,
      credits: d.credits
    }));

    return [{ value: 'Auto', label: 'Auto', credits: 30 }, ...durations];
  })();

  // Calcular custo estimado
  useEffect(() => {
    if (selectedDuration && selectedDuration !== 'Auto') {
      const duration = availableDurations.find(d => d.value === selectedDuration);
      if (duration && duration.credits) {
        setEstimatedCost(duration.credits);
      }
    } else {
      setEstimatedCost(30);
    }
  }, [selectedDuration, availableDurations]);

  // Reset dependentes quando API muda
  const handleApiChange = (api: string) => {
    setSelectedApi(api);
    setSelectedModel('');
    setSelectedResolution('720p');
    setSelectedDuration('Auto');
  };

  // Reset duração quando resolução muda
  const handleResolutionChange = (resolution: string) => {
    setSelectedResolution(resolution);
    setSelectedDuration('Auto');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Por favor, descreva seu vídeo');
      return;
    }

    if (!selectedApi || !selectedModel) {
      toast.error('Por favor, selecione API e modelo');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_id: selectedModel,
          provider: selectedApi,
          model: selectedModelConfig?.model,
          format: selectedResolution,
          duration: selectedDuration === 'Auto' ? 5 : parseInt(selectedDuration),
          aspect_ratio: selectedAspectRatio,
          credits: estimatedCost,
          prompt
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar vídeo');
      }

      const result = await response.json();
      toast.success('Geração de vídeo iniciada! ID: ' + result.id);
      
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Falha ao gerar vídeo');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold">Create a video with AI Model</h1>
          <p className="text-gray-400">Transform your ideas into stunning AI-generated videos. Add your prompt and optional media below.</p>
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 gap-3">
          {/* API Selection */}
          <CustomDropdown
            value={selectedApi}
            options={apis.map(api => ({ value: api, label: api.charAt(0).toUpperCase() + api.slice(1) }))}
            onChange={handleApiChange}
            placeholder="Select"
          />

          {/* Model Selection */}
          <CustomDropdown
            value={selectedModel}
            options={availableModels}
            onChange={setSelectedModel}
            placeholder={selectedApi ? "Select Model" : "Select API first"}
            disabled={!selectedApi}
            displayValue={selectedModelConfig?.model}
          />

          {/* Aspect Ratio */}
          <CustomDropdown
            value={selectedAspectRatio}
            options={availableAspectRatios}
            onChange={setSelectedAspectRatio}
            placeholder="16:9"
          />

          {/* Resolution */}
          <CustomDropdown
            value={selectedResolution}
            options={availableResolutions}
            onChange={handleResolutionChange}
            placeholder="720p"
            disabled={!selectedModel}
          />

          {/* Duration - Full width */}
          <div className="col-span-2">
            <CustomDropdown
              value={selectedDuration}
              options={availableDurations}
              onChange={setSelectedDuration}
              placeholder="Auto"
              disabled={!selectedResolution || availableDurations.length === 0}
            />
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your video idea..."
            className="w-full h-32 px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:border-purple-500 transition-colors"
          />
          
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

        {/* Cost Estimate */}
        <div className="text-center">
          <p className="text-gray-400">
            Estimated cost: <span className="text-purple-500 font-semibold">{estimatedCost} credits</span>
          </p>
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