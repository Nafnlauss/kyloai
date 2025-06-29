'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Plus, Zap } from 'lucide-react';
import { toast } from 'sonner';

// Tipos
interface VideoOption {
  api: string;
  model: string;
  aspectRatio: string;
  resolution: string;
  duration: string;
}

// Dados mockados por enquanto - depois vamos buscar do Supabase
const API_OPTIONS = {
  'Luma': ['Ray2', 'Ray2-Flash'],
  'Kling': ['1.0', '1.1', '1.2', '2.0', '2.1', 'Professional']
};

const ASPECT_RATIOS = ['16:9', '1:1', '9:16', '4:3', '3:4'];
const RESOLUTIONS = ['540p', '720p', '1080p', '4K'];
const DURATIONS = ['5s', '10s', '15s', '30s', '60s', '120s'];

// Preços base (mockados)
const PRICING = {
  'Luma': {
    'Ray2': { base: 50, perSecond: 10 },
    'Ray2-Flash': { base: 30, perSecond: 5 }
  },
  'Kling': {
    '1.0': { base: 25, perSecond: 5 },
    '1.1': { base: 30, perSecond: 6 },
    '1.2': { base: 35, perSecond: 7 },
    '2.0': { base: 40, perSecond: 8 },
    '2.1': { base: 45, perSecond: 9 },
    'Professional': { base: 60, perSecond: 12 }
  }
};

// Componente de Dropdown customizado
function CustomDropdown({ 
  value, 
  options, 
  onChange, 
  placeholder = "Select",
  disabled = false 
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
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
          {value || placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-white hover:bg-[#2a2a2a] transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function VideoGenerationAdvanced() {
  const [prompt, setPrompt] = useState('');
  const [selectedApi, setSelectedApi] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('16:9');
  const [selectedResolution, setSelectedResolution] = useState('720p');
  const [selectedDuration, setSelectedDuration] = useState('Auto');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  // Calcular custo estimado
  useEffect(() => {
    if (selectedApi && selectedModel && selectedDuration !== 'Auto') {
      const pricing = PRICING[selectedApi as keyof typeof PRICING]?.[selectedModel as keyof typeof PRICING['Luma']];
      if (pricing) {
        const duration = parseInt(selectedDuration);
        const cost = pricing.base + (pricing.perSecond * duration);
        setEstimatedCost(cost);
      }
    } else {
      setEstimatedCost(30); // Valor padrão
    }
  }, [selectedApi, selectedModel, selectedDuration]);

  // Reset modelo quando API muda
  const handleApiChange = (api: string) => {
    setSelectedApi(api);
    setSelectedModel('');
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a video description');
      return;
    }

    if (!selectedApi || !selectedModel) {
      toast.error('Please select API and model');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Aqui vai a chamada para a API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulação
      
      toast.success('Video generation started!');
    } catch (error) {
      toast.error('Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

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
            options={Object.keys(API_OPTIONS)}
            onChange={handleApiChange}
            placeholder="Select API"
          />

          {/* Model Selection */}
          <CustomDropdown
            value={selectedModel}
            options={selectedApi ? API_OPTIONS[selectedApi as keyof typeof API_OPTIONS] : []}
            onChange={setSelectedModel}
            placeholder="Select Model"
            disabled={!selectedApi}
          />

          {/* Aspect Ratio */}
          <CustomDropdown
            value={selectedAspectRatio}
            options={ASPECT_RATIOS}
            onChange={setSelectedAspectRatio}
            placeholder="Aspect Ratio"
          />

          {/* Resolution */}
          <CustomDropdown
            value={selectedResolution}
            options={RESOLUTIONS}
            onChange={setSelectedResolution}
            placeholder="Resolution"
          />

          {/* Duration - Full width */}
          <div className="col-span-2">
            <CustomDropdown
              value={selectedDuration}
              options={['Auto', ...DURATIONS]}
              onChange={setSelectedDuration}
              placeholder="Duration"
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
              disabled={isGenerating}
              className="p-3 bg-[#1a1a1a] border border-[#333] rounded-lg hover:border-purple-500 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M5 12L19 12M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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