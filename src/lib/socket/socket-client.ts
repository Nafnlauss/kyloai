import { io, Socket } from 'socket.io-client'
import { getSession } from 'next-auth/react'

let socket: Socket | null = null

export async function getSocket(): Promise<Socket> {
  if (!socket) {
    const session = await getSession()
    
    if (!session) {
      throw new Error('No session found')
    }

    socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      transports: ['websocket', 'polling'],
      auth: {
        token: session.accessToken || session.user?.id,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    })

    // Eventos de conexão
    socket.on('connect', () => {
      console.log('Connected to server')
    })

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason)
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message)
    })

    // Manter conexão ativa
    setInterval(() => {
      if (socket?.connected) {
        socket.emit('ping')
      }
    }, 30000) // Ping a cada 30 segundos
  }

  return socket
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

// Subscrever a eventos de vídeo
export async function subscribeToVideo(videoId: string) {
  const socket = await getSocket()
  socket.emit('video:subscribe', videoId)
}

export async function unsubscribeFromVideo(videoId: string) {
  const socket = await getSocket()
  socket.emit('video:unsubscribe', videoId)
}

// Event listeners helpers
export async function onVideoStatus(callback: (data: any) => void) {
  const socket = await getSocket()
  socket.on('video:status', callback)
  
  return () => {
    socket.off('video:status', callback)
  }
}

export async function onNotification(callback: (data: any) => void) {
  const socket = await getSocket()
  socket.on('notification', callback)
  
  return () => {
    socket.off('notification', callback)
  }
}

export async function onCreditsUpdate(callback: (data: { credits: number }) => void) {
  const socket = await getSocket()
  socket.on('credits:update', callback)
  
  return () => {
    socket.off('credits:update', callback)
  }
}