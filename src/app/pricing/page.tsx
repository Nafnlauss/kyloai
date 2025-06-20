'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2, Sparkles, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const plans = [
  {
    id: 'LITE',
    name: 'Básico',
    description: 'Para criadores iniciantes',
    monthlyPrice: 49,
    yearlyPrice: 470,
    monthlyCredits: 100,
    features: [
      '100 créditos por mês',
      'Vídeos até 10 segundos',
      'Resolução 720p',
      'Suporte por email',
      'Sem marca d\'água',
    ],
    notIncluded: [
      'Vídeos em Full HD',
      'Uso comercial',
      'Fila prioritária',
    ],
  },
  {
    id: 'CREATOR',
    name: 'Criador',
    description: 'Para profissionais',
    monthlyPrice: 199,
    yearlyPrice: 1910,
    monthlyCredits: 500,
    popular: true,
    features: [
      '500 créditos por mês',
      'Vídeos até 15 segundos',
      'Resolução Full HD',
      'Uso comercial permitido',
      'Sem marca d\'água',
      'Fila prioritária',
      'Suporte prioritário',
    ],
    notIncluded: [
      'API Access',
      'Analytics avançado',
    ],
  },
  {
    id: 'PROFESSIONAL',
    name: 'Profissional',
    description: 'Para empresas e agências',
    monthlyPrice: 699,
    yearlyPrice: 6710,
    monthlyCredits: 2000,
    features: [
      '2000 créditos por mês',
      'Vídeos até 30 segundos',
      'Resolução Full HD',
      'Uso comercial ilimitado',
      'API Access',
      'Suporte prioritário',
      'Analytics avançado',
      'Múltiplos usuários',
      'Fila prioritária',
    ],
    notIncluded: [],
  },
]

export default function PricingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [isYearly, setIsYearly] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/pricing')
      return
    }

    setLoadingPlan(planId)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          interval: isYearly ? 'YEARLY' : 'MONTHLY',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container py-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground">
              Start creating amazing AI videos today
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Toggle */}
      <div className="container py-8">
        <div className="flex items-center justify-center gap-4">
          <span className={!isYearly ? 'font-semibold' : 'text-muted-foreground'}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <span className={isYearly ? 'font-semibold' : 'text-muted-foreground'}>
            Yearly
            <Badge variant="secondary" className="ml-2">
              Save 20%
            </Badge>
          </span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container pb-16">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
            const interval = isYearly ? '/year' : '/month'
            
            return (
              <Card 
                key={plan.id} 
                className={plan.popular ? 'border-primary shadow-lg' : ''}
              >
                {plan.popular && (
                  <div className="px-6 py-2 bg-primary text-primary-foreground text-center text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">R$ {price}</span>
                      <span className="text-muted-foreground ml-2">{interval}</span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-muted-foreground mt-1">
                        R$ {Math.round(plan.yearlyPrice / 12)}/month billed annually
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span className="font-semibold">{plan.monthlyCredits} credits/month</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Included:</p>
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {plan.notIncluded.length > 0 && (
                      <>
                        <div className="pt-3" />
                        {plan.notIncluded.map((feature) => (
                          <div key={feature} className="flex items-start gap-2 opacity-60">
                            <X className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button
                    className="w-full"
                    size="lg"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loadingPlan === plan.id}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Get Started'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Credit Packs */}
      <div className="border-t bg-muted/30">
        <div className="container py-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Need More Credits?</h2>
            <p className="text-muted-foreground">
              Purchase additional credits anytime
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Small Pack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">50 credits</div>
                <div className="text-muted-foreground">R$ 19,90</div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" size="sm">
                  Buy Now
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Medium Pack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">100 credits</div>
                <div className="text-muted-foreground">R$ 34,90</div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" size="sm">
                  Buy Now
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Large Pack</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">500 credits</div>
                <div className="text-muted-foreground">R$ 149,90</div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline" size="sm">
                  Buy Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}