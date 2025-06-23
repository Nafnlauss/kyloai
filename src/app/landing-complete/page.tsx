'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BillingSwitch } from '@/components/ui/billing-switch'
import { CreditBalance } from '@/components/ui/credit-balance'
import { DemoVideo } from '@/components/ui/demo-video'
import { CookieConsent } from '@/components/ui/cookie-consent'
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
  Coins,
  X
} from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function LandingCompletePage() {
  const [isYearly, setIsYearly] = useState(false)
  const { data: session } = useSession()
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/kylo-logo-new.png" 
                alt="Kylo Logo" 
                width={32} 
                height={32}
                className="w-8 h-8"
              />
              <span className="font-bold text-xl">Kylo</span>
            </Link>
          </div>
          
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
                  <Link href="/studio/video">Studio</Link>
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
            
            <div className="flex flex-wrap gap-8 justify-center text-sm text-muted-foreground pt-8">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <span>300 free credits</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <span>Best market value</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <span>No recurring charges</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">1M+</div>
              <div className="text-sm text-muted-foreground mt-1">Videos Created</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">50k+</div>
              <div className="text-sm text-muted-foreground mt-1">Active Users</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">4.9/5</div>
              <div className="text-sm text-muted-foreground mt-1">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Kylo?</h2>
            <p className="text-xl text-muted-foreground">Everything you need to create professional AI videos</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ultra-Fast Generation</h3>
                <p className="text-muted-foreground">Create videos in minutes, not hours. Our AI processes your ideas at lightning speed.</p>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple AI Models</h3>
                <p className="text-muted-foreground">Choose between Luma and Kling AI models for different styles and capabilities.</p>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">HD Quality</h3>
                <p className="text-muted-foreground">Generate videos in 720p or Full HD resolution with crystal clear quality.</p>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">100% Secure</h3>
                <p className="text-muted-foreground">Your data is encrypted and secure. We never share your creations or information.</p>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Support</h3>
                <p className="text-muted-foreground">Available worldwide with support for multiple languages and 24/7 assistance.</p>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Wand2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart AI</h3>
                <p className="text-muted-foreground">Our AI understands context and optimizes your prompts for best results.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Create amazing videos in 3 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Describe Your Idea</h3>
              <p className="text-muted-foreground">Write a simple text description of the video you want to create</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Settings</h3>
              <p className="text-muted-foreground">Select AI model, resolution, and other preferences</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate & Download</h3>
              <p className="text-muted-foreground">AI creates your video in minutes, ready to download and share</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Choose the perfect plan for your needs</p>
            
            <div className="flex items-center justify-center mt-8 gap-4">
              <span className={cn("text-sm", !isYearly && "text-primary font-semibold")}>Monthly</span>
              <BillingSwitch 
                checked={isYearly} 
                onCheckedChange={setIsYearly}
                aria-label="Toggle yearly billing"
              />
              <span className={cn("text-sm", isYearly && "text-primary font-semibold")}>
                Yearly
                <Badge variant="secondary" className="ml-2">Save 20%</Badge>
              </span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {/* Free Plan */}
            <Card className="relative border-border/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground mb-6">Perfect for trying out</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">300 free credits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">Videos up to 5 seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">Standard generation speed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span className="text-sm text-muted-foreground">No commercial use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span className="text-sm text-muted-foreground">Watermark on videos</span>
                  </li>
                </ul>
                
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Lite Plan */}
            <Card className="relative border-border/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">Lite</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${isYearly ? '6.67' : '8'}</span>
                  <span className="text-muted-foreground">/month</span>
                  {isYearly && (
                    <div className="text-sm text-muted-foreground">Billed $80 yearly</div>
                  )}
                </div>
                <p className="text-muted-foreground mb-6">For content creators</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">1,000 credits per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">Videos up to 10 seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">720p resolution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">Commercial use allowed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">No watermark</span>
                  </li>
                  {isYearly && (
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <span className="text-sm font-semibold text-yellow-600">
                        Annual credits are cumulative!
                      </span>
                    </li>
                  )}
                </ul>
                
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/register">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Creator Plan */}
            <Card className="relative border-primary">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">Creator</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${isYearly ? '20.83' : '26'}</span>
                  <span className="text-muted-foreground">/month</span>
                  {isYearly && (
                    <div className="text-sm text-muted-foreground">Billed $250 yearly</div>
                  )}
                </div>
                <p className="text-muted-foreground mb-6">For professionals</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">3,500 credits per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">Videos up to 15 seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">Full HD resolution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">Priority generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">API access</span>
                  </li>
                  {isYearly && (
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <span className="text-sm font-semibold text-yellow-600">
                        Annual credits are cumulative!
                      </span>
                    </li>
                  )}
                </ul>
                
                <Button className="w-full" asChild>
                  <Link href="/register">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="relative border-border/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">${isYearly ? '54.40' : '68'}</span>
                  <span className="text-muted-foreground">/month</span>
                  {isYearly && (
                    <div className="text-sm text-muted-foreground">Billed $653 yearly</div>
                  )}
                </div>
                <p className="text-muted-foreground mb-6">For agencies & teams</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">10,000 credits per month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">Videos up to 30 seconds</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">4K resolution</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">Dedicated support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <span className="text-sm">Team collaboration</span>
                  </li>
                  {isYearly && (
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <span className="text-sm font-semibold text-yellow-600">
                        Annual credits are cumulative!
                      </span>
                    </li>
                  )}
                </ul>
                
                <Button className="w-full" variant="outline" asChild>
                  <Link href="/register">Start Free Trial</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Credit Packs */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Need More Credits?</h3>
            <p className="text-muted-foreground">Purchase additional credit packs anytime</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Card className="p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Coins className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-bold text-lg">500 Credits</div>
              <div className="text-2xl font-bold text-primary">$12</div>
            </Card>
            
            <Card className="p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Coins className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-bold text-lg">1,500 Credits</div>
              <div className="text-2xl font-bold text-primary">$30</div>
              <Badge variant="secondary" className="mt-2">Most Popular</Badge>
            </Card>
            
            <Card className="p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Coins className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-bold text-lg">5,000 Credits</div>
              <div className="text-2xl font-bold text-primary">$90</div>
              <Badge variant="secondary" className="mt-2">Best Value</Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* Credit Usage */}
      <section id="credit-usage" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Credit Usage & Pricing</h2>
            <p className="text-xl text-muted-foreground">Transparent pricing per video generation</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Video className="h-5 w-5 text-primary" />
                  Luma AI Model
                </h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center">
                    <span>720p Resolution</span>
                    <Badge variant="secondary">5 credits</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Full HD Resolution</span>
                    <Badge variant="secondary">10 credits</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Enhanced prompts</span>
                    <Badge variant="secondary">+2 credits</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Generation time</span>
                    <span className="text-sm text-muted-foreground">2-5 minutes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Kling AI Model
                </h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center">
                    <span>720p Resolution</span>
                    <Badge variant="secondary">7 credits</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Full HD Resolution</span>
                    <Badge variant="secondary">15 credits</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Professional mode</span>
                    <Badge variant="secondary">+3 credits</Badge>
                  </li>
                  <li className="flex justify-between items-center">
                    <span>Generation time</span>
                    <span className="text-sm text-muted-foreground">5-10 minutes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See What's Possible</h2>
            <p className="text-xl text-muted-foreground">Examples created by our community</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <DemoVideo key={i} index={i} />
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
            Join thousands of creators using Kylo to bring their ideas to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
              <Link href="/register">
                Start Free with 300 Credits
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image 
                  src="/kylo-logo-new.png" 
                  alt="Kylo Logo" 
                  width={24} 
                  height={24}
                  className="w-6 h-6"
                />
                <span className="font-bold text-xl">Kylo</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Transform your ideas into amazing AI videos
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#examples" className="hover:text-foreground">Examples</Link></li>
                <li><Link href="/api-docs" className="hover:text-foreground">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground">Cookie Policy</Link></li>
                <li><Link href="/refund" className="hover:text-foreground">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Kylo. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cookie Consent */}
      <CookieConsent />
    </div>
  )
}