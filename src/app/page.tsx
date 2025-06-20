import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowRight, 
  Sparkles, 
  Video, 
  Zap, 
  Check,
  Star,
  Play,
  Shield,
  Clock,
  Wand2,
  Users,
  CreditCard,
  Globe
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Video className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">KyloAI</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Recursos
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">
              Como Funciona
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
              Preços
            </Link>
            <Link href="#examples" className="text-sm text-muted-foreground hover:text-foreground transition">
              Exemplos
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background via-background to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center rounded-full px-4 py-2 text-sm border border-primary/20 bg-primary/10">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span>Powered by Luma Dream Machine & Kling AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="block">Transforme Texto em</span>
              <span className="block bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent mt-2">
                Vídeos Incríveis com IA
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Crie vídeos profissionais a partir de simples descrições de texto usando tecnologia de IA de ponta. 
              Sem necessidade de experiência ou equipamentos caros.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link href="/register">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#examples">
                  <Play className="mr-2 h-4 w-4" />
                  Ver Exemplos
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm">10 créditos grátis</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm">Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm">Cancele quando quiser</span>
              </div>
            </div>
          </div>

          {/* Demo Video */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-violet-600/20 p-1">
              <div className="w-full h-full rounded-lg bg-black/50 flex items-center justify-center">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Play className="h-5 w-5" />
                  Ver Demonstração
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">1M+</div>
              <div className="text-sm text-muted-foreground">Vídeos Criados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50k+</div>
              <div className="text-sm text-muted-foreground">Usuários Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.9/5</div>
              <div className="text-sm text-muted-foreground">Avaliação Média</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recursos Poderosos para Criação de Vídeos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo o que você precisa para criar vídeos impressionantes com IA
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <Card key={i} className="border-border/50 hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Como Funciona
            </h2>
            <p className="text-xl text-muted-foreground">
              Crie vídeos incríveis em 3 passos simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planos Simples e Transparentes
            </h2>
            <p className="text-xl text-muted-foreground">
              Escolha o plano ideal para suas necessidades
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <Card key={i} className={`relative ${plan.featured ? 'border-primary shadow-lg' : ''}`}>
                {plan.featured && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Mais Popular
                  </Badge>
                )}
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">R$ {plan.price}</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <Button className="w-full" variant={plan.featured ? 'default' : 'outline'} asChild>
                    <Link href="/register">
                      Começar Agora
                    </Link>
                  </Button>
                  <ul className="mt-6 space-y-2">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Criar Vídeos Incríveis?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de criadores que já estão usando KyloAI
          </p>
          <Button size="lg" asChild>
            <Link href="/register">
              Começar Gratuitamente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Video className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">KyloAI</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Transforme suas ideias em vídeos incríveis com o poder da IA.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">Recursos</Link></li>
                <li><Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">Preços</Link></li>
                <li><Link href="#examples" className="text-sm text-muted-foreground hover:text-foreground">Exemplos</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">Sobre</Link></li>
                <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contato</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacidade</Link></li>
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Termos</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 KyloAI. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: Zap,
    title: 'Geração Ultra-Rápida',
    description: 'Crie vídeos em minutos, não horas. Nossa IA trabalha em velocidades incríveis.'
  },
  {
    icon: Sparkles,
    title: 'Múltiplos Modelos de IA',
    description: 'Escolha entre Luma e Kling AI, cada um com diferentes estilos e qualidades.'
  },
  {
    icon: Video,
    title: 'Qualidade HD',
    description: 'Exporte vídeos em qualidade HD impressionante, perfeito para qualquer plataforma.'
  },
  {
    icon: Shield,
    title: '100% Seguro',
    description: 'Seus dados e vídeos são protegidos com criptografia de ponta a ponta.'
  },
  {
    icon: Globe,
    title: 'Suporte Global',
    description: 'Interface em português e suporte para criação de vídeos em múltiplos idiomas.'
  },
  {
    icon: Wand2,
    title: 'IA Inteligente',
    description: 'Nossa IA melhora automaticamente seus prompts para resultados otimizados.'
  }
]

const steps = [
  {
    title: 'Descreva sua Ideia',
    description: 'Digite uma descrição detalhada do vídeo que você quer criar. Seja criativo!'
  },
  {
    title: 'Escolha as Configurações',
    description: 'Selecione o modelo de IA, duração, proporção e outras opções para seu vídeo.'
  },
  {
    title: 'Gere e Baixe',
    description: 'Aguarde alguns minutos enquanto a IA cria seu vídeo. Depois é só baixar!'
  }
]

const plans = [
  {
    name: 'Gratuito',
    price: '0',
    description: 'Perfeito para experimentar',
    features: [
      '10 créditos por mês',
      'Vídeos até 5 segundos',
      'Resolução 720p',
      'Marca d\'água',
      'Suporte por email'
    ],
    featured: false
  },
  {
    name: 'Criador',
    price: '49',
    description: 'Ideal para criadores de conteúdo',
    features: [
      '500 créditos por mês',
      'Vídeos até 15 segundos',
      'Resolução Full HD',
      'Sem marca d\'água',
      'Fila prioritária',
      'Suporte prioritário'
    ],
    featured: true
  },
  {
    name: 'Profissional',
    price: '199',
    description: 'Para uso comercial intenso',
    features: [
      '2000 créditos por mês',
      'Vídeos até 30 segundos',
      'Resolução 4K',
      'API access',
      'Analytics avançado',
      'Suporte dedicado'
    ],
    featured: false
  }
]