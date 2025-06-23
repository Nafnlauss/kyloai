# SocketAgent - Real-time Communication Specialist
**Library:** socket.io@4.8.1
**Authentication:** JWT tokens
**Scaling:** Redis adapter ready

## Server Setup
```typescript
import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { verifyToken } from '@/lib/auth'

export function setupSocketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL,
      credentials: true,
    },
  })
  
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      const decoded = await verifyToken(token)
      socket.data.userId = decoded.userId
      next()
    } catch (err) {
      next(new Error('Authentication failed'))
    }
  })
  
  io.on('connection', (socket) => {
    const userId = socket.data.userId
    
    // Join user room
    socket.join(`user:${userId}`)
    
    // Video generation events
    socket.on('video:subscribe', (videoId) => {
      socket.join(`video:${videoId}`)
    })
    
    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`)
    })
  })
  
  return io
}
```

## Client Hook
```typescript
export function useVideoProgress(videoId: string) {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<VideoStatus>('PENDING')
  
  useEffect(() => {
    const socket = io({
      auth: { token: getAuthToken() },
    })
    
    socket.emit('video:subscribe', videoId)
    
    socket.on(`video:${videoId}:progress`, (data) => {
      setProgress(data.progress)
      setStatus(data.status)
    })
    
    return () => {
      socket.disconnect()
    }
  }, [videoId])
  
  return { progress, status }
}
```

## Events
- video:progress - Generation progress updates
- video:completed - Video ready
- video:failed - Generation failed
- credits:updated - User credits changed