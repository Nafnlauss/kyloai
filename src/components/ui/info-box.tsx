import React from 'react'
import { Info, Zap, Globe, Clock, Film, Volume2, Image } from 'lucide-react'
import { ModelConfig } from '@/config/all-models-config'

interface InfoBoxProps {
  model: ModelConfig
  className?: string
}

export function InfoBox({ model, className = '' }: InfoBoxProps) {
  const getMediaIcon = () => {
    switch (model.mediaType) {
      case 'video':
        return <Film className="w-4 h-4" />
      case 'audio':
        return <Volume2 className="w-4 h-4" />
      case 'image':
        return <Image className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  const getCostBadgeColor = () => {
    switch (model.costTier) {
      case 'low':
        return 'text-green-500 bg-green-500/10'
      case 'mid':
        return 'text-yellow-500 bg-yellow-500/10'
      case 'high':
        return 'text-red-500 bg-red-500/10'
    }
  }

  const getHighlights = () => {
    const highlights = []
    
    // Video specific
    if (model.mediaType === 'video') {
      if (model.capabilities.resolutions?.includes('8K')) {
        highlights.push({ icon: '🎬', text: '8K Resolution', color: 'text-purple-500' })
      } else if (model.capabilities.resolutions?.includes('4K')) {
        highlights.push({ icon: '📹', text: '4K Resolution', color: 'text-blue-500' })
      }
      
      if (model.capabilities.durations?.includes(120)) {
        highlights.push({ icon: '⏱️', text: 'Up to 120s', color: 'text-green-500' })
      } else if (model.capabilities.durations?.includes(60)) {
        highlights.push({ icon: '⏱️', text: 'Up to 60s', color: 'text-green-500' })
      }
      
      if (model.capabilities.lipSync) {
        highlights.push({ icon: '🎤', text: 'Native Lip-Sync', color: 'text-purple-500' })
      } else if (model.capabilities.lipSyncAvailable) {
        highlights.push({ icon: '🤖', text: 'AI Lip-Sync', color: 'text-orange-500' })
      }
    }
    
    // Image specific
    if (model.mediaType === 'image') {
      if (model.capabilities.dimensions?.includes('4096x4096')) {
        highlights.push({ icon: '✨', text: '4K Images', color: 'text-purple-500' })
      }
      
      if (model.label.includes('Ultra')) {
        highlights.push({ icon: '🚀', text: 'Ultra Quality', color: 'text-blue-500' })
      }
    }
    
    // Audio specific
    if (model.mediaType === 'audio') {
      if (model.label.includes('Music')) {
        highlights.push({ icon: '🎵', text: 'Music Generation', color: 'text-purple-500' })
      }
      
      if (model.label.includes('Multilingual')) {
        highlights.push({ icon: '🌍', text: 'Multilingual', color: 'text-blue-500' })
      }
      
      if (model.capabilities.audioRef) {
        highlights.push({ icon: '🎙️', text: 'Voice Clone', color: 'text-green-500' })
      }
    }
    
    // General
    if (model.capabilities.imageRef) {
      highlights.push({ icon: '🖼️', text: 'Image Input', color: 'text-indigo-500' })
    }
    
    return highlights
  }

  const highlights = getHighlights()

  return (
    <div className={`bg-zinc-900/50 rounded-lg p-4 space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {getMediaIcon()}
          <h3 className="text-sm font-medium text-white">Model Information</h3>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCostBadgeColor()}`}>
          {model.costTier.toUpperCase()}
        </span>
      </div>

      {/* Model Details */}
      <div className="space-y-2">
        <div className="text-xs space-y-1">
          <p className="text-zinc-400">
            <span className="text-zinc-500">Provider:</span>{' '}
            <span className="text-zinc-300">{model.provider}</span>
          </p>
          <p className="text-zinc-400">
            <span className="text-zinc-500">Model:</span>{' '}
            <span className="text-zinc-300">{model.label}</span>
          </p>
          <p className="text-zinc-400">
            <span className="text-zinc-500">Base Cost:</span>{' '}
            <span className="text-zinc-300">{model.credits.base} credits</span>
            {model.credits.perSecond && <span className="text-zinc-500"> /5s</span>}
            {model.credits.per1kChars && <span className="text-zinc-500"> /1k chars</span>}
          </p>
        </div>

        {/* Summary */}
        {model.summary && (
          <p className="text-xs text-zinc-400 italic">{model.summary}</p>
        )}

        {/* Capabilities */}
        {model.mediaType === 'video' && model.capabilities.aspectRatios && (
          <div className="text-xs">
            <span className="text-zinc-500">Aspect Ratios:</span>{' '}
            <span className="text-zinc-400">{model.capabilities.aspectRatios.join(', ')}</span>
          </div>
        )}

        {model.mediaType === 'video' && model.capabilities.resolutions && (
          <div className="text-xs">
            <span className="text-zinc-500">Resolutions:</span>{' '}
            <span className="text-zinc-400">{model.capabilities.resolutions.join(', ')}</span>
          </div>
        )}

        {model.mediaType === 'image' && model.capabilities.dimensions && (
          <div className="text-xs">
            <span className="text-zinc-500">Dimensions:</span>{' '}
            <span className="text-zinc-400">
              {model.capabilities.dimensions.slice(0, 3).join(', ')}
              {model.capabilities.dimensions.length > 3 && ` +${model.capabilities.dimensions.length - 3} more`}
            </span>
          </div>
        )}

        {model.mediaType === 'audio' && model.capabilities.maxCharacters && (
          <div className="text-xs">
            <span className="text-zinc-500">Max Characters:</span>{' '}
            <span className="text-zinc-400">{model.capabilities.maxCharacters.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Highlights */}
      {highlights.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className={`flex items-center gap-1 text-xs ${highlight.color}`}
            >
              <span>{highlight.icon}</span>
              <span>{highlight.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}