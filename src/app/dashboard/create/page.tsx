'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useVideoStatus } from '@/hooks/use-socket'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Sparkles, Wand2, Info, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/hooks/use-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface VideoGenerationResponse {
  videoId: string
  jobId: string
  status: string
  estimatedTime: number
  creditsUsed: number
  creditsRemaining: number
}

const apiConfigs = {
  LUMA_V1: { name: 'Luma V1', badge: 'PRO', credits: 3, time: '~2-3 min' },
  LUMA_V2: { name: 'Luma V2', badge: 'BEST', credits: 5, time: '~3-4 min' },
  KLING_V1: { name: 'Kling V1 (STD)', badge: 'PRO', credits: 5, time: '~2-3 min' },
  KLING_V2: { name: 'Kling V2.1 (PRO)', badge: 'BEST', credits: 10, time: '~4-5 min' }
}

export default function CreateVideoPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [prompt, setPrompt] = useState('')
  const [provider, setProvider] = useState('LUMA_V1')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [duration, setDuration] = useState('5')
  const [enhancePrompt, setEnhancePrompt] = useState(true)
  const [generatingVideoId, setGeneratingVideoId] = useState<string | null>(null)

  // Monitor video status via WebSocket
  const videoStatus = useVideoStatus(generatingVideoId)

  // Fetch user credits
  const { data: userStats } = useQuery({
    queryKey: ['user-credits'],
    queryFn: async () => {
      const response = await fetch('/api/user/dashboard')
      if (!response.ok) throw new Error('Failed to fetch user data')
      return response.json()
    },
  })

  const characterCount = prompt.length
  const selectedApi = apiConfigs[provider as keyof typeof apiConfigs]
  const creditsPerSecond = selectedApi.credits
  const estimatedCredits = Math.ceil(Number(duration) * creditsPerSecond)
  const hasEnoughCredits = (userStats?.credits || 0) >= estimatedCredits

  // Generate video mutation
  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/videos/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          provider,
          aspectRatio,
          duration: Number(duration),
          enhancePrompt,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate video')
      }

      return response.json() as Promise<VideoGenerationResponse>
    },
    onSuccess: (data) => {
      setGeneratingVideoId(data.videoId)
      queryClient.invalidateQueries({ queryKey: ['user-credits'] })
      
      toast({
        title: 'Vídeo em processamento!',
        description: 'Você será notificado quando estiver pronto.',
      })
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao gerar vídeo',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  // Handle video status updates
  useEffect(() => {
    if (!videoStatus) return

    if (videoStatus.status === 'COMPLETED') {
      toast({
        title: 'Vídeo pronto! 🎉',
        description: 'Seu vídeo foi gerado com sucesso.',
      })
      
      // Redirect to gallery
      setTimeout(() => {
        router.push('/dashboard/gallery')
      }, 2000)
    } else if (videoStatus.status === 'FAILED') {
      toast({
        title: 'Falha na geração',
        description: videoStatus.error || 'Ocorreu um erro ao gerar o vídeo.',
        variant: 'destructive',
      })
      setGeneratingVideoId(null)
    }
  }, [videoStatus, router])

  const handleGenerate = () => {
    if (!hasEnoughCredits) {
      toast({
        title: 'Créditos insuficientes',
        description: 'Você não tem créditos suficientes para gerar este vídeo.',
        variant: 'destructive',
      })
      return
    }

    generateMutation.mutate()
  }

  const isGenerating = generateMutation.isPending || generatingVideoId !== null

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Criar Novo Vídeo</h1>
        <p className="text-muted-foreground mt-2">
          Descreva sua visão e deixe a IA dar vida a ela
        </p>
      </div>

      {/* Video Generation Status */}
      {generatingVideoId && videoStatus && (
        <Card className="mb-6 border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {videoStatus.status === 'PROCESSING' ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : videoStatus.status === 'COMPLETED' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : videoStatus.status === 'FAILED' ? (
                    <XCircle className="h-5 w-5 text-red-600" />
                  ) : (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  )}
                  <span className="font-medium">
                    {videoStatus.status === 'PROCESSING' ? 'Gerando vídeo...' :
                     videoStatus.status === 'COMPLETED' ? 'Vídeo concluído!' :
                     videoStatus.status === 'FAILED' ? 'Falha na geração' :
                     'Preparando...'}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {videoStatus.progress ? `${Math.round(videoStatus.progress)}%` : '0%'}
                </span>
              </div>
              <Progress value={videoStatus.progress || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Input */}
          <Card>
            <CardHeader>
              <CardTitle>Descrição do Vídeo</CardTitle>
              <CardDescription>
                Descreva o que você quer ver no seu vídeo. Seja específico e criativo!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prompt">Prompt</Label>
                  <span className="text-sm text-muted-foreground">
                    {characterCount}/2500 caracteres
                  </span>
                </div>
                <Textarea
                  id="prompt"
                  placeholder="Uma praia serena ao pôr do sol com ondas suaves, areia dourada e gaivotas voando..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={6}
                  maxLength={2500}
                  disabled={isGenerating}
                />
              </div>

              {/* Enhance Prompt Toggle */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-primary" />
                    <Label htmlFor="enhance">Melhorar Prompt com IA</Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Otimiza seu prompt para melhores resultados
                  </p>
                </div>
                <Switch
                  id="enhance"
                  checked={enhancePrompt}
                  onCheckedChange={setEnhancePrompt}
                  disabled={isGenerating}
                />
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>
                Escolha o modelo de IA e as configurações do vídeo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Model Selection */}
              <div className="space-y-2">
                <Label>Modelo de IA</Label>
                <RadioGroup value={provider} onValueChange={setProvider} disabled={isGenerating}>
                  <div className="space-y-4">
                    {/* Luma Options */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Luma Dream Machine</div>
                      {Object.entries(apiConfigs).filter(([key]) => key.startsWith('LUMA')).map(([key, config]) => (
                        <div key={key} className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                          <RadioGroupItem value={key} id={key} className="mt-1" />
                          <Label htmlFor={key} className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{config.name}</span>
                              <Badge variant={config.badge === 'BEST' ? 'default' : 'secondary'} className="text-xs">
                                {config.badge}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {key === 'LUMA_V1' ? 'Geração rápida, ótimo para a maioria dos casos' : 'Qualidade aprimorada, resultados ultra-realistas'}
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm font-medium text-primary">{config.credits} créditos/seg</span>
                              <span className="text-xs text-muted-foreground">{config.time}</span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>

                    {/* Kling Options */}
                    <div className="space-y-2 pt-3">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Kling AI</div>
                      {Object.entries(apiConfigs).filter(([key]) => key.startsWith('KLING')).map(([key, config]) => (
                        <div key={key} className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                          <RadioGroupItem value={key} id={key} className="mt-1" />
                          <Label htmlFor={key} className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{config.name}</span>
                              <Badge variant={config.badge === 'BEST' ? 'default' : 'secondary'} className="text-xs">
                                {config.badge}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {key === 'KLING_V1' ? 'Criativo e artístico, qualidade padrão' : 'Modelo mais recente, qualidade cinematográfica'}
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm font-medium text-primary">{config.credits} créditos/seg</span>
                              <span className="text-xs text-muted-foreground">{config.time}</span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <Label htmlFor="aspect-ratio">Proporção</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={isGenerating}>
                  <SelectTrigger id="aspect-ratio">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Paisagem)</SelectItem>
                    <SelectItem value="9:16">9:16 (Retrato)</SelectItem>
                    <SelectItem value="1:1">1:1 (Quadrado)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">Duração</Label>
                <Select value={duration} onValueChange={setDuration} disabled={isGenerating}>
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 segundos</SelectItem>
                    <SelectItem value="5">5 segundos</SelectItem>
                    <SelectItem value="7">7 segundos</SelectItem>
                    <SelectItem value="10">10 segundos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Generation Summary */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Resumo da Geração
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Modelo IA</span>
                  <span className="font-medium">{selectedApi.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Proporção</span>
                  <span className="font-medium">{aspectRatio}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duração</span>
                  <span className="font-medium">{duration} segundos</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Melhorar Prompt</span>
                  <span className="font-medium">{enhancePrompt ? 'Sim' : 'Não'}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Créditos Necessários</span>
                  <span className="text-2xl font-bold text-primary">{estimatedCredits}</span>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Você tem {userStats?.credits || 0} créditos disponíveis
                </div>
                {!hasEnoughCredits && (
                  <Alert className="mt-2" variant="destructive">
                    <AlertDescription className="text-xs">
                      Créditos insuficientes! Você precisa de mais {estimatedCredits - (userStats?.credits || 0)} créditos.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button 
                className="w-full glow-effect" 
                size="lg"
                disabled={characterCount < 10 || !hasEnoughCredits || isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando Vídeo...
                  </>
                ) : (
                  'Gerar Vídeo'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Dicas Pro:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Seja específico sobre cores, iluminação e atmosfera</li>
                <li>• Mencione movimentos de câmera para cenas dinâmicas</li>
                <li>• Inclua detalhes sobre o ambiente</li>
                <li>• Evite personagens ou marcas protegidos por direitos autorais</li>
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}