'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  AlertCircle, 
  CheckCircle,
  Loader2,
  RefreshCw,
  Wifi,
  WifiOff,
  Clock,
  TrendingUp
} from 'lucide-react'

interface APIHealthCheck {
  provider: string
  name: string
  status: 'operational' | 'degraded' | 'down'
  latency: number
  error?: string
  lastChecked: Date
  uptime: number
  requestsLast24h: number
  successfulRequests: number
  failedRequests: number
}

interface HealthSummary {
  operational: number
  degraded: number
  down: number
  averageLatency: number
  lastChecked: Date
}

export default function AdminAPIStatusPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [providers, setProviders] = useState<APIHealthCheck[]>([])
  const [summary, setSummary] = useState<HealthSummary | null>(null)
  const [overallStatus, setOverallStatus] = useState<'operational' | 'degraded' | 'down'>('operational')

  useEffect(() => {
    fetchAPIHealth()
    // Refresh every 30 seconds
    const interval = setInterval(fetchAPIHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchAPIHealth = async () => {
    try {
      setError(null)

      const response = await fetch('/api/admin/api-health')
      
      if (!response.ok) {
        throw new Error('Failed to fetch API health')
      }

      const data = await response.json()
      setProviders(data.providers || [])
      setSummary(data.summary || null)
      setOverallStatus(data.status || 'operational')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'down':
        return <WifiOff className="h-5 w-5 text-red-500" />
      default:
        return <Wifi className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500">Operational</Badge>
      case 'degraded':
        return <Badge className="bg-yellow-500">Degraded</Badge>
      case 'down':
        return <Badge variant="destructive">Down</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getOverallStatusMessage = () => {
    switch (overallStatus) {
      case 'operational':
        return { text: 'All Systems Operational', color: 'text-green-600' }
      case 'degraded':
        return { text: 'Partial System Outage', color: 'text-yellow-600' }
      case 'down':
        return { text: 'Major System Outage', color: 'text-red-600' }
      default:
        return { text: 'Unknown Status', color: 'text-gray-600' }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const statusMessage = getOverallStatusMessage()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">API Status</h2>
          <p className="text-muted-foreground">
            Monitor the health and performance of external APIs
          </p>
        </div>
        <Button onClick={fetchAPIHealth} variant="outline" disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Overall Status */}
      <Card className={`border-2 ${
        overallStatus === 'operational' ? 'border-green-500' :
        overallStatus === 'degraded' ? 'border-yellow-500' :
        'border-red-500'
      }`}>
        <CardHeader>
          <CardTitle className={`text-2xl ${statusMessage.color}`}>
            {statusMessage.text}
          </CardTitle>
          <CardDescription>
            {summary && `Last checked: ${new Date(summary.lastChecked).toLocaleString('en-US')}`}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Operational</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.operational}</div>
              <p className="text-xs text-muted-foreground">
                Services running normally
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Degraded</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.degraded}</div>
              <p className="text-xs text-muted-foreground">
                Services with issues
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Down</CardTitle>
              <WifiOff className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.down}</div>
              <p className="text-xs text-muted-foreground">
                Services unavailable
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.averageLatency}ms</div>
              <p className="text-xs text-muted-foreground">
                Response time
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Provider Status */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status</CardTitle>
          <CardDescription>
            Real-time health check for all integrated services
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          ) : providers.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No providers configured"
              subtitle="Add API keys to monitor service health"
            />
          ) : (
            <div className="space-y-4">
              {providers.map((provider) => (
                <div key={provider.provider} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(provider.status)}
                      <div>
                        <h3 className="font-semibold">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {provider.error || `Latency: ${provider.latency}ms`}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(provider.status)}
                  </div>

                  {/* Uptime Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uptime (24h)</span>
                      <span className="font-medium">{provider.uptime}%</span>
                    </div>
                    <Progress 
                      value={provider.uptime} 
                      className={provider.uptime >= 99 ? 'bg-green-100' : provider.uptime >= 95 ? 'bg-yellow-100' : 'bg-red-100'}
                    />
                  </div>

                  {/* Request Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Requests</p>
                      <p className="font-medium">{provider.requestsLast24h.toLocaleString('en-US')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Successful</p>
                      <p className="font-medium text-green-600">{provider.successfulRequests.toLocaleString('en-US')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Failed</p>
                      <p className="font-medium text-red-600">{provider.failedRequests.toLocaleString('en-US')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}