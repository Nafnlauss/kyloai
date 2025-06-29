'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDistanceToNow } from 'date-fns'
import { 
  ExternalLink, 
  AlertCircle, 
  User, 
  Calendar,
  Activity,
  Code,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface SentryErrorDetailsProps {
  alert: {
    id: string
    title: string
    message: string
    timestamp: Date
    priority: string
    metadata?: {
      issueId?: string
      project?: string
      platform?: string
      firstSeen?: string
      lastSeen?: string
      count?: string
      userCount?: number
    }
  }
  isOpen: boolean
  onClose: () => void
  onResolve?: (issueId: string) => void
}

export function SentryErrorDetails({ 
  alert, 
  isOpen, 
  onClose,
  onResolve 
}: SentryErrorDetailsProps) {
  const [loading, setLoading] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    if (isOpen && alert.metadata?.issueId) {
      fetchEvents()
    }
  }, [isOpen, alert.metadata?.issueId])

  const fetchEvents = async () => {
    if (!alert.metadata?.issueId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/admin/alerts/sentry/events?issueId=${alert.metadata.issueId}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async () => {
    if (!alert.metadata?.issueId) return

    try {
      setResolving(true)
      const response = await fetch('/api/admin/alerts/sentry', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueId: alert.metadata.issueId,
          status: 'resolved'
        })
      })

      if (response.ok) {
        toast.success('Issue marked as resolved')
        onResolve?.(alert.metadata.issueId)
        onClose()
      } else {
        toast.error('Failed to resolve issue')
      }
    } catch (error) {
      toast.error('Error resolving issue')
    } finally {
      setResolving(false)
    }
  }

  const handleIgnore = async () => {
    if (!alert.metadata?.issueId) return

    try {
      setResolving(true)
      const response = await fetch('/api/admin/alerts/sentry', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueId: alert.metadata.issueId,
          status: 'ignored'
        })
      })

      if (response.ok) {
        toast.success('Issue ignored')
        onClose()
      } else {
        toast.error('Failed to ignore issue')
      }
    } catch (error) {
      toast.error('Error ignoring issue')
    } finally {
      setResolving(false)
    }
  }

  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            {alert.title}
          </DialogTitle>
          <DialogDescription>
            Error details from Sentry monitoring
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Recent Events</TabsTrigger>
            <TabsTrigger value="stack">Stack Trace</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Events:</span>
                  <span>{alert.metadata?.count || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Users Affected:</span>
                  <span>{alert.metadata?.userCount || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Platform:</span>
                  <Badge variant="outline">{alert.metadata?.platform || 'Unknown'}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">First Seen:</span>
                  <span>
                    {alert.metadata?.firstSeen 
                      ? formatDistanceToNow(new Date(alert.metadata.firstSeen), { addSuffix: true })
                      : 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Last Seen:</span>
                  <span>
                    {alert.metadata?.lastSeen 
                      ? formatDistanceToNow(new Date(alert.metadata.lastSeen), { addSuffix: true })
                      : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h4 className="font-medium mb-2">Error Message</h4>
              <div className="p-3 bg-muted rounded-md font-mono text-sm">
                {alert.message}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent events found
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((event, index) => (
                    <div key={event.id || index} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{event.message || 'No message'}</p>
                          {event.user && (
                            <p className="text-xs text-muted-foreground">
                              User: {event.user.email || event.user.id || 'Anonymous'}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(event.datetime), { addSuffix: true })}
                          </p>
                        </div>
                        <Badge variant={event.level === 'error' ? 'destructive' : 'secondary'}>
                          {event.level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="stack">
            <ScrollArea className="h-[400px]">
              <div className="font-mono text-xs p-4 bg-muted rounded-md">
                {events[0]?.entries?.find((e: any) => e.type === 'exception')?.data?.values?.[0]?.stacktrace?.frames?.map((frame: any, index: number) => (
                  <div key={index} className="mb-2">
                    <div className="text-destructive">{frame.filename}:{frame.lineno}:{frame.colno}</div>
                    <div className="text-muted-foreground pl-4">in {frame.function || 'anonymous'}</div>
                    {frame.context_line && (
                      <div className="bg-destructive/10 p-1 mt-1 rounded">
                        {frame.context_line.trim()}
                      </div>
                    )}
                  </div>
                )) || (
                  <div className="text-muted-foreground">
                    No stack trace available. Load events to see stack traces.
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => window.open(`https://sentry.io/organizations/kyloai/issues/${alert.metadata?.issueId}/`, '_blank')}
            disabled={!alert.metadata?.issueId}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View in Sentry
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleIgnore}
              disabled={resolving || isDemoMode}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Ignore
            </Button>
            <Button
              onClick={handleResolve}
              disabled={resolving || isDemoMode}
            >
              {resolving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Mark as Resolved
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}