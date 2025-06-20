'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@/hooks/use-debounce'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/hooks/use-toast'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Video,
  User,
  Calendar,
  CreditCard
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'

// Types
interface Video {
  id: string
  userId: string
  user: {
    name: string | null
    email: string
  }
  prompt: string
  enhancedPrompt: string | null
  provider: string
  status: string
  url: string | null
  thumbnailUrl: string | null
  duration: number
  resolution: string | null
  aspectRatio: string | null
  creditsUsed: number
  createdAt: string
  processingStartedAt: string | null
  processingEndedAt: string | null
  errorMessage: string | null
}

interface VideoStats {
  total: number
  completed: number
  processing: number
  failed: number
  totalCreditsUsed: number
  storageUsed: string
}

const statusConfig = {
  COMPLETED: { label: 'Concluído', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  PROCESSING: { label: 'Processando', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100' },
  QUEUED: { label: 'Na fila', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  FAILED: { label: 'Falhou', icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
}

const providerConfig = {
  LUMA_V1: { label: 'Luma V1', color: 'bg-purple-100 text-purple-700' },
  LUMA_V2: { label: 'Luma V2', color: 'bg-purple-100 text-purple-700' },
  KLING_V1: { label: 'Kling V1', color: 'bg-indigo-100 text-indigo-700' },
  KLING_V2: { label: 'Kling V2.1', color: 'bg-indigo-100 text-indigo-700' },
}

export default function AdminVideosPage() {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [providerFilter, setProviderFilter] = useState('all')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  
  const debouncedSearch = useDebounce(searchQuery, 500)

  // Fetch videos
  const { data: videosData, isLoading } = useQuery({
    queryKey: ['admin-videos', statusFilter, providerFilter, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (providerFilter !== 'all') params.append('provider', providerFilter)
      if (debouncedSearch) params.append('search', debouncedSearch)
      
      const response = await fetch(`/api/admin/videos?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch videos')
      return response.json()
    },
  })

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['admin-video-stats'],
    queryFn: async () => {
      const response = await fetch('/api/admin/videos/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      return response.json()
    },
  })

  // Delete video mutation
  const deleteMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete video')
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: 'Vídeo excluído',
        description: 'O vídeo foi excluído com sucesso.',
      })
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] })
      queryClient.invalidateQueries({ queryKey: ['admin-video-stats'] })
      setIsDeleteDialogOpen(false)
      setSelectedVideo(null)
    },
    onError: () => {
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir o vídeo.',
        variant: 'destructive',
      })
    },
  })

  // Reprocess video mutation
  const reprocessMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const response = await fetch(`/api/admin/videos/${videoId}/reprocess`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to reprocess video')
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: 'Reprocessamento iniciado',
        description: 'O vídeo está sendo reprocessado.',
      })
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] })
    },
    onError: () => {
      toast({
        title: 'Erro ao reprocessar',
        description: 'Não foi possível reprocessar o vídeo.',
        variant: 'destructive',
      })
    },
  })

  const videos = videosData?.videos || []

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Gestão de Vídeos</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie todos os vídeos gerados na plataforma
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Vídeos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.completed || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processando</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.processing || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Falhados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.failed || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Créditos Usados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCreditsUsed || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Armazenamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.storageUsed || '0 GB'}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Pesquisar</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Buscar por prompt, usuário ou ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="COMPLETED">Concluídos</SelectItem>
                  <SelectItem value="PROCESSING">Processando</SelectItem>
                  <SelectItem value="QUEUED">Na fila</SelectItem>
                  <SelectItem value="FAILED">Falhados</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-48">
              <Label htmlFor="provider">Provedor</Label>
              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger id="provider" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="LUMA_V1">Luma V1</SelectItem>
                  <SelectItem value="LUMA_V2">Luma V2</SelectItem>
                  <SelectItem value="KLING_V1">Kling V1</SelectItem>
                  <SelectItem value="KLING_V2">Kling V2.1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Videos Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vídeos</CardTitle>
          <CardDescription>
            Lista de todos os vídeos gerados na plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Prompt</TableHead>
                  <TableHead>Provedor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Créditos</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : videos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      Nenhum vídeo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  videos.map((video: Video) => {
                    const status = statusConfig[video.status as keyof typeof statusConfig]
                    const provider = providerConfig[video.provider as keyof typeof providerConfig]
                    const StatusIcon = status?.icon || AlertCircle
                    
                    return (
                      <TableRow key={video.id}>
                        <TableCell className="font-mono text-xs">
                          {video.id.slice(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{video.user.name || 'Sem nome'}</div>
                            <div className="text-sm text-muted-foreground">{video.user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={video.prompt}>
                            {video.prompt}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={provider?.color || ''}>
                            {provider?.label || video.provider}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`h-4 w-4 ${status?.color || ''}`} />
                            <span className="text-sm">{status?.label || video.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{video.creditsUsed}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(video.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(video.createdAt), { 
                              addSuffix: true, 
                              locale: ptBR 
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVideo(video)
                                  setIsDetailsDialogOpen(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalhes
                              </DropdownMenuItem>
                              {video.url && (
                                <DropdownMenuItem asChild>
                                  <a href={video.url} download target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" />
                                    Baixar vídeo
                                  </a>
                                </DropdownMenuItem>
                              )}
                              {video.status === 'FAILED' && (
                                <DropdownMenuItem
                                  onClick={() => reprocessMutation.mutate(video.id)}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Reprocessar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedVideo(video)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este vídeo? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          {selectedVideo && (
            <div className="space-y-2 py-4">
              <p className="text-sm">
                <strong>ID:</strong> {selectedVideo.id}
              </p>
              <p className="text-sm">
                <strong>Usuário:</strong> {selectedVideo.user.email}
              </p>
              <p className="text-sm">
                <strong>Prompt:</strong> {selectedVideo.prompt}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedVideo && deleteMutation.mutate(selectedVideo.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Detalhes do Vídeo</DialogTitle>
          </DialogHeader>
          {selectedVideo && (
            <ScrollArea className="h-full max-h-[60vh]">
              <div className="space-y-6">
                {/* Video Preview */}
                {selectedVideo.url && (
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      src={selectedVideo.url}
                      controls
                      className="w-full h-full"
                      poster={selectedVideo.thumbnailUrl || undefined}
                    />
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">ID do Vídeo</Label>
                    <p className="font-mono text-sm">{selectedVideo.id}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Status</Label>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const status = statusConfig[selectedVideo.status as keyof typeof statusConfig]
                        const StatusIcon = status?.icon || AlertCircle
                        return (
                          <>
                            <StatusIcon className={`h-4 w-4 ${status?.color || ''}`} />
                            <span>{status?.label || selectedVideo.status}</span>
                          </>
                        )
                      })()}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Usuário</Label>
                    <div>
                      <p className="font-medium">{selectedVideo.user.name || 'Sem nome'}</p>
                      <p className="text-sm text-muted-foreground">{selectedVideo.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Provedor</Label>
                    <Badge className={providerConfig[selectedVideo.provider as keyof typeof providerConfig]?.color || ''}>
                      {providerConfig[selectedVideo.provider as keyof typeof providerConfig]?.label || selectedVideo.provider}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Créditos Usados</Label>
                    <p>{selectedVideo.creditsUsed}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Duração</Label>
                    <p>{selectedVideo.duration} segundos</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Resolução</Label>
                    <p>{selectedVideo.resolution || 'N/A'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label className="text-muted-foreground">Proporção</Label>
                    <p>{selectedVideo.aspectRatio || 'N/A'}</p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Timestamps</Label>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Criado em:</strong>{' '}
                      {format(new Date(selectedVideo.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                    {selectedVideo.processingStartedAt && (
                      <p>
                        <strong>Processamento iniciado:</strong>{' '}
                        {format(new Date(selectedVideo.processingStartedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    )}
                    {selectedVideo.processingEndedAt && (
                      <p>
                        <strong>Processamento finalizado:</strong>{' '}
                        {format(new Date(selectedVideo.processingEndedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </p>
                    )}
                  </div>
                </div>

                {/* Prompts */}
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Prompt Original</Label>
                  <div className="p-3 bg-muted rounded-lg text-sm">
                    {selectedVideo.prompt}
                  </div>
                </div>
                
                {selectedVideo.enhancedPrompt && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Prompt Melhorado</Label>
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      {selectedVideo.enhancedPrompt}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {selectedVideo.errorMessage && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Mensagem de Erro</Label>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                      {selectedVideo.errorMessage}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}