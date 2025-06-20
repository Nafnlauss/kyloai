import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Video, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header */}
      <header className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Video className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">KyloAI</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
              Pricing
            </Link>
            <Link href="#examples" className="text-sm text-muted-foreground hover:text-foreground transition">
              Examples
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center rounded-full px-4 py-2 text-sm glass-effect border border-primary/20">
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              <span className="text-foreground">Powered by Luma & Kling AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="block">Transform Text into</span>
              <span className="block gradient-text mt-2">Stunning AI Videos</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create professional videos from simple text prompts using cutting-edge AI technology. 
              No experience needed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground glow-effect" asChild>
                <Link href="/auth/signup">
                  Start Creating Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10" asChild>
                <Link href="#examples">View Examples</Link>
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Get 10 free credits to start • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything You Need to Create Amazing Videos
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <div key={i} className="p-8 rounded-xl border border-border/50 bg-card/30 backdrop-blur hover:border-primary/30 transition-all duration-300">
                  <div className="h-14 w-14 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Generate videos in minutes, not hours. Our AI works at incredible speeds.'
  },
  {
    icon: Sparkles,
    title: 'Multiple AI Models',
    description: 'Choose between Luma Dream Machine and Kling AI for different styles.'
  },
  {
    icon: Video,
    title: 'HD Quality',
    description: 'Export videos in stunning HD quality, perfect for any platform.'
  }
]
