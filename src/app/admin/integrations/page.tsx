'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Zap,
  Database,
  CreditCard,
  Video,
  Image,
  Music,
  Link2
} from 'lucide-react'
import LoadingSpinner from '@/components/loading-spinner'
import { Progress } from '@/components/ui/progress'

interface Integration {
  name: string
  type: 'payment' | 'ai' | 'database' | 'infrastructure'
  status: 'connected' | 'disconnected' | 'error' | 'checking'
  lastChecked: string
  details: {
    endpoint?: string
    version?: string
    quota?: {
      used: number
      limit: number
    }
    error?: string
  }
}

export default function AdminIntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState<string | null>(null)

  useEffect(() => {
    checkAllIntegrations()
  }, [])

  const checkAllIntegrations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/integrations/check-all')
      if (response.ok) {
        const data = await response.json()
        setIntegrations(data.integrations)
      }
    } catch (error) {
      console.error('Error checking integrations:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkIntegration = async (name: string) => {
    setChecking(name)
    try {
      const response = await fetch(`/api/admin/integrations/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ integration: name })
      })
      
      if (response.ok) {
        const data = await response.json()
        setIntegrations(prev => 
          prev.map(int => int.name === name ? data.integration : int)
        )
      }
    } catch (error) {
      console.error(`Error checking ${name}:`, error)
    } finally {
      setChecking(null)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <RefreshCw className="h-5 w-5 animate-spin" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <CreditCard className="h-5 w-5" />
      case 'ai':
        return <Zap className="h-5 w-5" />
      case 'database':
        return <Database className="h-5 w-5" />
      default:
        return <Link2 className="h-5 w-5" />
    }
  }

  const groupedIntegrations = integrations.reduce((acc, int) => {
    if (!acc[int.type]) acc[int.type] = []
    acc[int.type].push(int)
    return acc
  }, {} as Record<string, Integration[]>)

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">API Integrations</h1>
          <p className="text-muted-foreground">
            Monitor connections to external services and APIs
          </p>
        </div>
        <Button onClick={checkAllIntegrations} disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Check All
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{integrations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {integrations.filter(i => i.status === 'connected').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {integrations.filter(i => i.status === 'error').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disconnected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {integrations.filter(i => i.status === 'disconnected').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations by Type */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="ai">AI Providers</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {Object.entries(groupedIntegrations).map(([type, ints]) => (
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getTypeIcon(type)}
                    <span className="capitalize">{type} Services</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ints.map((integration) => (
                      <div key={integration.name} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(integration.status)}
                            <div>
                              <h4 className="font-semibold">{integration.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Last checked: {new Date(integration.lastChecked).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={
                                integration.status === 'connected' ? 'default' :
                                integration.status === 'error' ? 'secondary' :
                                'destructive'
                              }
                            >
                              {integration.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => checkIntegration(integration.name)}
                              disabled={checking === integration.name}
                            >
                              {checking === integration.name ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                'Check'
                              )}
                            </Button>
                          </div>
                        </div>

                        {integration.details && (
                          <div className="mt-3 space-y-2">
                            {integration.details.endpoint && (
                              <p className="text-sm">
                                <span className="text-muted-foreground">Endpoint:</span> {integration.details.endpoint}
                              </p>
                            )}
                            {integration.details.version && (
                              <p className="text-sm">
                                <span className="text-muted-foreground">Version:</span> {integration.details.version}
                              </p>
                            )}
                            {integration.details.quota && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                  Quota: {integration.details.quota.used.toLocaleString()} / {integration.details.quota.limit.toLocaleString()}
                                </p>
                                <Progress 
                                  value={(integration.details.quota.used / integration.details.quota.limit) * 100} 
                                  className="h-2"
                                />
                              </div>
                            )}
                            {integration.details.error && (
                              <p className="text-sm text-red-500">
                                Error: {integration.details.error}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {['payment', 'ai', 'database', 'infrastructure'].map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{type} Integrations</CardTitle>
                <CardDescription>
                  Manage and monitor {type} service connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groupedIntegrations[type]?.map((integration) => (
                    <div key={integration.name} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(integration.status)}
                          <div>
                            <h4 className="font-semibold">{integration.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Last checked: {new Date(integration.lastChecked).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              integration.status === 'connected' ? 'default' :
                              integration.status === 'error' ? 'secondary' :
                              'destructive'
                            }
                          >
                            {integration.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => checkIntegration(integration.name)}
                            disabled={checking === integration.name}
                          >
                            {checking === integration.name ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              'Check'
                            )}
                          </Button>
                        </div>
                      </div>

                      {integration.details && (
                        <div className="mt-3 space-y-2">
                          {integration.details.endpoint && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Endpoint:</span> {integration.details.endpoint}
                            </p>
                          )}
                          {integration.details.version && (
                            <p className="text-sm">
                              <span className="text-muted-foreground">Version:</span> {integration.details.version}
                            </p>
                          )}
                          {integration.details.quota && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">
                                Quota: {integration.details.quota.used.toLocaleString()} / {integration.details.quota.limit.toLocaleString()}
                              </p>
                              <Progress 
                                value={(integration.details.quota.used / integration.details.quota.limit) * 100} 
                                className="h-2"
                              />
                            </div>
                          )}
                          {integration.details.error && (
                            <p className="text-sm text-red-500">
                              Error: {integration.details.error}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )) || (
                    <p className="text-muted-foreground">No {type} integrations configured.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}