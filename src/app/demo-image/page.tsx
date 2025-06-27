'use client'

import { useState, useEffect } from 'react'
import { Image, Camera, Palette, Send, Zap, FileImage, Grid3x3, Plus } from 'lucide-react'
import { ImageReferenceInput } from '@/components/ui/image-reference-input'
import { ModelSelect } from '@/components/ui/model-select'
import { InfoBox } from '@/components/ui/info-box'
import { ALL_MODELS, getModelsByMediaType, getModelById, calculateTotalCost } from '@/config/all-models-config'

export default function DemoImagePage() {
  // Estados dos dropdowns
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [aspectRatio, setAspectRatio] = useState('')
  const [dimensions, setDimensions] = useState('')
  const [style, setStyle] = useState('')
  
  // Estados adicionais
  const [prompt, setPrompt] = useState('')
  const [hasImageRef, setHasImageRef] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Obter modelos de imagem disponíveis
  const imageModels = getModelsByMediaType('image')
  
  // Obter lista de providers únicos que têm modelos de imagem
  const imageProviders = Array.from(
    new Set(imageModels.map(m => m.provider))
  ).sort()

  // Obter modelos do provider selecionado
  const providerModels = imageModels
    .filter(m => m.provider === selectedProvider)
    .sort((a, b) => {
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

  const dimensionsOptions = (modelCapabilities.dimensions || []).map(dim => ({
    label: dim,
    value: dim
  }))

  // Estilos disponíveis
  const styleOptions = [
    { value: 'vivid', label: 'Vivid' },
    { value: 'natural', label: 'Natural' },
    { value: 'illustration', label: 'Illustration' },
    { value: 'photographic', label: 'Photographic' },
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'anime', label: 'Anime' },
    { value: 'digital-art', label: 'Digital Art' },
    { value: '3d-render', label: '3D Render' }
  ]

  // Reset em cascata
  useEffect(() => {
    if (selectedProvider) {
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
      
      // Reset dimensions se não for válida
      if (!modelCapabilities.dimensions?.includes(dimensions) && modelCapabilities.dimensions?.length) {
        setDimensions(modelCapabilities.dimensions[0])
      }
      
      // Reset style
      if (!style && styleOptions.length > 0) {
        setStyle(styleOptions[0].value)
      }
      
      // Desabilitar image ref se não suportado
      if (!modelCapabilities.imageRef) {
        setHasImageRef(false)
      }
    }
  }, [selectedModel])

  // Calcular custos
  const totalCost = selectedModel ? calculateTotalCost(selectedModel, {
    hasImageRef
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
      🎨 Configuração de Imagem 301.demo:
      
      Provider: ${selectedProvider}
      Modelo: ${selectedModelConfig?.label}
      Prompt: ${prompt}
      Aspect Ratio: ${aspectRatio}
      Dimensões: ${dimensions}
      Estilo: ${style}
      
      Opcionais:
      - Imagem de Referência: ${hasImageRef ? 'Sim' : 'Não'}
      ${imageFile ? `- Arquivo de imagem: ${imageFile.name}` : ''}
      
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
              <span className="text-white text-2xl">🎨</span>
            </div>
          </div>
          <h2 className="text-2xl font-light mb-2">
            Create AI Images with <span className="font-medium">Advanced Models</span>
          </h2>
          <p className="text-sm text-zinc-400">
            Generate stunning images with our collection of AI image models
          </p>
        </div>

        {/* 5 Dropdowns */}
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
              {imageProviders.map(provider => (
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

          {/* 4. Dimensions */}
          <div className="relative">
            <label className="text-xs text-zinc-500 mb-1 block">4. Dimensions</label>
            <select
              value={dimensions}
              onChange={(e) => setDimensions(e.target.value)}
              disabled={!selectedModel || dimensionsOptions.length === 0}
              className="w-full px-3 py-2 bg-zinc-900/80 text-sm rounded-lg border border-zinc-800 focus:border-[#A259FF] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Size</option>
              {dimensionsOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Style */}
          <div className="relative">
            <label className="text-xs text-zinc-500 mb-1 block">5. Style</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              disabled={!selectedModel}
              className="w-full px-3 py-2 bg-zinc-900/80 text-sm rounded-lg border border-zinc-800 focus:border-[#A259FF] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Style</option>
              {styleOptions.map(option => (
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
              placeholder="Describe your image with as much detail as possible..."
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
                  <span className="text-zinc-400">Base image generation</span>
                  <span>{selectedModelConfig?.credits.base || 0} credits</span>
                </div>
                {hasImageRef && selectedModelConfig?.credits.imageRef && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Image reference</span>
                    <span className="text-yellow-500">+{selectedModelConfig.credits.imageRef} credits</span>
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