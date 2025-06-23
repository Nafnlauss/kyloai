import { create } from 'zustand'

interface AudioParams {
  model: string
  voice: string
  language: string
  speed: number
  stability: number
  text: string
  cost: number
  setParam: <K extends keyof AudioParams>(key: K, value: AudioParams[K]) => void
  reset: () => void
}

const defaultParams = {
  model: 'eleven-multilingual-v2',
  voice: '',
  language: 'auto',
  speed: 1.0,
  stability: 50,
  text: '',
  cost: 0,
}

export const useAudioParams = create<AudioParams>((set) => ({
  ...defaultParams,
  setParam: (key, value) => set((state) => ({ ...state, [key]: value })),
  reset: () => set(defaultParams),
}))