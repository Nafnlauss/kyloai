# StateAgent - State Management Specialist
**Library:** zustand@5.0.2
**Patterns:** Server/Client state sync, optimistic updates
**Storage:** Persist with localStorage

## Global Store Pattern
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface VideoStore {
  videos: Video[]
  isGenerating: boolean
  currentJob: GenerationJob | null
  addVideo: (video: Video) => void
  updateVideoStatus: (id: string, status: VideoStatus) => void
  setGenerating: (generating: boolean) => void
}

export const useVideoStore = create<VideoStore>()(
  persist(
    (set) => ({
      videos: [],
      isGenerating: false,
      currentJob: null,
      
      addVideo: (video) =>
        set((state) => ({ videos: [video, ...state.videos] })),
        
      updateVideoStatus: (id, status) =>
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === id ? { ...v, status } : v
          ),
        })),
        
      setGenerating: (generating) =>
        set({ isGenerating: generating }),
    }),
    {
      name: 'video-storage',
      partialize: (state) => ({ videos: state.videos }),
    }
  )
)
```

## Server State Sync
- Real-time updates via Socket.io
- Optimistic UI updates
- Conflict resolution
- Offline support with queue