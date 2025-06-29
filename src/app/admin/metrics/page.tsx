'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Video, 
  CreditCard, AlertCircle, Activity, Zap, Clock, Loader2
} from 'lucide-react'
import { formatBRL } from '@/lib/utils'

export default function AdminMetricsPage() {
  const [timeRange, setTimeRange] = useState('24h')
  const [metrics, setMetrics] = useState<any>(null)
  const [performance, setPerformance] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMetrics()
  }, [timeRange])

  useEffect(() => {
    fetchPerformance()
    // Refresh performance metrics every 30 seconds
    const interval = setInterval(fetchPerformance, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use v2 endpoint which is more robust
      const response = await fetch(`/api/admin/metrics/v2?timeRange=${timeRange}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || 'Failed to fetch metrics')
      }
      
      const data = await response.json()
      setMetrics(data)
    } catch (err) {
      console.error('Metrics error:', err)
      setError(err instanceof Error ? err.message : 'Error loading metrics')
      
      // Set empty metrics as fallback
      setMetrics({
        overview: {
          totalUsers: 0,
          activeUsers: 0,
          totalVideos: 0,
          totalCreditsUsed: 0,
          totalRevenue: 0,
          totalTransactions: 0
        },
        videosByStatus: [],
        videosByProvider: [],
        topUsers: [],
        hourlyData: [],
        timeRange
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPerformance = async () => {
    try {
      const response = await fetch('/api/admin/metrics/performance')
      if (!response.ok) {
        console.log('Performance metrics failed')
        return
      }
      const data = await response.json()
      setPerformance(data)
    } catch (err) {
      console.error('Error fetching performance:', err)
      // Set default performance data
      setPerformance({
        overview: {
          totalVideos: 0,
          completedVideos: 0,
          failedVideos: 0,
          currentProcessing: 0,
          queuedVideos: 0,
          successRate: 0,
          avgProcessingTime: 0
        },
        providerHealth: [],
        systemStatus: {
          database: 'operational',
          queue: 'operational',
          processing: 'normal'
        }
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Don't show error screen, just continue with empty data
  // The page will show "no data" messages which is better UX

  // Colors for charts
  const statusColors = {
    COMPLETED: '#10b981',
    PROCESSING: '#3b82f6',
    FAILED: '#ef4444',
    QUEUED: '#f59e0b'
  }

  const providerColors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Métricas</h1>
          <p className="text-muted-foreground mt-2">
            Dados reais da plataforma
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Última hora</SelectItem>
              <SelectItem value="24h">Últimas 24h</SelectItem>
              <SelectItem value="7d">Últimos 7 dias</SelectItem>
              <SelectItem value="30d">Últimos 30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBRL(metrics?.overview.totalRevenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.overview.totalTransactions || 0} transações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vídeos Gerados</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.overview.totalVideos || 0}</div>
            <p className="text-xs text-muted-foreground">
              Taxa de sucesso: {performance?.overview.successRate || 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Consumidos</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.overview.totalCreditsUsed || 0}</div>
            <p className="text-xs text-muted-foreground">
              Média por vídeo: {
                metrics?.overview.totalVideos > 0 
                  ? (metrics.overview.totalCreditsUsed / metrics.overview.totalVideos).toFixed(1)
                  : 0
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.overview.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total: {metrics?.overview.totalUsers || 0} usuários
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="activity" className="space-y-4">
        <TabsList>
          <TabsTrigger value="activity">Atividade</TabsTrigger>
          <TabsTrigger value="providers">Provedores</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          {metrics?.hourlyData && metrics.hourlyData.length > 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Atividade por Hora</CardTitle>
                  <CardDescription>
                    Vídeos gerados e créditos consumidos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metrics.hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="hour" 
                          tickFormatter={(hour) => `${hour}h`}
                        />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip 
                          labelFormatter={(hour) => `${hour}:00`}
                        />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="videos"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.6}
                          name="Vídeos"
                        />
                        <Area
                          yAxisId="right"
                          type="monotone"
                          dataKey="credits"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                          name="Créditos"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Receita por Hora</CardTitle>
                  <CardDescription>
                    Receita gerada no período
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metrics.hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="hour" 
                          tickFormatter={(hour) => `${hour}h`}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => formatBRL(Number(value))}
                          labelFormatter={(hour) => `${hour}:00`}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Receita"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">Nenhum dado disponível para o período selecionado</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {metrics?.videosByProvider && metrics.videosByProvider.length > 0 ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Provedor</CardTitle>
                    <CardDescription>
                      Uso de cada provedor de IA
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={metrics.videosByProvider}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ provider, percentage }) => 
                              `${provider}: ${percentage.toFixed(1)}%`
                            }
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="percentage"
                          >
                            {metrics.videosByProvider.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={providerColors[index % providerColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Créditos por Provedor</CardTitle>
                    <CardDescription>
                      Consumo de créditos por provedor
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics.videosByProvider}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="provider" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="credits" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="md:col-span-2">
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum vídeo gerado no período</p>
                </CardContent>
              </Card>
            )}
          </div>

          {metrics?.videosByStatus && metrics.videosByStatus.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Status dos Vídeos</CardTitle>
                <CardDescription>
                  Distribuição por status de processamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metrics.videosByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="count"
                      >
                        {metrics.videosByStatus.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={statusColors[entry.status as keyof typeof statusColors] || '#666'} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        formatter={(value) => {
                          const statusLabels: any = {
                            COMPLETED: 'Concluído',
                            PROCESSING: 'Processando',
                            FAILED: 'Falhou',
                            QUEUED: 'Na fila'
                          }
                          return statusLabels[value] || value
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Métricas de Performance</CardTitle>
                <CardDescription>
                  Indicadores chave de desempenho
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Taxa de Sucesso</span>
                    <span className="text-sm text-muted-foreground">
                      {performance?.overview.successRate || 0}%
                    </span>
                  </div>
                  <Progress value={Number(performance?.overview.successRate || 0)} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Tempo Médio de Processamento</span>
                    <span className="text-sm text-muted-foreground">
                      {(performance?.overview.avgProcessingTime / 60 || 0).toFixed(1)} min
                    </span>
                  </div>
                  <Progress value={Math.min((performance?.overview.avgProcessingTime / 300) * 100, 100)} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Jobs em Processamento</span>
                    <span className="text-sm text-muted-foreground">
                      {performance?.overview.currentProcessing || 0}
                    </span>
                  </div>
                  <Badge variant={performance?.systemStatus?.processing === 'busy' ? 'destructive' : 'default'}>
                    {performance?.systemStatus?.processing || 'normal'}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Vídeos na Fila</span>
                    <span className="text-sm text-muted-foreground">
                      {performance?.overview.queuedVideos || 0}
                    </span>
                  </div>
                  <Badge variant={performance?.systemStatus?.queue === 'degraded' ? 'destructive' : 'default'}>
                    {performance?.systemStatus?.queue || 'operational'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status dos Provedores</CardTitle>
                <CardDescription>
                  Saúde e performance por provedor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {performance?.providerHealth?.map((provider: any) => (
                  <div key={provider.provider} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${
                        provider.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
                      }`} />
                      <span className="text-sm font-medium">{provider.provider}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {provider.total} vídeos
                      </span>
                      <Badge variant={provider.status === 'operational' ? 'default' : 'secondary'}>
                        {provider.successRate}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Usuários</CardTitle>
              <CardDescription>
                Usuários mais ativos no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              {metrics?.topUsers && metrics.topUsers.length > 0 ? (
                <div className="space-y-8">
                  {metrics.topUsers.map((user: any, index: number) => (
                    <div key={user.id} className="flex items-center">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.videoCount} vídeos • {user.creditsUsed} créditos
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum usuário ativo no período
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}