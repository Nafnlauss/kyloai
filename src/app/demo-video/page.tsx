'use client'

import { useState, useEffect } from 'react'
import { Monitor, Camera, Clock, Send, Cpu, Volume2, Zap, Plus } from 'lucide-react'
import { ImageReferenceInput } from '@/components/ui/image-reference-input'
import { ChipSelect } from '@/components/ui/chip-select'
import { ModelSelect } from '@/components/ui/model-select'
import { InfoBox } from '@/components/ui/info-box'
import { ALL_MODELS, PROVIDERS, getModelsByMediaType, getModelById, calculateTotalCost, canEnableLipSync, getLipSyncCost } from '@/config/all-models-config'

export default function DemoVideoPage() {
  // Estados dos 5 dropdowns
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [aspectRatio, setAspectRatio] = useState('')
  const [resolution, setResolution] = useState('')
  const [duration, setDuration] = useState('')
  
  // Estados adicionais
  const [prompt, setPrompt] = useState('')
  const [hasImageRef, setHasImageRef] = useState(false)
  const [hasLipSync, setHasLipSync] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)

  // Obter modelos de vídeo disponíveis
  const videoModels = getModelsByMediaType('video')
  
  // Obter lista de providers únicos que têm modelos de vídeo
  const videoProviders = Array.from(
    new Set(videoModels.map(m => m.provider))
  ).sort()

  // Obter modelos do provider selecionado
  const providerModels = videoModels
    .filter(m => m.provider === selectedProvider)
    .sort((a, b) => {
      // Ordenar por custo (low -> mid -> high)
      const tierOrder = { low: 0, mid: 1, high: 2 }
      return tierOrder[a.costTier] - tierOrder[b.costTier]
    })

  // Obter capacidades do modelo selecionado
  const selectedModelConfig = getModelById(selectedModel)
  const modelCapabilities = selectedModelConfig?.capabilities || {}

  // Opções dinâmicas baseadas no modelo selecionado
  const aspectRatioOptions = (modelCapabilities.aspectRatios || []).map(ratio => ({
    label: ratio,
    value: ratio
  }))

  const resolutionOptions = (modelCapabilities.resolutions || []).map(res => ({
    label: res,
    value: res
  }))

  const durationOptions = (modelCapabilities.durations || []).map(dur => ({
    label: `${dur}s`,
    value: String(dur)
  }))

  // Reset em cascata quando mudar seleções superiores
  useEffect(() => {
    if (selectedProvider) {
      // Se o modelo atual não pertence ao provider, resetar
      const currentModelValid = providerModels.some(m => m.id === selectedModel)
      if (!currentModelValid && providerModels.length > 0) {
        setSelectedModel(providerModels[0].id)
      }
    }
  }, [selectedProvider])

  useEffect(() => {
    if (selectedModel && selectedModelConfig) {
      // Reset aspect ratio se não for válido
      if (!modelCapabilities.aspectRatios?.includes(aspectRatio) && modelCapabilities.aspectRatios?.length) {
        setAspectRatio(modelCapabilities.aspectRatios[0])
      }
      
      // Reset resolution se não for válida
      if (!modelCapabilities.resolutions?.includes(resolution) && modelCapabilities.resolutions?.length) {
        setResolution(modelCapabilities.resolutions[0])
      }
      
      // Reset duration se não for válida
      const durationNum = parseInt(duration)
      if (!modelCapabilities.durations?.includes(durationNum) && modelCapabilities.durations?.length) {
        setDuration(String(modelCapabilities.durations[0]))
      }
      
      // Desabilitar lip-sync se não suportado
      if (!modelCapabilities.lipSync) {
        setHasLipSync(false)
      }
    }
  }, [selectedModel])

  // Calcular custos
  const totalCost = selectedModel ? calculateTotalCost(selectedModel, {
    duration: parseInt(duration) || 5,
    hasImageRef,
    hasLipSync: hasLipSync && (modelCapabilities.lipSync || modelCapabilities.lipSyncAvailable)
  }) : 0

  // Badge de custo
  const getCostBadge = (tier: 'low' | 'mid' | 'high') => {
    const badges = {
      low: { bg: 'bg-green-500/20', text: 'text-green-600', label: 'Low' },
      mid: { bg: 'bg-yellow-500/20', text: 'text-yellow-600', label: 'Mid' },
      high: { bg: 'bg-red-500/20', text: 'text-red-600', label: 'High' }
    }
    return badges[tier]
  }

  const handleGenerate = () => {
    if (!selectedModel || !prompt.trim()) return

    alert(`
      🎬 Configuração de Vídeo 301.demo:
      
      Provider: ${selectedProvider}
      Modelo: ${selectedModelConfig?.label}
      Prompt: ${prompt}
      Aspect Ratio: ${aspectRatio}
      Resolução: ${resolution}
      Duração: ${duration} segundos
      
      Opcionais:
      - Imagem de Referência: ${hasImageRef ? 'Sim' : 'Não'}
      - Lip Sync: ${hasLipSync && modelCapabilities.lipSync ? 'Sim' : 'Não disponível'}
      ${imageFile ? `- Arquivo de imagem: ${imageFile.name}` : ''}
      ${audioFile ? `- Arquivo de áudio: ${audioFile.name}` : ''}
      
      TOTAL: ${totalCost} créditos
    `)
  }

  const handlePromptKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
            <div className="w-12 h-12 bg-[#A259FF] rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">🎬</span>
            </div>
          </div>
          <h2 className="text-2xl font-light mb-2">
            Create AI Videos with <span className="font-medium">Advanced Models</span>
          </h2>
          <p className="text-sm text-zinc-400">
            Select from our comprehensive collection of video generation models
          </p>
        </div>

        {/* 5 Dropdowns em Cascata */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-6">
          {/* 1. API/Provider */}
          <div className="relative">
            <label className="text-xs text-zinc-500 mb-1 block">1. API</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900/80 text-sm rounded-lg border border-zinc-800 focus:border-[#A259FF] focus:outline-none"
            >
              <option value="">Select API</option>
              {videoProviders.map(provider => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Model com Badge */}
          <div className="relative">
            <label className="text-xs text-zinc-500 mb-1 block">2. Model</label>
            <ModelSelect
              models={providerModels}
              value={selectedModel}
              onChange={setSelectedModel}
              disabled={!selectedProvider}
            />
          </div>

          {/* 3. Aspect Ratio */}
          <div className="relative">
            <label className="text-xs text-zinc-500 mb-1 block">3. Aspect Ratio</label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              disabled={!selectedModel || aspectRatioOptions.length === 0}
              className="w-full px-3 py-2 bg-zinc-900/80 text-sm rounded-lg border border-zinc-800 focus:border-[#A259FF] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Ratio</option>
              {aspectRatioOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Resolution */}
          <div className="relative">
            <label className="text-xs text-zinc-500 mb-1 block">4. Resolution</label>
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              disabled={!selectedModel || resolutionOptions.length === 0}
              className="w-full px-3 py-2 bg-zinc-900/80 text-sm rounded-lg border border-zinc-800 focus:border-[#A259FF] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Resolution</option>
              {resolutionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Duration */}
          <div className="relative">
            <label className="text-xs text-zinc-500 mb-1 block">5. Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              disabled={!selectedModel || durationOptions.length === 0}
              className="w-full px-3 py-2 bg-zinc-900/80 text-sm rounded-lg border border-zinc-800 focus:border-[#A259FF] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Duration</option>
              {durationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="relative">
            <textarea
              placeholder="Describe your video idea..."
              className="w-full min-h-24 rounded-2xl bg-zinc-900/80 backdrop-blur p-4 text-sm placeholder-zinc-500 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handlePromptKeyDown}
            />
            
            {/* Send Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!prompt.trim() || !selectedModel}
              className="absolute bottom-4 right-4 w-10 h-10 bg-[#A259FF] hover:bg-[#9050e6] disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Optional Features */}
          <div className="space-y-4">
            {/* Image Reference */}
            {modelCapabilities.imageRef && (
              <ImageReferenceInput
                cost={selectedModelConfig?.credits.imageRef}
                onChange={(file) => {
                  setImageFile(file);
                  setHasImageRef(!!file);
                }}
              />
            )}

            {/* Lip Sync Audio - Universal for all video models */}
            {selectedModelConfig && canEnableLipSync(selectedModelConfig) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-zinc-900/80 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium">Lip Sync Audio</p>
                      <p className="text-xs text-zinc-500">
                        {modelCapabilities.lipSync 
                          ? 'Upload audio for lip synchronization (native support)'
                          : 'Upload audio for lip synchronization (AI enhancement)'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getLipSyncCost(selectedModelConfig) > 0 && (
                      <span className="text-xs text-zinc-500">+{getLipSyncCost(selectedModelConfig)} credits</span>
                    )}
                    <input
                      type="checkbox"
                      checked={hasLipSync}
                      onChange={(e) => {
                        setHasLipSync(e.target.checked)
                        if (!e.target.checked) setAudioFile(null)
                      }}
                      className="w-4 h-4 accent-[#A259FF]"
                    />
                  </div>
                </div>
                
                {/* File input for audio */}
                {hasLipSync && (
                  <div className="ml-12 mr-4">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cost Breakdown */}
          {selectedModel && (
            <div className="bg-zinc-900/80 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-[#A259FF]" />
                <h3 className="text-sm font-medium">Cost Estimation</h3>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">
                    Base video ({duration || '5'}s)
                  </span>
                  <span>
                    {selectedModelConfig?.credits.perSecond 
                      ? Math.ceil((selectedModelConfig.credits.base * (parseInt(duration) || 5)) / 5)
                      : selectedModelConfig?.credits.base || 0} credits
                  </span>
                </div>
                {hasImageRef && selectedModelConfig?.credits.imageRef > 0 && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Image reference</span>
                    <span className="text-yellow-500">+{selectedModelConfig.credits.imageRef} credits</span>
                  </div>
                )}
                {hasLipSync && selectedModelConfig && canEnableLipSync(selectedModelConfig) && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">
                      Lip sync {modelCapabilities.lipSync ? '(native)' : '(AI enhancement)'}
                    </span>
                    <span className="text-yellow-500">+{getLipSyncCost(selectedModelConfig)} credits</span>
                  </div>
                )}
                <div className="pt-2 mt-2 border-t border-zinc-800">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-[#A259FF]">{totalCost} credits</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Model Info Box */}
        {selectedModelConfig && (
          <InfoBox model={selectedModelConfig} className="mt-6" />
        )}
      </div>
    </div>
  )
}