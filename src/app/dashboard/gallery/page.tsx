'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Eye, Trash2, Search, Filter, Play, Clock, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AspectRatio } from '@/components/ui/aspect-ratio'

interface Video {
  id: string
  prompt: string
  enhancedPrompt?: string
  provider: string
  status: string
  url?: string
  thumbnailUrl?: string
  duration?: number
  aspectRatio?: string
  creditsUsed: number
  errorMessage?: string
  createdAt: string
  processingTime?: number
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pendente', color: 'bg-gray-500' },
  QUEUED: { label: 'Na Fila', color: 'bg-blue-500' },
  PROCESSING: { label: 'Processando', color: 'bg-yellow-500' },
  COMPLETED: { label: 'Concluído', color: 'bg-green-500' },
  FAILED: { label: 'Falhou', color: 'bg-red-500' },
  CANCELLED: { label: 'Cancelado', color: 'bg-gray-500' },
}

const providerLabels: Record<string, { name: string; badge: string }> = {
  LUMA_V1: { name: 'Luma V1', badge: 'PRO' },
  LUMA_V2: { name: 'Luma V2', badge: 'BEST' },
  KLING_V1: { name: 'Kling V1', badge: 'PRO' },
  KLING_V2: { name: 'Kling V2.1', badge: 'BEST' },
}

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [providerFilter, setProviderFilter] = useState<string>('all')
  const [deleteVideoId, setDeleteVideoId] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const queryClient = useQueryClient()

  // Fetch videos
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['videos', searchTerm, statusFilter, providerFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (providerFilter !== 'all') params.append('provider', providerFilter)

      const response = await fetch(`/api/videos?${params}`)
      if (!response.ok) throw new Error('Failed to fetch videos')
      return response.json()
    },
  })

  // Delete video mutation
  const deleteMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const response = await fetch(`/api/videos/${videoId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete video')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
      toast({
        title: 'Vídeo excluído',
        description: 'O vídeo foi removido com sucesso.',
      })
    },
    onError: () => {
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o vídeo.',
        variant: 'destructive',
      })
    },
  })

  // Auto-refresh for processing videos
  useEffect(() => {
    const hasProcessingVideos = videos.some(
      (video: Video) => video.status === 'PROCESSING' || video.status === 'QUEUED'
    )

    if (hasProcessingVideos) {
      const interval = setInterval(() => {
        queryClient.invalidateQueries({ queryKey: ['videos'] })
      }, 5000) // Refresh every 5 seconds

      return () => clearInterval(interval)
    }
  }, [videos, queryClient])

  const handleDelete = (videoId: string) => {
    setDeleteVideoId(videoId)
  }

  const confirmDelete = () => {
    if (deleteVideoId) {
      deleteMutation.mutate(deleteVideoId)
      setDeleteVideoId(null)
    }
  }

  const handleDownload = async (video: Video) => {
    if (!video.url) return

    try {
      const response = await fetch(video.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `video-${video.id}.mp4`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast({
        title: 'Erro ao baixar',
        description: 'Não foi possível baixar o vídeo.',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">Galeria de Vídeos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Galeria de Vídeos</h1>
        <Button onClick={() => window.location.href = '/dashboard/create'}>
          Criar Novo Vídeo
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por prompt..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="COMPLETED">Concluídos</SelectItem>
            <SelectItem value="PROCESSING">Processando</SelectItem>
            <SelectItem value="QUEUED">Na Fila</SelectItem>
            <SelectItem value="FAILED">Falhados</SelectItem>
          </SelectContent>
        </Select>
        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="API" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as APIs</SelectItem>
            <SelectItem value="LUMA_V1">Luma V1</SelectItem>
            <SelectItem value="LUMA_V2">Luma V2</SelectItem>
            <SelectItem value="KLING_V1">Kling V1</SelectItem>
            <SelectItem value="KLING_V2">Kling V2.1</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Video Grid */}
      {videos.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' || providerFilter !== 'all'
              ? 'Nenhum vídeo encontrado com os filtros aplicados.'
              : 'Você ainda não criou nenhum vídeo. Comece agora!'}
          </p>
          {!(searchTerm || statusFilter !== 'all' || providerFilter !== 'all') && (
            <Button className="mt-4" onClick={() => window.location.href = '/dashboard/create'}>
              Criar Primeiro Vídeo
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video: Video) => (
            <Card key={video.id} className="overflow-hidden group">
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted">
                {video.status === 'COMPLETED' && video.thumbnailUrl ? (
                  <>
                    <img
                      src={video.thumbnailUrl}
                      alt={video.prompt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => handleDownload(video)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : video.status === 'PROCESSING' || video.status === 'QUEUED' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {video.status === 'PROCESSING' ? 'Processando...' : 'Na fila...'}
                      </p>
                    </div>
                  </div>
                ) : video.status === 'FAILED' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-destructive" />
                      <p className="text-sm text-destructive">Falhou</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}

                {/* Status Badge */}
                <Badge
                  className={`absolute top-2 right-2 ${statusLabels[video.status]?.color || 'bg-gray-500'}`}
                >
                  {statusLabels[video.status]?.label || video.status}
                </Badge>

                {/* Provider Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur">
                    {providerLabels[video.provider]?.name || video.provider}
                  </Badge>
                  {providerLabels[video.provider]?.badge && (
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                      {providerLabels[video.provider].badge}
                    </Badge>
                  )}
                </div>
              </div>

              <CardContent className="p-4">
                <p className="text-sm font-medium line-clamp-2 mb-2">{video.prompt}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{video.creditsUsed} créditos</span>
                  {video.duration && (
                    <>
                      <span>•</span>
                      <span>{video.duration}s</span>
                    </>
                  )}
                  {video.aspectRatio && (
                    <>
                      <span>•</span>
                      <span>{video.aspectRatio}</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(video.createdAt), "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                </p>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={() => handleDelete(video.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteVideoId} onOpenChange={() => setDeleteVideoId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O vídeo será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Video Preview Modal */}
      {selectedVideo && selectedVideo.url && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b">
              <h3 className="font-semibold line-clamp-1">{selectedVideo.prompt}</h3>
              <p className="text-sm text-muted-foreground">
                {providerLabels[selectedVideo.provider]?.name} • {selectedVideo.duration}s • {selectedVideo.aspectRatio}
              </p>
            </div>
            <div className="relative">
              <video
                src={selectedVideo.url}
                controls
                autoPlay
                className="w-full max-h-[70vh]"
              />
            </div>
            <div className="p-4 border-t flex justify-between">
              <Button variant="outline" onClick={() => setSelectedVideo(null)}>
                Fechar
              </Button>
              <Button onClick={() => handleDownload(selectedVideo)}>
                <Download className="h-4 w-4 mr-2" />
                Baixar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}