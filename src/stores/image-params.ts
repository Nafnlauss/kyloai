import { create } from 'zustand'

interface ImageParams {
  model: string
  aspectRatio: string
  dimensions: string
  style: string
  prompt: string
  refImage?: File
  setParam: <K extends keyof ImageParams>(key: K, value: ImageParams[K]) => void
  reset: () => void
}

const defaultParams = {
  model: 'flux-kontext-pro-t2i',
  aspectRatio: '16:9',
  dimensions: '1536x658',
  style: 'vivid',
  prompt: '',
  refImage: undefined,
}

export const useImageParams = create<ImageParams>((set) => ({
  ...defaultParams,
  setParam: (key, value) => set((state) => ({ ...state, [key]: value })),
  reset: () => set(defaultParams),
}))