import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Video, 
  Sparkles, 
  Users, 
  Globe, 
  Zap, 
  Shield,
  ArrowRight,
  CheckCircle 
} from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Sobre a Kylo
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transformando ideias em realidade através da inteligência artificial mais avançada do mundo
            </p>
          </div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Nossa História</h2>
              <p className="text-muted-foreground">
                A Kylo nasceu em 2024 com uma missão clara: democratizar a criação de vídeos através da inteligência artificial. 
                Fundada por uma equipe apaixonada por tecnologia e criatividade, percebemos que a produção de vídeos de qualidade 
                estava limitada a grandes estúdios e profissionais com equipamentos caros.
              </p>
              <p className="text-muted-foreground">
                Hoje, somos a plataforma líder em geração de vídeos com IA no Brasil, permitindo que criadores, empresas e 
                entusiastas transformem suas ideias em vídeos impressionantes com apenas alguns cliques.
              </p>
              <div className="flex gap-4">
                <div>
                  <div className="text-3xl font-bold text-primary">1M+</div>
                  <p className="text-sm text-muted-foreground">Vídeos Criados</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50k+</div>
                  <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">99.9%</div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-violet-600/20 p-8">
                <div className="w-full h-full rounded-xl bg-black/50 flex items-center justify-center">
                  <Video className="h-24 w-24 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossa Missão */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossa Missão e Valores</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Acreditamos que todos devem ter acesso às ferramentas necessárias para contar suas histórias
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Inovação</h3>
                <p className="text-muted-foreground">
                  Estamos sempre na vanguarda da tecnologia, trazendo as últimas inovações em IA para nossos usuários
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Acessibilidade</h3>
                <p className="text-muted-foreground">
                  Tornamos a criação de vídeos acessível para todos, independentemente de experiência técnica
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Confiança</h3>
                <p className="text-muted-foreground">
                  Protegemos seus dados e conteúdo com os mais altos padrões de segurança do mercado
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tecnologia */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tecnologia de Ponta</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Utilizamos os modelos de IA mais avançados do mundo
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Luma Dream Machine</h3>
                <p className="text-muted-foreground">
                  Tecnologia de ponta para vídeos ultra-realistas e cinematográficos
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Kling AI</h3>
                <p className="text-muted-foreground">
                  IA especializada em criatividade e estilos artísticos únicos
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Infraestrutura Global</h3>
                <p className="text-muted-foreground">
                  Servidores distribuídos globalmente para máxima velocidade
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Segurança Enterprise</h3>
                <p className="text-muted-foreground">
                  Criptografia de ponta a ponta e conformidade com LGPD
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossa Equipe</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma equipe diversa e talentosa dedicada a revolucionar a criação de conteúdo
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-violet-600 mx-auto mb-3" />
              <p className="font-semibold">Engenharia</p>
              <p className="text-sm text-muted-foreground">12 especialistas</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mx-auto mb-3" />
              <p className="font-semibold">IA & ML</p>
              <p className="text-sm text-muted-foreground">8 cientistas</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mx-auto mb-3" />
              <p className="font-semibold">Design</p>
              <p className="text-sm text-muted-foreground">6 criativos</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mx-auto mb-3" />
              <p className="font-semibold">Suporte</p>
              <p className="text-sm text-muted-foreground">10 especialistas</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Junte-se a milhares de criadores que já estão transformando suas ideias em realidade
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Começar Gratuitamente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                Fale Conosco
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}