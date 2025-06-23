'use client'

import { useNotifications, useSocket } from '@/hooks/use-socket'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bell, CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colorMap = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
}

export function NotificationsDropdown() {
  const { notifications, clearNotifications, removeNotification } = useNotifications()
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearNotifications}
              className="h-auto p-1 text-xs"
            >
              Limpar tudo
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Nenhuma notificação
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            {notifications.map((notification) => {
              const Icon = iconMap[notification.type]
              const colorClass = colorMap[notification.type]
              
              return (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-3 p-3 cursor-default focus:bg-accent/50"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${colorClass}`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(notification.timestamp), "HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeNotification(notification.id)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </DropdownMenuItem>
              )
            })}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Componente para exibir o status de conexão
export function ConnectionStatus() {
  const { isConnected } = useSocket()
  
  if (isConnected) return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded-md shadow-lg flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      <span className="text-sm">Reconectando...</span>
    </div>
  )
}