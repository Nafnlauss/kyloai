'use client'

import { useState, useEffect } from 'react'
import { Volume2, Send, Mic, FileAudio, Languages, Zap } from 'lucide-react'
import { ModelSelect } from '@/components/ui/model-select'
import { InfoBox } from '@/components/ui/info-box'
import { ALL_MODELS, getModelsByMediaType, getModelById, calculateTotalCost, getAudioCapabilities } from '@/config/all-models-config'

export default function DemoAudioPage() {
  // Estados dos dropdowns
  const [selectedProvider, setSelectedProvider] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [selectedFormat, setSelectedFormat] = useState('mp3')
  
  // Estados adicionais
  const [text, setText] = useState('')
  const [hasVoiceClone, setHasVoiceClone] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)

  // Obter modelos de áudio disponíveis
  const audioModels = getModelsByMediaType('audio')
  
  // Obter lista de providers únicos que têm modelos de áudio
  const audioProviders = Array.from(
    new Set(audioModels.map(m => m.provider))
  ).sort()

  // Obter modelos do provider selecionado
  const providerModels = audioModels
    .filter(m => m.provider === selectedProvider)
    .sort((a, b) => {
      const tierOrder = { low: 0, mid: 1, high: 2 }
      return tierOrder[a.costTier] - tierOrder[b.costTier]
    })

  // Obter capacidades do modelo selecionado
  const selectedModelConfig = getModelById(selectedModel)
  const modelCapabilities = selectedModelConfig?.capabilities || {}

  // Obter capabilities dinâmicas baseadas no modelo específico
  const audioCapabilities = getAudioCapabilities(selectedModel)
  const voices = audioCapabilities.voices
  const languages = audioCapabilities.languages
  const formats = audioCapabilities.formats

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
      // Reset voice quando trocar de modelo/provider
      if (voices.length > 0) {
        setSelectedVoice(voices[0].value)
      }
      
      // Reset language
      if (languages.length > 0) {
        setSelectedLanguage(languages[0].value)
      }
      
      // Reset format
      if (formats.length > 0) {
        setSelectedFormat(formats[0].value)
      }
      
      // Desabilitar voice clone se não suportado
      if (!modelCapabilities.audioRef) {
        setHasVoiceClone(false)
      }
    }
  }, [selectedModel, selectedProvider])

  // Calcular custos
  const charCount = text.length
  const totalCost = selectedModel ? calculateTotalCost(selectedModel, {
    characters: charCount
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
    if (!selectedModel || !text.trim()) return

    alert(`
      🎵 Configuração de Áudio 301.demo:
      
      Provider: ${selectedProvider}
      Modelo: ${selectedModelConfig?.label}
      Texto: ${text.substring(0, 100)}...
      Caracteres: ${charCount}
      Voz: ${selectedVoice}
      Idioma: ${selectedLanguage}
      Formato: ${selectedFormat}
      
      Opcionais:
      - Voice Clone: ${hasVoiceClone ? 'Sim' : 'Não'}
      ${audioFile ? `- Arquivo de áudio: ${audioFile.name}` : ''}
      
      TOTAL: ${totalCost} créditos
    `)
  }

  const handleTextKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
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
              <span className="text-white text-2xl">🎵</span>
            </div>
          </div>
          <h2 className="text-2xl font-light mb-2">
            Create AI Audio with <span className="font-medium">Text-to-Speech</span>
          </h2>
          <p className="text-sm text-zinc-400">
            Transform your text into natural-sounding speech with advanced AI voices
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
              {audioProviders.map(provider => (
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

          {/* 3. Voice */}
          <div className="relative">
            <label className="text-xs text-zinc-500 mb-1 block">3. Voice</label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              disabled={!selectedModel}
              className="w-full px-3 py-2 bg-zinc-900/80 text-sm rounded-lg border border-zinc-800 focus:border-[#A259FF] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select Voice</option>
              {voices.map(voice => (
                <option key={voice.value} value={voice.value}>
                  {voice.label}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Language */}
          <div className="relative">
            <label className="text-xs text-zinc-500 mb-1 block">4. Language</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              disabled={!selectedModel}
              className="w-full px-3 py-2 bg-zinc-900/80 text-sm rounded-lg border border-zinc-800 focus:border-[#A259FF] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Format */}
          <div className="relative">
            <label className="text-xs text-zinc-500 mb-1 block">5. Format</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              disabled={!selectedModel}
              className="w-full px-3 py-2 bg-zinc-900/80 text-sm rounded-lg border border-zinc-800 focus:border-[#A259FF] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formats.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Text Input */}
          <div className="relative">
            <textarea
              placeholder="Enter the text you want to convert to speech..."
              className="w-full min-h-32 rounded-2xl bg-zinc-900/80 backdrop-blur p-4 text-sm placeholder-zinc-500 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleTextKeyDown}
              maxLength={modelCapabilities.maxCharacters || 5000}
            />
            
            {/* Character count */}
            <div className="absolute bottom-4 left-4 text-xs text-zinc-500">
              {charCount} / {modelCapabilities.maxCharacters || 5000} characters
            </div>
            
            {/* Send Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={!text.trim() || !selectedModel}
              className="absolute bottom-4 right-4 w-10 h-10 bg-[#A259FF] hover:bg-[#9050e6] disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Optional Features */}
          <div className="space-y-4">
            {/* Voice Clone */}
            {modelCapabilities.audioRef && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-zinc-900/80 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium">Voice Clone</p>
                      <p className="text-xs text-zinc-500">Upload audio sample for voice cloning</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={hasVoiceClone}
                      onChange={(e) => {
                        setHasVoiceClone(e.target.checked)
                        if (!e.target.checked) setAudioFile(null)
                      }}
                      className="w-4 h-4 accent-[#A259FF]"
                    />
                  </div>
                </div>
                
                {/* File input for audio */}
                {hasVoiceClone && (
                  <div className="ml-12 mr-4">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700"
                    />
                    <p className="text-xs text-zinc-500 mt-1">Upload a clear voice sample (10-30 seconds)</p>
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
                    Text-to-speech ({Math.ceil(charCount / 1000)}k chars)
                  </span>
                  <span>{totalCost} credits</span>
                </div>
                {selectedModelConfig?.label.includes('Music') && (
                  <div className="text-xs text-zinc-500 mt-2">
                    * Music generation models charge per complete song
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