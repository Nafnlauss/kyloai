'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle,
  User,
  CreditCard,
  Video,
  Shield,
  X,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'user' | 'payment' | 'video' | 'system' | 'security'
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

// Mock notifications generator
function generateMockNotifications(): Notification[] {
  const now = new Date()
  return [
    {
      id: '1',
      title: 'Novo usuário premium',
      message: 'João Silva assinou o plano Professional',
      type: 'success',
      category: 'user',
      timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 min ago
      read: false,
      actionUrl: '/admin/users',
      actionLabel: 'Ver usuário',
    },
    {
      id: '2',
      title: 'Falha no processamento',
      message: '3 vídeos falharam no processamento com Kling AI',
      type: 'error',
      category: 'video',
      timestamp: new Date(now.getTime() - 15 * 60 * 1000), // 15 min ago
      read: false,
      actionUrl: '/admin/videos?status=FAILED',
      actionLabel: 'Ver vídeos',
    },
    {
      id: '3',
      title: 'Limite de API atingido',
      message: 'Luma Dream Machine atingiu 80% do limite diário',
      type: 'warning',
      category: 'system',
      timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
      read: true,
    },
    {
      id: '4',
      title: 'Pagamento processado',
      message: 'Recebido R$ 450,00 via Stripe',
      type: 'success',
      category: 'payment',
      timestamp: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
      read: true,
    },
    {
      id: '5',
      title: 'Tentativa de login suspeita',
      message: 'Múltiplas tentativas falhadas para admin@example.com',
      type: 'warning',
      category: 'security',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true,
      actionUrl: '/admin/audit',
      actionLabel: 'Ver logs',
    },
  ]
}

const iconMap = {
  user: User,
  payment: CreditCard,
  video: Video,
  system: AlertCircle,
  security: Shield,
}

const typeConfig = {
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-100' },
  success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  warning: { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  error: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load initial notifications
    setNotifications(generateMockNotifications())

    // Simulate real-time notifications
    const interval = setInterval(() => {
      const random = Math.random()
      if (random > 0.7) {
        // 30% chance of new notification every 30 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          title: 'Nova atividade',
          message: 'Novo evento ocorreu no sistema',
          type: ['info', 'success', 'warning', 'error'][Math.floor(Math.random() * 4)] as any,
          category: ['user', 'payment', 'video', 'system', 'security'][Math.floor(Math.random() * 5)] as any,
          timestamp: new Date(),
          read: false,
        }
        setNotifications(prev => [newNotification, ...prev])
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Notificações</DialogTitle>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  Marcar todas como lidas
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                >
                  Limpar tudo
                </Button>
              )}
            </div>
          </div>
          <DialogDescription>
            {notifications.length === 0
              ? 'Nenhuma notificação no momento'
              : `${notifications.length} notificações`}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] mt-6 pr-4">
          <div className="space-y-4">
            {notifications.map((notification) => {
              const TypeIcon = typeConfig[notification.type].icon
              const CategoryIcon = iconMap[notification.category]

              return (
                <div
                  key={notification.id}
                  className={cn(
                    'relative p-4 rounded-lg border transition-colors',
                    !notification.read && 'bg-accent/50'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                        typeConfig[notification.type].bg
                      )}
                    >
                      <TypeIcon
                        className={cn('h-4 w-4', typeConfig[notification.type].color)}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="h-3 w-3 text-muted-foreground" />
                            <p className="text-sm font-medium">{notification.title}</p>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          {notification.actionUrl && (
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.location.href = notification.actionUrl!
                              }}
                            >
                              {notification.actionLabel || 'Ver mais'}
                            </Button>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 -mr-2 -mt-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.timestamp, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="absolute top-4 right-12 h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}