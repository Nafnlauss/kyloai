'use client'

import { ReactElement, useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface ChipSelectProps<T> {
  icon: ReactElement
  value: T
  onChange: (v: T) => void
  options: { label: string; value: T; hint?: string }[]
  label?: string
}

export function ChipSelect<T extends string | number>({
  icon,
  value,
  onChange,
  options,
  label
}: ChipSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  
  const selectedOption = options.find(opt => opt.value === value)
  const displayLabel = selectedOption?.label || label || 'Select'
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])
  
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="rounded-full bg-zinc-800/60 backdrop-blur text-xs px-3 h-6 flex items-center gap-1 hover:bg-zinc-700/60 transition-colors"
      >
        <span className="w-3.5 h-3.5 flex items-center justify-center">
          {icon}
        </span>
        <span>{displayLabel}</span>
        <ChevronDown className="w-3 h-3 ml-0.5" />
      </button>
      
      {isOpen && (
        <div className="absolute top-7 left-0 z-50 min-w-[180px] rounded-lg bg-zinc-900 border border-zinc-800 shadow-xl overflow-hidden">
          <div className="max-h-72 overflow-y-auto">
            {options.map((option) => (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-800 transition-colors flex flex-col"
              >
                <span className={option.value === value ? 'text-[#A259FF]' : 'text-white'}>
                  {option.label}
                </span>
                {option.hint && (
                  <span className="text-xs text-zinc-500 mt-0.5">{option.hint}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}