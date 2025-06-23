import { create } from 'zustand'

interface VideoParams {
  model: string
  aspectRatio: string
  resolution: string
  audioMode: string
  prompt: string
  audioFile?: File
  startFrame?: File
  setParam: <K extends keyof VideoParams>(key: K, value: VideoParams[K]) => void
  reset: () => void
}

const defaultParams = {
  model: 'hedra-character-3',
  aspectRatio: '16:9',
  resolution: '720p',
  audioMode: 'auto',
  prompt: '',
  audioFile: undefined,
  startFrame: undefined,
}

export const useVideoParams = create<VideoParams>((set) => ({
  ...defaultParams,
  setParam: (key, value) => set((state) => ({ ...state, [key]: value })),
  reset: () => set(defaultParams),
}))