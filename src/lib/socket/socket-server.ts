import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { NextApiRequest } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import jwt from 'jsonwebtoken'

export interface SocketWithAuth extends SocketIOServer {
  userId?: string
  sessionId?: string
}

let io: SocketIOServer | null = null

export function getSocketServer(httpServer?: HTTPServer): SocketIOServer | null {
  // Skip Socket.IO initialization during build
  if (process.env.NODE_ENV === 'production' && !process.env.REDIS_URL) {
    return null
  }
  
  if (!io && httpServer) {
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    })

    // Middleware de autenticação
    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token
        
        if (!token) {
          return next(new Error('Authentication token required'))
        }

        // Verificar JWT token
        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any
        
        if (!decoded.sub) {
          return next(new Error('Invalid token'))
        }

        // Adicionar userId ao socket
        (socket as any).userId = decoded.sub
        (socket as any).sessionId = socket.id
        
        next()
      } catch (error) {
        next(new Error('Authentication failed'))
      }
    })

    // Configurar eventos
    io.on('connection', (socket) => {
      const userId = (socket as any).userId
      console.log(`User ${userId} connected with socket ${socket.id}`)

      // Entrar na sala do usuário
      socket.join(`user:${userId}`)

      // Eventos de vídeo
      socket.on('video:subscribe', (videoId: string) => {
        socket.join(`video:${videoId}`)
        console.log(`User ${userId} subscribed to video ${videoId}`)
      })

      socket.on('video:unsubscribe', (videoId: string) => {
        socket.leave(`video:${videoId}`)
        console.log(`User ${userId} unsubscribed from video ${videoId}`)
      })

      // Ping/Pong para manter conexão ativa
      socket.on('ping', () => {
        socket.emit('pong')
      })

      socket.on('disconnect', () => {
        console.log(`User ${userId} disconnected`)
      })
    })
  }

  return io
}

// Funções utilitárias para emitir eventos

export function emitToUser(userId: string, event: string, data: any) {
  const server = getSocketServer()
  if (server) {
    server.to(`user:${userId}`).emit(event, data)
  }
}

export function emitToVideo(videoId: string, event: string, data: any) {
  const server = getSocketServer()
  if (server) {
    server.to(`video:${videoId}`).emit(event, data)
  }
}

export function emitVideoStatusUpdate(userId: string, videoId: string, status: {
  videoId: string
  status: string
  progress?: number
  url?: string
  thumbnailUrl?: string
  error?: string
}) {
  const server = getSocketServer()
  
  if (server) {
    // Emitir para o usuário
    server.to(`user:${userId}`).emit('video:status', status)
    
    // Emitir para quem está assistindo este vídeo específico
    server.to(`video:${videoId}`).emit('video:status', status)
  }
}

export function emitNotification(userId: string, notification: {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
}) {
  emitToUser(userId, 'notification', notification)
}

export function emitCreditsUpdate(userId: string, credits: number) {
  emitToUser(userId, 'credits:update', { credits })
}

// Broadcast para todos os usuários conectados
export function broadcast(event: string, data: any) {
  const server = getSocketServer()
  if (server) {
    server.emit(event, data)
  }
}

// Desconectar usuário específico
export function disconnectUser(userId: string) {
  const server = getSocketServer()
  if (server) {
    const sockets = server.sockets.sockets
    
    sockets.forEach((socket) => {
      if ((socket as any).userId === userId) {
        socket.disconnect(true)
      }
    })
  }
}