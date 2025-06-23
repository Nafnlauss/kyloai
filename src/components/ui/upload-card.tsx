'use client'

import { Plus, Upload } from 'lucide-react'
import { useRef } from 'react'

interface UploadCardProps {
  label: string
  file?: File
  onChange: (file: File | undefined) => void
  accept?: string
  required?: boolean
}

export function UploadCard({ label, file, onChange, accept, required }: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  const handleClick = () => {
    inputRef.current?.click()
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    onChange(file)
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      onChange(file)
    }
  }
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  
  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative w-24 h-32 border border-gray-800 rounded-lg hover:bg-gray-900/50 transition-colors flex flex-col items-center justify-center gap-2 group"
      >
        {file ? (
          <>
            <Upload className="w-5 h-5 text-[#A259FF]" />
            <span className="text-xs text-gray-400 text-center px-2 break-all line-clamp-2">
              {file.name}
            </span>
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-gray-300" />
            <span className="text-xs text-gray-500">{label}</span>
          </>
        )}
        {required && !file && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full" />
        )}
      </button>
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        aria-label={`Upload ${label}`}
      />
    </div>
  )
}