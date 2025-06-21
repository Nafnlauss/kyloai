'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Video, 
  CreditCard, 
  TrendingUp, 
  Clock, 
  Sparkles,
  ArrowRight,
  AlertCircle,
  Film,
  Zap
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface DashboardStats {
  credits: number
  videosTotal: number
  videosThisMonth: number
  processingTime: number
  subscription: {
    plan: string
    status: string
    currentPeriodEnd: string
    creditsRemaining: number
    creditsTotal: number
  }
  recentVideos: Array<{
    id: string
    prompt: string
    status: string
    provider: string
    createdAt: string
    thumbnailUrl?: string
  }>
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [greeting, setGreeting] = useState('Olá')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Bom dia')
    else if (hour < 18) setGreeting('Boa tarde')
    else setGreeting('Boa noite')
  }, [])

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/user/dashboard')
      if (!response.ok) throw new Error('Failed to fetch dashboard data')
      return response.json()
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const creditPercentage = stats ? (stats.credits / (stats.subscription.creditsTotal || 100)) * 100 : 0

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">
          {greeting}, {session?.user?.name || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          Aqui está um resumo da sua conta e atividades recentes.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Criar Novo Vídeo
            </CardTitle>
            <CardDescription>
              Transforme suas ideias em vídeos incríveis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/create">
              <Button className="w-full">
                Começar a Criar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="h-5 w-5" />
              Galeria de Vídeos
            </CardTitle>
            <CardDescription>
              Veja todos os seus vídeos criados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/gallery">
              <Button variant="outline" className="w-full">
                Ver Galeria
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Comprar Créditos
            </CardTitle>
            <CardDescription>
              Adicione mais créditos à sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/billing">
              <Button variant="outline" className="w-full">
                Ver Planos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Créditos Disponíveis
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.credits || 0}</div>
            <Progress value={creditPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.subscription.creditsRemaining || 0} de {stats?.subscription.creditsTotal || 0} do plano
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vídeos Criados
            </CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.videosTotal || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.videosThisMonth || 0} criado{stats?.videosThisMonth !== 1 ? 's' : ''} este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tempo Médio
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.processingTime ? `${Math.round(stats.processingTime / 60)}min` : '0min'}
            </div>
            <p className="text-xs text-muted-foreground">
              Por vídeo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Plano Atual
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {stats?.subscription.plan || 'Free'}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.subscription.status === 'ACTIVE' ? (
                <>Renova em {stats.subscription.currentPeriodEnd ? format(new Date(stats.subscription.currentPeriodEnd), "dd/MM", { locale: ptBR }) : 'N/A'}</>
              ) : (
                'Inativo'
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Videos */}
      {stats?.recentVideos && stats.recentVideos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vídeos Recentes</CardTitle>
            <CardDescription>
              Seus últimos vídeos criados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentVideos.map((video) => (
                <div key={video.id} className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.prompt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {video.prompt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {video.provider} • {format(new Date(video.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                      ${video.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        video.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                        video.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {video.status === 'COMPLETED' ? 'Concluído' :
                       video.status === 'PROCESSING' ? 'Processando' :
                       video.status === 'FAILED' ? 'Falhou' :
                       video.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/dashboard/gallery">
                <Button variant="outline" size="sm">
                  Ver Todos os Vídeos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Low Credits Alert */}
      {stats && stats.credits < 10 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Você está com poucos créditos! 
            <Link href="/dashboard/billing" className="font-medium underline ml-1">
              Compre mais créditos
            </Link>
            {' '}para continuar criando vídeos.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}