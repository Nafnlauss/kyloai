'use client'

import { useState, useRef } from 'react'
import { ImageIcon, X, Upload } from 'lucide-react'

interface ImageReferenceInputProps {
  cost?: number
  onChange: (file: File | null) => void
  className?: string
}

export function ImageReferenceInput({ cost, onChange, className = '' }: ImageReferenceInputProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (file) {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      setFileName(file.name)
      onChange(file)
    } else {
      clearFile()
    }
  }

  const clearFile = () => {
    setPreview(null)
    setFileName(null)
    onChange(null)
    // Reset file input using ref
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`p-4 bg-zinc-900/80 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <ImageIcon className="w-5 h-5 text-zinc-400" />
          <div>
            <p className="text-sm font-medium">Reference Image</p>
            <p className="text-xs text-zinc-500">Upload an image for style reference (optional)</p>
          </div>
        </div>
        {cost && cost > 0 && (
          <span className="text-xs text-zinc-500">+{cost} credits</span>
        )}
      </div>

      {!preview ? (
        <label
          htmlFor="image-ref-input"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-700 border-dashed rounded-lg cursor-pointer bg-zinc-800/50 hover:bg-zinc-800/80 transition-colors"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-zinc-500" />
            <p className="mb-2 text-sm text-zinc-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-zinc-500">PNG, JPG or GIF (MAX. 10MB)</p>
          </div>
          <input
            ref={fileInputRef}
            id="image-ref-input"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="relative">
          <div className="relative h-32 bg-zinc-800 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={preview}
              alt="Preview"
              className="max-h-full max-w-full object-contain"
            />
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="mt-2 text-xs text-zinc-500 truncate">
            Selected: {fileName}
          </p>
        </div>
      )}
    </div>
  )
}