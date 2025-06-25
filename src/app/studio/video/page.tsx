'use client'

import { useState } from 'react'
import { Sparkles, Monitor, Camera, Volume2, Send, Cpu } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { ChipSelect } from '@/components/ui/chip-select'
import { UploadCard } from '@/components/ui/upload-card'
import { useVideoParams } from '@/stores/video-params'
import Image from 'next/image'

const modelOptions = [
  { label: 'Kylo Pro', value: 'kylo-pro', hint: '~8 credits per sec' },
  { label: 'Kylo Fast', value: 'kylo-fast', hint: '~5 credits per sec' },
  { label: 'Luma Dream Machine', value: 'luma-v2', hint: '~6 credits per sec' },
  { label: 'Kling 2.1', value: 'kling-2.1', hint: '~7 credits per sec' },
  { label: 'Kling 1.6', value: 'kling-1.6', hint: '~5 credits per sec' },
  { label: 'Minimax', value: 'minimax', hint: '~4 credits per sec' },
]

const aspectRatioOptions = [
  { label: '1:1', value: '1:1' },
  { label: '4:5', value: '4:5' },
  { label: '16:9', value: '16:9' },
  { label: '9:16', value: '9:16' },
]

const resolutionOptions = [
  { label: '720p', value: '720p' },
  { label: '1080p', value: '1080p' },
  { label: '4K', value: '4k' },
]

const audioModeOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'On', value: 'on' },
  { label: 'Off', value: 'off' },
]

export default function VideoStudioPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    model,
    aspectRatio,
    resolution,
    audioMode,
    prompt,
    audioFile,
    startFrame,
    setParam,
  } = useVideoParams()
  
  const selectedModel = modelOptions.find(m => m.value === model)
  const modelName = selectedModel?.label || 'AI Model'

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt',
        variant: 'destructive',
      })
      return
    }

    if (!audioFile) {
      toast({
        title: 'Error',
        description: 'Please upload an audio script',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('prompt', prompt)
      formData.append('provider', model)
      formData.append('aspectRatio', aspectRatio)
      formData.append('resolution', resolution)
      formData.append('audioMode', audioMode)
      formData.append('audioFile', audioFile)
      if (startFrame) {
        formData.append('startFrame', startFrame)
      }

      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video')
      }

      toast({
        title: 'Success',
        description: 'Video generation started!',
      })

      router.push(`/studio/video/${data.videoId}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate video',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePromptKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleGenerate()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-4">
            <div className="w-12 h-12 bg-[#A259FF] rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl">◆</span>
            </div>
          </div>
          <h2 className="text-2xl font-light mb-2">
            Create a video with <span className="font-medium">{modelName}</span>
          </h2>
          <p className="text-sm text-zinc-400">
            Transform your ideas into stunning AI-generated videos. Add your prompt and optional media below.
          </p>
        </div>

        {/* Parameters Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <ChipSelect
            icon={<Cpu className="w-3.5 h-3.5" />}
            value={model}
            onChange={(v) => setParam('model', v)}
            options={modelOptions}
          />
          <ChipSelect
            icon={<Monitor className="w-3.5 h-3.5" />}
            value={aspectRatio}
            onChange={(v) => setParam('aspectRatio', v)}
            options={aspectRatioOptions}
          />
          <ChipSelect
            icon={<Camera className="w-3.5 h-3.5" />}
            value={resolution}
            onChange={(v) => setParam('resolution', v)}
            options={resolutionOptions}
          />
          <ChipSelect
            icon={<Volume2 className="w-3.5 h-3.5" />}
            value={audioMode}
            onChange={(v) => setParam('audioMode', v)}
            options={audioModeOptions}
          />
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="relative">
            <textarea
              placeholder="Describe your video idea..."
              className="w-full min-h-20 rounded-2xl bg-zinc-900/80 backdrop-blur p-4 text-sm placeholder-zinc-500 resize-none focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
              value={prompt}
              onChange={(e) => setParam('prompt', e.target.value)}
              onKeyDown={handlePromptKeyDown}
            />
            
            {/* Inspire Me Button */}
            <button 
              type="button"
              className="absolute bottom-4 left-4 text-xs text-zinc-600 hover:text-zinc-400 flex items-center gap-1 border border-zinc-700 rounded-md px-3 py-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Inspire me
            </button>
            
            {/* Send Button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isSubmitting || !prompt.trim() || !audioFile}
              className="absolute bottom-4 right-4 w-10 h-10 bg-[#A259FF] hover:bg-[#9050e6] disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Upload Cards */}
          <div className="flex justify-center gap-4">
            <UploadCard
              label="Audio script"
              file={audioFile}
              onChange={(file) => setParam('audioFile', file)}
              accept="audio/*"
              required
            />
            <UploadCard
              label="Start frame"
              file={startFrame}
              onChange={(file) => setParam('startFrame', file)}
              accept="image/*"
            />
          </div>

          {/* Credits Info */}
          <div className="text-center text-sm text-zinc-500">
            Estimated cost: <span className="text-[#A259FF] font-medium">30 credits</span>
          </div>
        </div>
      </div>
    </div>
  )
}