'use client'

import { useState } from 'react'
import { Sparkles, Monitor, Grid3x3, Palette, Send, Brush } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { ChipSelect } from '@/components/ui/chip-select'
import { UploadCard } from '@/components/ui/upload-card'
import { useImageParams } from '@/stores/image-params'

const modelOptions = [
  { label: 'Kylo Image Pro', value: 'kylo-image-pro', hint: '~2 credits' },
  { label: 'Kylo Image Fast', value: 'kylo-image-fast', hint: '~1 credit' },
  { label: 'Flux Pro', value: 'flux-pro', hint: '~3 credits' },
  { label: 'Stable Diffusion XL', value: 'sdxl', hint: '~2 credits' },
]

const aspectRatioOptions = [
  { label: '1:1', value: '1:1' },
  { label: '4:5', value: '4:5' },
  { label: '16:9', value: '16:9' },
  { label: '21:9', value: '21:9' },
  { label: '3:2', value: '3:2' },
  { label: '2:3', value: '2:3' },
  { label: '3:4', value: '3:4' },
]

const dimensionsOptions = [
  { label: '1024×1024', value: '1024x1024' },
  { label: '1536×768', value: '1536x768' },
  { label: '768×1536', value: '768x1536' },
  { label: '1536×658', value: '1536x658' },
]

const styleOptions = [
  { label: 'Vivid', value: 'vivid' },
  { label: 'Natural', value: 'natural' },
  { label: 'Illustration', value: 'illustration' },
  { label: 'Anime', value: 'anime' },
]

export default function ImageStudioPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    model,
    aspectRatio,
    dimensions,
    style,
    prompt,
    refImage,
    setParam,
  } = useImageParams()
  
  const selectedModel = modelOptions.find(m => m.value === model)
  const modelName = selectedModel?.label || 'AI Model'
  
  // Calculate credits based on model and dimensions
  const calculateCredits = () => {
    const baseCredits = {
      'flux-kontext-pro-t2i': 2,
      'imagen4': 3,
      'flux-dev': 1,
      'flux-11-pro': 4,
    }
    
    const dimensionMultiplier = dimensions === '1536x768' || dimensions === '768x1536' ? 1.5 : 1
    return Math.ceil((baseCredits[model as keyof typeof baseCredits] || 2) * dimensionMultiplier)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('prompt', prompt)
      formData.append('model', model)
      formData.append('aspectRatio', aspectRatio)
      formData.append('dimensions', dimensions)
      formData.append('style', style)
      if (refImage) {
        formData.append('refImage', refImage)
      }

      const response = await fetch('/api/images/generate', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image')
      }

      toast({
        title: 'Success',
        description: 'Image generation started!',
      })

      router.push(`/studio/image/${data.imageId}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate image',
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
            Create an image with <span className="font-medium">{modelName}</span>
          </h2>
          <p className="text-sm text-zinc-400">
            Transform your ideas into stunning AI-generated images. Describe what you want to create.
          </p>
        </div>

        {/* Parameters Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <ChipSelect
            icon={<Brush className="w-3.5 h-3.5" />}
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
            icon={<Grid3x3 className="w-3.5 h-3.5" />}
            value={dimensions}
            onChange={(v) => setParam('dimensions', v)}
            options={dimensionsOptions}
          />
          <ChipSelect
            icon={<Palette className="w-3.5 h-3.5" />}
            value={style}
            onChange={(v) => setParam('style', v)}
            options={styleOptions}
          />
        </div>

        {/* Main Content Area */}
        <div className="space-y-6">
          {/* Prompt Input with Reference Image */}
          <div className="flex gap-4 items-start">
            <div className="flex-1 relative">
              <textarea
                placeholder="Describe your image with as much detail as possible..."
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
                disabled={isSubmitting || !prompt.trim()}
                className="absolute bottom-4 right-4 w-10 h-10 bg-[#A259FF] hover:bg-[#9050e6] disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-full flex items-center justify-center transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            
            {/* Reference Image on Desktop */}
            <div className="hidden md:block">
              <UploadCard
                label="Reference Image"
                file={refImage}
                onChange={(file) => setParam('refImage', file)}
                accept="image/*"
              />
            </div>
          </div>
          
          {/* Reference Image on Mobile */}
          <div className="block md:hidden flex justify-center">
            <UploadCard
              label="Reference Image"
              file={refImage}
              onChange={(file) => setParam('refImage', file)}
              accept="image/*"
            />
          </div>

          {/* Credits Info */}
          <div className="text-center text-sm text-zinc-500">
            Total cost: <span className="text-[#A259FF] font-medium">{calculateCredits()} credits</span>
          </div>
        </div>
      </div>
    </div>
  )
}