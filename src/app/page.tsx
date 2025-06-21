'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BillingSwitch } from '@/components/ui/billing-switch'
import { CreditBalance } from '@/components/ui/credit-balance'
import { DemoVideo } from '@/components/ui/demo-video'
import { cn } from '@/lib/utils'
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
  Globe,
  Coins
} from 'lucide-react'

export default function HomePage() {
  const [isYearly, setIsYearly] = useState(false)
  
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
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
              Pricing
            </Link>
            <Link href="#credit-usage" className="text-sm text-muted-foreground hover:text-foreground transition">
              Credit Usage
            </Link>
            <Link href="#examples" className="text-sm text-muted-foreground hover:text-foreground transition">
              Examples
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <CreditBalance />
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-background via-background to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="block">Transform Text into</span>
              <span className="block bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent mt-2 pb-2">
                Amazing AI Videos
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create professional videos from simple text descriptions using cutting-edge AI technology. 
              No experience or expensive equipment needed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link href="/register">
                  Start Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#examples">
                  <Play className="mr-2 h-4 w-4" />
                  View Examples
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm">300 free credits</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm">Best value in the market</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-sm">No recurring charges</span>
              </div>
            </div>
          </div>

          {/* Demo Video */}
          <div className="mt-16 relative max-w-4xl mx-auto">
            <div className="aspect-video rounded-xl bg-gradient-to-br from-primary/20 to-violet-600/20 p-1">
              <DemoVideo />
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
              <div className="text-sm text-muted-foreground">Videos Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50k+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.9/5</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
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
              Powerful Features for Video Creation
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create amazing AI videos
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
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Create amazing videos in 3 simple steps
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
              Simple and Transparent Plans
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Choose the perfect plan for your needs
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <span 
                className={cn(
                  "text-base font-medium transition-colors cursor-pointer",
                  !isYearly ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
                )}
                onClick={() => setIsYearly(false)}
              >
                Monthly
              </span>
              <BillingSwitch
                checked={isYearly}
                onCheckedChange={setIsYearly}
              />
              <span 
                className={cn(
                  "text-base font-medium transition-colors cursor-pointer",
                  isYearly ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
                )}
                onClick={() => setIsYearly(true)}
              >
                Yearly
                {isYearly && (
                  <Badge variant="secondary" className="ml-2">
                    Save 20%
                  </Badge>
                )}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {plans.map((plan, i) => (
              <Card key={i} className={`relative ${plan.featured ? 'border-primary shadow-xl bg-primary/5 scale-105' : ''}`}>
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-primary to-violet-600 text-white border-0 px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    {isYearly && plan.priceYearly && plan.price !== '0' ? (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg text-muted-foreground line-through">${plan.price}</span>
                          <span className="text-4xl font-bold">${(parseFloat(plan.priceYearly) / 12).toFixed(2)}</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Billed ${plan.priceYearly} annually
                        </div>
                        <div className="text-sm text-green-600 font-medium">
                          Save 20%
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>
                  <Button className="w-full" variant={plan.featured ? 'default' : 'outline'} asChild>
                    <Link href="/register">
                      Start Now
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

      {/* Credit Usage Table */}
      <section id="credit-usage" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Credit Usage & Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Transparent pricing for every video generation
            </p>
          </div>

          {/* API Version Tabs */}
          <div className="space-y-12">
            {/* API V1 Section */}
            <div>
              <div className="text-center mb-6">
                <Badge variant="secondary" className="text-lg px-4 py-1 mb-2">
                  API V1 - Standard Quality
                </Badge>
                <p className="text-muted-foreground">Fast generation for everyday use</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 p-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Luma V1
                    </h4>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Credits per second</p>
                        <p className="text-3xl font-bold text-primary">6</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max duration</p>
                        <p className="text-2xl font-semibold">5 sec</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Generation time</p>
                      <p className="font-medium">2-3 minutes</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Fast generation</Badge>
                      <Badge variant="outline" className="text-xs">Good quality</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Kling 1.0 Standard
                    </h4>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Credits per second</p>
                        <p className="text-3xl font-bold text-primary">8</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max duration</p>
                        <p className="text-2xl font-semibold">5 sec</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Generation time</p>
                      <p className="font-medium">2-3 minutes</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Basic quality</Badge>
                      <Badge variant="outline" className="text-xs">Reliable</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* API V2 Section */}
            <div>
              <div className="text-center mb-6">
                <Badge className="text-lg px-4 py-1 mb-2">
                  API V2 - Premium Quality
                </Badge>
                <p className="text-muted-foreground">Professional-grade video generation</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600/10 to-cyan-600/10 p-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Luma V2
                    </h4>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Credits per second</p>
                        <p className="text-3xl font-bold text-primary">10</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max duration</p>
                        <p className="text-2xl font-semibold">10 sec</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Generation time</p>
                      <p className="font-medium">3-4 minutes</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Ultra HD</Badge>
                      <Badge variant="outline" className="text-xs">Photorealistic</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-primary/50 shadow-lg">
                  <div className="bg-gradient-to-r from-primary/20 to-violet-600/20 p-4 relative">
                    <Badge className="absolute top-2 right-2 text-xs">Recommended</Badge>
                    <h4 className="font-semibold flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary" />
                      Kling 1.6 Pro
                    </h4>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Credits per second</p>
                        <p className="text-3xl font-bold text-primary">10</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max duration</p>
                        <p className="text-2xl font-semibold">10 sec</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Generation time</p>
                      <p className="font-medium">3-4 minutes</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Professional</Badge>
                      <Badge variant="outline" className="text-xs">Best value</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 p-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Wand2 className="h-5 w-5" />
                      Kling V2.1
                    </h4>
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Credits per second</p>
                        <p className="text-3xl font-bold text-primary">20</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max duration</p>
                        <p className="text-2xl font-semibold">15 sec</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Generation time</p>
                      <p className="font-medium">4-5 minutes</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Cinematic</Badge>
                      <Badge variant="outline" className="text-xs">Film-grade</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Calculator and Credit Packs */}
          <div className="mt-12 space-y-8">
            {/* Quick Calculator */}
            <Card className="max-w-4xl mx-auto overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-violet-600/5 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Credit Calculator
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">5 second video</p>
                    <p className="font-medium">Kling 1.6 Pro</p>
                    <p className="text-2xl font-bold text-primary mt-2">50 credits</p>
                    <p className="text-xs text-muted-foreground">5 sec × 10 credits</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">10 second video</p>
                    <p className="font-medium">Kling 1.6 Pro</p>
                    <p className="text-2xl font-bold text-primary mt-2">100 credits</p>
                    <p className="text-xs text-muted-foreground">10 sec × 10 credits</p>
                  </div>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">15 second video</p>
                    <p className="font-medium">Kling V2.1</p>
                    <p className="text-2xl font-bold text-primary mt-2">300 credits</p>
                    <p className="text-xs text-muted-foreground">15 sec × 20 credits</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Additional Credits */}
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Need More Credits?</h3>
              <p className="text-muted-foreground mb-8">Purchase additional credit packages anytime</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <Coins className="h-8 w-8 text-primary mx-auto" />
                      <p className="text-2xl font-bold">1,000</p>
                      <p className="text-sm text-muted-foreground">credits</p>
                      <div className="pt-2 border-t mt-2">
                        <p className="text-2xl font-semibold">$9</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow border-green-500/20">
                  <CardContent className="p-6">
                    <Badge className="absolute -top-2 -right-2 bg-green-600">Popular</Badge>
                    <div className="space-y-2">
                      <Coins className="h-8 w-8 text-primary mx-auto" />
                      <p className="text-2xl font-bold">2,500</p>
                      <p className="text-sm text-muted-foreground">credits</p>
                      <div className="pt-2 border-t mt-2">
                        <p className="text-2xl font-semibold">$18</p>
                        <p className="text-xs text-green-600 font-medium">Save 20%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <Coins className="h-8 w-8 text-primary mx-auto" />
                      <p className="text-2xl font-bold">7,000</p>
                      <p className="text-sm text-muted-foreground">credits</p>
                      <div className="pt-2 border-t mt-2">
                        <p className="text-2xl font-semibold">$45</p>
                        <p className="text-xs text-green-600 font-medium">Save 28%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-lg transition-shadow border-primary/20">
                  <Badge className="absolute -top-2 -right-2">Best Value</Badge>
                  <CardContent className="p-6">
                    <div className="space-y-2">
                      <Coins className="h-8 w-8 text-primary mx-auto" />
                      <p className="text-2xl font-bold">16,000</p>
                      <p className="text-sm text-muted-foreground">credits</p>
                      <div className="pt-2 border-t mt-2">
                        <p className="text-2xl font-semibold">$90</p>
                        <p className="text-xs text-green-600 font-medium">Save 38%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <p className="text-sm text-muted-foreground mt-6">
                * All prices include 100% markup for platform sustainability and development
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Amazing Videos?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators already using Kylo
          </p>
          <Button size="lg" asChild>
            <Link href="/register">
              Start Free
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
                <span className="font-bold text-xl">Kylo</span>
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
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">Sobre Nós</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contato</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Política de Privacidade</Link></li>
                <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Termos de Serviço</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 Kylo. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: Zap,
    title: 'Ultra-Fast Generation',
    description: 'Create videos in minutes, not hours. Our AI works at incredible speeds.'
  },
  {
    icon: Sparkles,
    title: 'Multiple AI Models',
    description: 'Choose between Luma and Kling AI, each with different styles and quality levels.'
  },
  {
    icon: Video,
    title: 'HD Quality',
    description: 'Export videos in stunning HD quality, perfect for any platform.'
  },
  {
    icon: Shield,
    title: '100% Secure',
    description: 'Your data and videos are protected with end-to-end encryption.'
  },
  {
    icon: Globe,
    title: 'Global Support',
    description: 'English interface and support for creating videos in multiple languages.'
  },
  {
    icon: Wand2,
    title: 'Smart AI',
    description: 'Our AI automatically improves your prompts for optimized results.'
  }
]

const steps = [
  {
    title: 'Describe Your Idea',
    description: 'Type a detailed description of the video you want to create. Be creative!'
  },
  {
    title: 'Choose Settings',
    description: 'Select the AI model, duration, aspect ratio and other options for your video.'
  },
  {
    title: 'Generate and Download',
    description: 'Wait a few minutes while the AI creates your video. Then just download!'
  }
]

const plans = [
  {
    name: 'Free',
    price: '0',
    priceYearly: '0',
    description: 'Perfect for trying out',
    features: [
      '300 free credits',
      'Videos up to 5 seconds',
      'Slower generation speed',
      'No commercial use',
      'Cannot buy credit packages',
      'Watermark',
      'Email support'
    ],
    featured: false
  },
  {
    name: 'Lite',
    price: '8',
    priceYearly: '76.80',
    description: 'Great for beginners',
    features: [
      '1,000 credits per month',
      'Credits do not accumulate',
      'Commercial use allowed',
      'Buy additional credits',
      'Videos up to 10 seconds',
      'HD resolution',
      'No watermark',
      'Standard queue',
      'Standard support'
    ],
    featured: false
  },
  {
    name: 'Creator',
    price: '26',
    priceYearly: '249.60',
    description: 'Ideal for content creators',
    features: [
      '4,000 credits per month',
      'Credits do not accumulate',
      'Commercial use allowed',
      'Buy additional credits',
      'Videos up to 20 seconds',
      'Full HD resolution',
      'No watermark',
      'Priority queue (2x faster)',
      'Priority support'
    ],
    featured: true
  },
  {
    name: 'Professional',
    price: '68',
    priceYearly: '652.80',
    description: 'For intensive commercial use',
    features: [
      '12,000 credits per month',
      'Credits do not accumulate',
      'Commercial use allowed',
      'Buy additional credits',
      'Videos up to 30 seconds',
      '4K resolution',
      'No watermark',
      'VIP queue (5x faster)',
      'Advanced analytics',
      'Dedicated support'
    ],
    featured: false
  }
]