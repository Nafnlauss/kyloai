import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Video, 
  Sparkles, 
  Users, 
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
              About Kylo
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforming ideas into reality through the world's most advanced artificial intelligence
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-muted-foreground">
                Kylo was born in 2024 with a clear mission: to democratize video creation through artificial intelligence. 
                Founded by a team passionate about technology and creativity, we realized that quality video production 
                was limited to large studios and professionals with expensive equipment.
              </p>
              <p className="text-muted-foreground">
                Today, we are the leading AI video generation platform, enabling creators, businesses, and 
                enthusiasts to transform their ideas into stunning videos with just a few clicks.
              </p>
              <div className="flex gap-4">
                <div>
                  <div className="text-3xl font-bold text-primary">1M+</div>
                  <p className="text-sm text-muted-foreground">Videos Created</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">50k+</div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
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

      {/* Our Mission */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We believe everyone should have access to the tools needed to tell their stories
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-muted-foreground">
                  We are always at the forefront of technology, bringing the latest AI innovations to our users
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
                <p className="text-muted-foreground">
                  We make video creation accessible to everyone, regardless of technical experience
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Trust</h3>
                <p className="text-muted-foreground">
                  We protect your data and content with the highest security standards in the market
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cutting-Edge Technology</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We use the world's most advanced AI models
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Luma Dream Machine</h3>
                <p className="text-muted-foreground">
                  Cutting-edge technology for ultra-realistic and cinematic videos
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Kling AI</h3>
                <p className="text-muted-foreground">
                  AI specialized in creativity and unique artistic styles
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Global Infrastructure</h3>
                <p className="text-muted-foreground">
                  Globally distributed servers for maximum speed
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Enterprise Security</h3>
                <p className="text-muted-foreground">
                  End-to-end encryption and GDPR compliance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A diverse and talented team dedicated to revolutionizing content creation
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-violet-600 mx-auto mb-3" />
              <p className="font-semibold">Engineering</p>
              <p className="text-sm text-muted-foreground">12 specialists</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mx-auto mb-3" />
              <p className="font-semibold">AI & ML</p>
              <p className="text-sm text-muted-foreground">8 scientists</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mx-auto mb-3" />
              <p className="font-semibold">Design</p>
              <p className="text-sm text-muted-foreground">6 creatives</p>
            </div>
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-red-500 mx-auto mb-3" />
              <p className="font-semibold">Support</p>
              <p className="text-sm text-muted-foreground">10 specialists</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators who are already transforming their ideas into reality
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/register">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}