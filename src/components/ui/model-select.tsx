'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { ModelConfig } from '@/config/all-models-config'

interface ModelSelectProps {
  models: ModelConfig[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ModelSelect({ models, value, onChange, disabled, placeholder = "Select Model" }: ModelSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const selectedModel = models.find(m => m.id === value)
  
  // Badge de custo
  const getCostBadge = (tier: 'low' | 'mid' | 'high') => {
    const badges = {
      low: { bg: 'bg-green-500/20', text: 'text-green-600', label: 'Low' },
      mid: { bg: 'bg-yellow-500/20', text: 'text-yellow-600', label: 'Mid' },
      high: { bg: 'bg-red-500/20', text: 'text-red-600', label: 'High' }
    }
    return badges[tier]
  }
  
  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const handleSelect = (modelId: string) => {
    onChange(modelId)
    setIsOpen(false)
  }
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-3 py-2 bg-zinc-900/80 text-sm rounded-lg border border-zinc-800 focus:border-[#A259FF] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
      >
        <span className="truncate">
          {selectedModel ? selectedModel.label : placeholder}
        </span>
        <div className="flex items-center gap-2">
          {selectedModel && (
            <span className={`${getCostBadge(selectedModel.costTier).bg} ${getCostBadge(selectedModel.costTier).text} rounded px-1.5 py-0.5 text-xs`}>
              {getCostBadge(selectedModel.costTier).label}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {models.length === 0 ? (
            <div className="px-3 py-2 text-sm text-zinc-500">No models available</div>
          ) : (
            models.map(model => {
              const badge = getCostBadge(model.costTier)
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => handleSelect(model.id)}
                  className={`w-full px-3 py-2 text-sm text-left hover:bg-zinc-800 flex items-center justify-between ${
                    model.id === value ? 'bg-zinc-800/50' : ''
                  }`}
                >
                  <span className="truncate">{model.label}</span>
                  <span className={`${badge.bg} ${badge.text} rounded px-1.5 py-0.5 text-xs ml-2`}>
                    {badge.label}
                  </span>
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}