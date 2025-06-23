'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BillingSwitch } from '@/components/ui/billing-switch'
import { CreditBalance } from '@/components/ui/credit-balance'
import { DemoVideo } from '@/components/ui/demo-video'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { 
  ArrowRight, 
  Sparkles, 
  Video, 
  Zap, 
  Check,
  X,
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
            <Image 
              src="/logo_sem_fundo.png" 
              alt="Kylo Logo" 
              width={32} 
              height={32}
              className="h-8 w-8"
              priority
            />
            <span className="font-bold text-xl">Kylo</span>
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
      <section id="pricing" className="py-20 px-4 overflow-x-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple and Transparent Plans
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Choose the perfect plan for your needs
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-zinc-800 ring-1 ring-zinc-700 p-1 rounded-full">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all ${
                  !isYearly
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isYearly
                    ? 'bg-white text-zinc-900'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Yearly
                {isYearly && (
                  <Badge className="ml-2 bg-green-600 text-white text-xs">Save 20%</Badge>
                )}
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative rounded-2xl transition-all ${
                  plan.featured
                    ? 'border-[#A259FF] shadow-xl ring-2 ring-[#A259FF]/20 scale-105'
                    : plan.id === 'free' 
                      ? 'border-zinc-800 bg-zinc-900/30 opacity-80'
                      : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-primary to-violet-600 text-white border-0 px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4 pt-8">
                  <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                  <p className="text-sm text-zinc-400">{plan.description}</p>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                  <div className="text-center mb-6">
                    <div className="mb-2">
                      <span className="text-4xl font-bold">
                        {plan.price.monthly === 0 
                          ? 'Free' 
                          : !isYearly 
                            ? `$${plan.price.monthly}`
                            : `$${(plan.price.yearly / 12).toFixed(2)}`
                        }
                      </span>
                      {plan.price.monthly !== 0 && (
                        <span className="text-zinc-400 ml-2">/month</span>
                      )}
                    </div>
                    {isYearly && plan.price.yearly !== 0 && (
                      <p className="text-sm text-zinc-500 mt-1">
                        Billed annually at ${plan.price.yearly}
                      </p>
                    )}
                    <div className="text-[#A259FF] font-semibold mt-3">
                      {plan.credits.toLocaleString()} credits
                      {plan.id !== 'free' && ' per month'}
                    </div>
                    {plan.id !== 'free' && (
                      <p className="text-xs text-zinc-500 mt-1">
                        {isYearly 
                          ? 'Cumulative credits (never expire)' 
                          : 'Monthly credits (reset each month)'}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 text-sm">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-zinc-600 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={`${!feature.included ? 'text-zinc-500 line-through' : ''}`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="px-6 pb-6">
                  <Button
                    className={`w-full h-11 font-medium ${
                      plan.featured
                        ? 'bg-[#A259FF] hover:bg-[#9148e0] text-white'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    }`}
                    asChild
                  >
                    <Link href="/register">
                      {plan.buttonText}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Enterprise Contact Section */}
          <div className="mt-12 mb-12">
            <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#A259FF]/10 to-violet-600/10 rounded-2xl border border-[#A259FF]/20 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#A259FF] to-violet-400 bg-clip-text text-transparent">
                    Need a custom solution?
                  </h3>
                  <p className="text-zinc-300 text-sm md:text-base">
                    Get unlimited generations, priority support, and custom integrations for your business.
                  </p>
                </div>
                <Button 
                  className="bg-[#A259FF] hover:bg-[#9148e0] text-white px-8 h-12 text-base font-medium whitespace-nowrap"
                  onClick={() => {
                    const email = 'support@kylo.video';
                    window.location.href = `mailto:${email}?subject=Enterprise%20Plan%20Inquiry`;
                  }}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Talk to Sales
                </Button>
              </div>
            </div>
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
                        <p className="text-sm text-muted-foreground">Video quality</p>
                        <p className="text-2xl font-semibold">Standard</p>
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
                        <p className="text-sm text-muted-foreground">Video quality</p>
                        <p className="text-2xl font-semibold">Standard</p>
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
                        <p className="text-sm text-muted-foreground">Video quality</p>
                        <p className="text-2xl font-semibold">Ultra HD</p>
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
                        <p className="text-sm text-muted-foreground">Video quality</p>
                        <p className="text-2xl font-semibold">Professional</p>
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
                        <p className="text-sm text-muted-foreground">Video quality</p>
                        <p className="text-2xl font-semibold">Cinematic</p>
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
                        <p className="text-2xl font-semibold">$8</p>
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
                <Image 
                  src="/logo_sem_fundo.png" 
                  alt="Kylo Logo" 
                  width={24} 
                  height={24}
                  className="h-6 w-6"
                />
                <span className="font-bold text-xl">Kylo</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Transform your ideas into stunning videos with the power of AI.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" target="_blank" rel="noopener noreferrer" aria-label="Open Resources in a new tab" className="text-sm text-muted-foreground hover:text-foreground">Resources</a></li>
                <li><a href="#pricing" target="_blank" rel="noopener noreferrer" aria-label="Open Pricing in a new tab" className="text-sm text-muted-foreground hover:text-foreground">Pricing</a></li>
                <li><a href="#examples" target="_blank" rel="noopener noreferrer" aria-label="Open Examples in a new tab" className="text-sm text-muted-foreground hover:text-foreground">Examples</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" target="_blank" rel="noopener noreferrer" aria-label="Open About Us in a new tab" className="text-sm text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="/contact" target="_blank" rel="noopener noreferrer" aria-label="Open Contact in a new tab" className="text-sm text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" target="_blank" rel="noopener noreferrer" aria-label="Open Privacy Policy in a new tab" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="/terms" target="_blank" rel="noopener noreferrer" aria-label="Open Terms of Service in a new tab" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 Kylo. All rights reserved.
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
    id: 'free',
    name: 'Free',
    price: {
      monthly: 0,
      yearly: 0,
    },
    description: 'Perfect for trying out',
    credits: 300,
    features: [
      { text: '300 free credits', included: true },
      { text: 'Videos up to 5 seconds', included: true },
      { text: 'Slower generation speed', included: true },
      { text: 'Email support', included: true },
      { text: 'Commercial use allowed', included: false },
      { text: 'Buy additional credits', included: false },
      { text: 'Watermark-free videos', included: false },
    ],
    featured: false,
    buttonText: 'Start Free',
  },
  {
    id: 'lite',
    name: 'Lite',
    price: {
      monthly: 8,
      yearly: 76.80,
    },
    description: 'Great for beginners',
    credits: 1000,
    features: [
      { text: '1,000 credits per month', included: true },
      { text: 'Commercial use allowed', included: true },
      { text: 'Buy additional credits', included: true },
      { text: 'Videos up to 10 seconds', included: true },
      { text: 'HD resolution', included: true },
      { text: 'No watermark', included: true },
      { text: 'Standard queue', included: true },
      { text: 'Standard support', included: true },
    ],
    featured: false,
    buttonText: 'Start Now',
  },
  {
    id: 'creator',
    name: 'Creator',
    price: {
      monthly: 26,
      yearly: 249.60,
    },
    description: 'Ideal for content creators',
    credits: 4000,
    features: [
      { text: '4,000 credits per month', included: true },
      { text: 'Commercial use allowed', included: true },
      { text: 'Buy additional credits', included: true },
      { text: 'Videos up to 20 seconds', included: true },
      { text: 'Full HD resolution', included: true },
      { text: 'No watermark', included: true },
      { text: 'Priority queue (2x faster)', included: true },
      { text: 'Priority support', included: true },
    ],
    featured: true,
    buttonText: 'Start Now',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: {
      monthly: 68,
      yearly: 652.80,
    },
    description: 'For intensive commercial use',
    credits: 12000,
    features: [
      { text: '12,000 credits per month', included: true },
      { text: 'Commercial use allowed', included: true },
      { text: 'Buy additional credits', included: true },
      { text: 'Videos up to 30 seconds', included: true },
      { text: '4K resolution', included: true },
      { text: 'No watermark', included: true },
      { text: 'VIP queue (5x faster)', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Dedicated support', included: true },
    ],
    featured: false,
    buttonText: 'Start Now',
  }
]