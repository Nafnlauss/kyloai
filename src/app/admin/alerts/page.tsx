'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { SentryErrorDetails } from '@/components/admin/sentry-error-details'
import { formatDistanceToNow } from 'date-fns'
import { 
  Bell, 
  AlertCircle, 
  AlertTriangle, 
  Info,
  CheckCircle,
  X,
  Loader2,
  RefreshCw
} from 'lucide-react'

interface Alert {
  id: string
  type: 'error' | 'warning' | 'info' | 'success'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'critical' | 'high' | 'medium' | 'low'
  actionUrl?: string
  source?: 'system' | 'sentry'
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

export default function AdminAlertsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [summary, setSummary] = useState({
    total: 0,
    unread: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    system: 0,
    sentry: 0
  })
  const [activeTab, setActiveTab] = useState<'all' | 'system' | 'sentry'>('all')
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/alerts')
      
      if (!response.ok) {
        throw new Error('Failed to fetch alerts')
      }

      const data = await response.json()
      setAlerts(data.alerts || [])
      setSummary(data.summary || {
        total: 0,
        unread: 0,
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        system: 0,
        sentry: 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>
      case 'low':
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Alerts</h2>
          <p className="text-muted-foreground">
            Monitor important system events and notifications
          </p>
        </div>
        <Button onClick={fetchAlerts} variant="outline" disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
            <p className="text-xs text-muted-foreground">
              {summary.unread} unread
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.critical}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{summary.high}</div>
            <p className="text-xs text-muted-foreground">
              Need attention soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium/Low</CardTitle>
            <Info className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.medium + summary.low}</div>
            <p className="text-xs text-muted-foreground">
              Informational alerts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'all'
              ? 'text-primary border-primary'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          All Alerts ({summary.total})
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'system'
              ? 'text-primary border-primary'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          System ({summary.system})
        </button>
        <button
          onClick={() => setActiveTab('sentry')}
          className={`px-4 py-2 font-medium transition-colors border-b-2 ${
            activeTab === 'sentry'
              ? 'text-primary border-primary'
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          <span className="flex items-center gap-2">
            Production Errors ({summary.sentry})
            {summary.sentry > 0 && (
              <Badge variant="destructive" className="h-4 px-1 text-xs">
                Live
              </Badge>
            )}
          </span>
        </button>
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>
            Click on an alert to view more details or take action
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          ) : alerts.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="No active alerts"
              subtitle="All systems are running smoothly"
              className="py-12"
            />
          ) : (
            <div className="space-y-4">
              {alerts
                .filter(alert => {
                  if (activeTab === 'all') return true
                  if (activeTab === 'system') return alert.source !== 'sentry'
                  if (activeTab === 'sentry') return alert.source === 'sentry'
                  return true
                })
                .map((alert) => (
                <div
                  key={alert.id}
                  className={`flex items-start justify-between p-4 rounded-lg border ${
                    !alert.read ? 'bg-muted/50' : ''
                  } ${alert.actionUrl || alert.source === 'sentry' ? 'cursor-pointer hover:bg-muted/30' : ''}`}
                  onClick={() => {
                    if (alert.source === 'sentry') {
                      setSelectedAlert(alert)
                      setDetailsOpen(true)
                    } else if (alert.actionUrl) {
                      window.location.href = alert.actionUrl
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{alert.title}</h4>
                        {getPriorityBadge(alert.priority)}
                        {!alert.read && (
                          <Badge variant="default" className="ml-2">New</Badge>
                        )}
                        {alert.source === 'sentry' && (
                          <Badge variant="outline" className="ml-1">
                            Sentry
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.message}
                      </p>
                      {alert.source === 'sentry' && alert.metadata && (
                        <div className="text-xs text-muted-foreground mt-1 space-x-3">
                          <span>Platform: {alert.metadata.platform}</span>
                          <span>•</span>
                          <span>{alert.metadata.count} events</span>
                          <span>•</span>
                          <span>{alert.metadata.userCount} users affected</span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: Implement dismiss functionality
                      console.log('Dismiss alert:', alert.id)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sentry Error Details Modal */}
      {selectedAlert && (
        <SentryErrorDetails
          alert={selectedAlert}
          isOpen={detailsOpen}
          onClose={() => {
            setDetailsOpen(false)
            setSelectedAlert(null)
          }}
          onResolve={() => {
            fetchAlerts() // Refresh alerts after resolving
          }}
        />
      )}
    </div>
  )
}