'use client'

import { useState } from 'react'
import { Mic, Globe, User, Activity, Send, Sparkles, Play, Pause, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { ChipSelect } from '@/components/ui/chip-select'
import { Slider } from '@/components/ui/slider'
import { useAudioParams } from '@/stores/audio-params'

const modelOptions = [
  { label: 'Eleven Multilingual V2', value: 'eleven-multilingual-v2', hint: '~1 credit/100 chars' },
  { label: 'Eleven Labs V1', value: 'eleven-labs-v1', hint: '~0.8 credits/100 chars' },
  { label: 'Eleven Labs V2', value: 'eleven-labs-v2', hint: '~1.2 credits/100 chars' },
  { label: 'Bark Large (Premium)', value: 'bark-large', hint: '~2 credits/100 chars' },
]

const voiceOptions = [
  { label: 'Choose voice', value: '' },
  { label: 'Rachel (Female)', value: 'rachel' },
  { label: 'Adam (Male)', value: 'adam' },
  { label: 'Sofia (Spanish)', value: 'sofia' },
  { label: 'Antoni (Male)', value: 'antoni' },
  { label: 'Bella (Female)', value: 'bella' },
  { label: 'Clone custom', value: 'custom' },
]

const languageOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'English (US)', value: 'en-US' },
  { label: 'Portuguese (BR)', value: 'pt-BR' },
  { label: 'Spanish (ES)', value: 'es-ES' },
  { label: 'French', value: 'fr-FR' },
  { label: 'German', value: 'de-DE' },
  { label: 'Italian', value: 'it-IT' },
  { label: 'Japanese', value: 'ja-JP' },
]

export default function AudioStudioPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const {
    model,
    voice,
    language,
    speed,
    stability,
    text,
    setParam,
  } = useAudioParams()
  
  const selectedModel = modelOptions.find(m => m.value === model)
  const modelName = selectedModel?.label || 'AI Model'
  
  // Calculate credits based on text length and model
  const calculateCredits = () => {
    const creditRates = {
      'eleven-multilingual-v2': 1,
      'eleven-labs-v1': 0.8,
      'eleven-labs-v2': 1.2,
      'bark-large': 2,
    }
    
    const chars = text.length
    const rate = creditRates[model as keyof typeof creditRates] || 1
    return Math.ceil(chars / 100) * rate
  }

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text',
        variant: 'destructive',
      })
      return
    }

    if (!voice) {
      toast({
        title: 'Error',
        description: 'Please select a voice',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/audio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          model,
          voice,
          language,
          speed,
          stability,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate audio')
      }

      toast({
        title: 'Success',
        description: 'Audio generation started!',
      })

      setGeneratedAudio(data.audioUrl)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate audio',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  // Update cost when text changes
  const cost = calculateCredits()
  if (cost !== useAudioParams.getState().cost) {
    setParam('cost', cost)
  }

  return (
    <div className="min-h-screen flex">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[55%_45%] w-full">
        {/* Left Column - Controls */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
                <div className="w-12 h-12 bg-[#A259FF] rounded-lg flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-light mb-2">
                Create audio with <span className="font-medium">{modelName}</span>
              </h2>
              <p className="text-sm text-zinc-400">
                Convert text to natural-sounding speech in multiple languages and voices.
              </p>
            </div>

            {/* Parameters Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <ChipSelect
                icon={<Activity className="w-3.5 h-3.5" />}
                value={model}
                onChange={(v) => setParam('model', v)}
                options={modelOptions}
              />
              <ChipSelect
                icon={<User className="w-3.5 h-3.5" />}
                value={voice}
                onChange={(v) => setParam('voice', v)}
                options={voiceOptions}
              />
              <ChipSelect
                icon={<Globe className="w-3.5 h-3.5" />}
                value={language}
                onChange={(v) => setParam('language', v)}
                options={languageOptions}
              />
            </div>

            {/* Sliders */}
            <div className="space-y-4 mb-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-zinc-400">Speed</label>
                  <span className="text-sm text-[#A259FF] font-medium">{speed.toFixed(2)}×</span>
                </div>
                <Slider
                  value={[speed]}
                  onValueChange={([v]) => setParam('speed', v)}
                  min={0.75}
                  max={1.25}
                  step={0.05}
                  className="[&_[role=slider]]:bg-[#A259FF]"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-zinc-400">Stability</label>
                  <span className="text-sm text-[#A259FF] font-medium">{stability}%</span>
                </div>
                <Slider
                  value={[stability]}
                  onValueChange={([v]) => setParam('stability', v)}
                  min={0}
                  max={100}
                  step={5}
                  className="[&_[role=slider]]:bg-[#A259FF]"
                />
              </div>
            </div>

            {/* Text Input */}
            <div className="space-y-4">
              <div className="relative">
                <textarea
                  placeholder="Start typing or paste your text here..."
                  className="w-full min-h-48 rounded-2xl bg-zinc-900/80 backdrop-blur p-4 text-sm placeholder-zinc-500 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                  value={text}
                  onChange={(e) => setParam('text', e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={5000}
                />
                <div className="absolute bottom-4 left-4 text-xs text-zinc-500">
                  {text.length} / 5000 characters
                </div>
              </div>

              {/* Total Cost */}
              <div className="text-sm text-zinc-500">
                Total cost: <span className="text-[#A259FF] font-medium">{cost} credits</span>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isSubmitting || !text.trim() || !voice || cost === 0}
                className="w-full h-12 bg-[#A259FF] hover:bg-[#9050e6] disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Generating audio...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Generate audio</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="bg-zinc-900/50 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {generatedAudio ? (
              <div className="bg-zinc-800/50 rounded-xl p-6 space-y-4">
                <div className="h-24 bg-zinc-700/50 rounded-lg flex items-center justify-center">
                  {/* Waveform visualization would go here */}
                  <div className="text-zinc-500 text-sm">Audio waveform</div>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 bg-[#A259FF] hover:bg-[#9050e6] rounded-full flex items-center justify-center transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                  </button>
                  
                  <button className="w-12 h-12 bg-zinc-700 hover:bg-zinc-600 rounded-full flex items-center justify-center transition-colors">
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                <div className="text-center text-sm text-zinc-500">
                  <div>Duration: 0:45</div>
                  <div>Credits used: {cost}</div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-zinc-800 rounded-lg flex items-center justify-center mx-auto">
                  <Mic className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-500">
                  Your audio file will appear here...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden flex items-center justify-center p-4 w-full">
        <div className="w-full max-w-2xl space-y-6">
          {/* Same content as desktop left column */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
              <div className="w-12 h-12 bg-[#A259FF] rounded-lg flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-light mb-2">
              Create audio with <span className="font-medium">{modelName}</span>
            </h2>
            <p className="text-sm text-zinc-400">
              Convert text to natural-sounding speech.
            </p>
          </div>

          {/* Mobile parameters */}
          <div className="flex flex-wrap justify-center gap-2">
            <ChipSelect
              icon={<Activity className="w-3.5 h-3.5" />}
              value={model}
              onChange={(v) => setParam('model', v)}
              options={modelOptions}
            />
            <ChipSelect
              icon={<User className="w-3.5 h-3.5" />}
              value={voice}
              onChange={(v) => setParam('voice', v)}
              options={voiceOptions}
            />
            <ChipSelect
              icon={<Globe className="w-3.5 h-3.5" />}
              value={language}
              onChange={(v) => setParam('language', v)}
              options={languageOptions}
            />
          </div>

          {/* Rest of the mobile content */}
          {/* ... (same as desktop but stacked) */}
        </div>
      </div>
    </div>
  )
}