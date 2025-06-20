import { useEffect, useState, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { 
  getSocket, 
  disconnectSocket, 
  subscribeToVideo, 
  unsubscribeFromVideo,
  onVideoStatus,
  onNotification,
  onCreditsUpdate
} from '@/lib/socket/socket-client'
import { toast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'

export function useSocket() {
  const { data: session } = useSession()
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<any>(null)

  useEffect(() => {
    if (!session) return

    const initSocket = async () => {
      try {
        const socket = await getSocket()
        socketRef.current = socket
        
        socket.on('connect', () => setIsConnected(true))
        socket.on('disconnect', () => setIsConnected(false))
        
      } catch (error) {
        console.error('Socket initialization error:', error)
      }
    }

    initSocket()

    return () => {
      if (socketRef.current) {
        disconnectSocket()
      }
    }
  }, [session])

  return { isConnected, socket: socketRef.current }
}

export function useVideoStatus(videoId: string | null) {
  const [status, setStatus] = useState<any>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!videoId) return

    let unsubscribe: (() => void) | null = null

    const setupListener = async () => {
      // Subscrever ao vídeo
      await subscribeToVideo(videoId)
      
      // Escutar atualizações
      unsubscribe = await onVideoStatus((data) => {
        if (data.videoId === videoId) {
          setStatus(data)
          
          // Invalidar queries relacionadas quando o vídeo for concluído
          if (data.status === 'COMPLETED' || data.status === 'FAILED') {
            queryClient.invalidateQueries({ queryKey: ['videos'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
          }
        }
      })
    }

    setupListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      if (videoId) {
        unsubscribeFromVideo(videoId).catch(console.error)
      }
    }
  }, [videoId, queryClient])

  return status
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])
  
  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const setupListener = async () => {
      unsubscribe = await onNotification((notification) => {
        // Adicionar notificação à lista
        setNotifications(prev => [notification, ...prev].slice(0, 10)) // Manter apenas 10 últimas
        
        // Mostrar toast
        toast({
          title: notification.title,
          description: notification.message,
          variant: notification.type === 'error' ? 'destructive' : 'default',
        })
      })
    }

    setupListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return {
    notifications,
    clearNotifications,
    removeNotification,
  }
}

export function useCreditsUpdate() {
  const queryClient = useQueryClient()
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    let unsubscribe: (() => void) | null = null

    const setupListener = async () => {
      unsubscribe = await onCreditsUpdate((data) => {
        setCredits(data.credits)
        
        // Atualizar queries relacionadas
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
        queryClient.invalidateQueries({ queryKey: ['user'] })
        
        // Mostrar notificação
        toast({
          title: 'Créditos atualizados',
          description: `Você agora tem ${data.credits} créditos disponíveis.`,
        })
      })
    }

    setupListener()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [queryClient])

  return credits
}

// Hook para monitorar múltiplos vídeos (útil para a galeria)
export function useMultipleVideoStatus(videoIds: string[]) {
  const [statuses, setStatuses] = useState<Record<string, any>>({})
  const queryClient = useQueryClient()

  useEffect(() => {
    if (videoIds.length === 0) return

    let unsubscribe: (() => void) | null = null
    const subscriptions: Promise<void>[] = []

    const setupListeners = async () => {
      // Subscrever a todos os vídeos
      for (const videoId of videoIds) {
        subscriptions.push(subscribeToVideo(videoId))
      }
      
      await Promise.all(subscriptions)
      
      // Escutar atualizações
      unsubscribe = await onVideoStatus((data) => {
        if (videoIds.includes(data.videoId)) {
          setStatuses(prev => ({
            ...prev,
            [data.videoId]: data,
          }))
          
          // Invalidar queries quando um vídeo for concluído
          if (data.status === 'COMPLETED' || data.status === 'FAILED') {
            queryClient.invalidateQueries({ queryKey: ['videos'] })
          }
        }
      })
    }

    setupListeners()

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
      // Cancelar inscrições
      videoIds.forEach(videoId => {
        unsubscribeFromVideo(videoId).catch(console.error)
      })
    }
  }, [videoIds.join(','), queryClient])

  return statuses
}