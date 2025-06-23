'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
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
  const { data: session } = useSession()
  
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
            {session ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/studio/video">Go to Studio</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/api/auth/signout">Logout</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
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
            
            <p className="text-sm text-muted-foreground">
              No credit card required • 300 free credits • Start in seconds
            </p>
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <DemoVideo />
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
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
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create stunning videos in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Write Your Prompt',
                description: 'Describe the video you want to create with text'
              },
              {
                step: '2',
                title: 'Choose AI Model',
                description: 'Select between Luma or Kling AI for your video'
              },
              {
                step: '3',
                title: 'Download Video',
                description: 'Get your AI-generated video in minutes'
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credit Usage Section */}
      <section id="credit-usage" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Credit Usage
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transparent pricing for every video generation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Video className="h-5 w-5 mr-2 text-primary" />
                  Luma AI
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Version 1.0</span>
                    <Badge variant="secondary">10 credits</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Version 1.5</span>
                    <Badge variant="secondary">20 credits</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Version 2.0</span>
                    <Badge variant="secondary">30 credits</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Kling AI
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Version 1.0</span>
                    <Badge variant="secondary">15 credits</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Version 1.5</span>
                    <Badge variant="secondary">30 credits</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Version 2.0</span>
                    <Badge variant="secondary">50 credits</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              <Coins className="inline h-4 w-4 mr-1" />
              1 credit = approximately $0.024 USD
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your needs
            </p>
            <BillingSwitch checked={isYearly} onCheckedChange={setIsYearly} />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan, index) => (
              <Card key={index} className={cn(
                "relative border-border/50 transition-all duration-300",
                plan.featured ? "border-primary shadow-lg scale-105" : "hover:border-primary/50"
              )}>
                {plan.featured && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">
                      ${isYearly ? plan.priceYearly : plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    {plan.description}
                  </p>
                  <Button 
                    className={cn(
                      "w-full mb-6",
                      plan.featured ? "bg-primary hover:bg-primary/90" : ""
                    )}
                    variant={plan.featured ? "default" : "outline"}
                    asChild
                  >
                    <Link href="/register">
                      Get Started
                    </Link>
                  </Button>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Credit Packages */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-center mb-8">
              Need More Credits?
            </h3>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {creditPackages.map((pack, index) => (
                <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <Coins className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h4 className="text-xl font-semibold mb-2">{pack.credits} Credits</h4>
                    <p className="text-2xl font-bold mb-4">${pack.price}</p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">
                        Buy Now
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              See What's Possible
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Examples of videos created with our AI technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                prompt: "A majestic eagle soaring through mountain peaks at sunset",
                provider: "Luma AI",
                duration: "5s"
              },
              {
                prompt: "Futuristic city with flying cars and neon lights at night",
                provider: "Kling AI",
                duration: "10s"
              },
              {
                prompt: "Underwater coral reef with colorful tropical fish",
                provider: "Luma AI",
                duration: "5s"
              },
              {
                prompt: "Time-lapse of flowers blooming in a garden",
                provider: "Kling AI",
                duration: "10s"
              },
              {
                prompt: "Abstract art morphing and flowing with vibrant colors",
                provider: "Luma AI",
                duration: "5s"
              },
              {
                prompt: "Northern lights dancing across a starry sky",
                provider: "Kling AI",
                duration: "10s"
              }
            ].map((example, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted relative group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="h-12 w-12 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm font-medium mb-2">&quot;{example.prompt}&quot;</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{example.provider}</span>
                    <span>{example.duration}</span>
                  </div>
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
            Ready to Create Amazing Videos?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators using KyloAI to bring their ideas to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/register">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#pricing">
                View Pricing
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 300 free credits • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4">
                <Video className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">KyloAI</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Transform your ideas into amazing AI-generated videos.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#examples" className="hover:text-foreground">Examples</Link></li>
                <li><Link href="/api" className="hover:text-foreground">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
                <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="/status" className="hover:text-foreground">Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 KyloAI. All rights reserved.</p>
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
    title: 'Easy to Use',
    description: 'Simple, intuitive interface. No technical knowledge required.'
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

const creditPackages = [
  {
    credits: 1000,
    price: 24
  },
  {
    credits: 5000,
    price: 100
  },
  {
    credits: 10000,
    price: 180
  }
]