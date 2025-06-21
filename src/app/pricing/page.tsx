'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BillingSwitch } from '@/components/ui/billing-switch'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2, Sparkles, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { PRICING_CONFIG, formatPrice } from '@/config/pricing'

const plans = Object.values(PRICING_CONFIG.plans).filter(plan => plan.id !== 'FREE')

export default function PricingPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [isYearly, setIsYearly] = useState(false)
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [loadingPack, setLoadingPack] = useState<string | null>(null)



  const handleBuyCredits = async (pack: string) => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/pricing')
      return
    }

    setLoadingPack(pack)

    try {
      const response = await fetch('/api/stripe/checkout-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pack }),
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
      setLoadingPack(null)
    }
  }

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
        <div className="flex items-center justify-center gap-2">
          <div className="inline-flex rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                !isYearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                isYearly
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Anual
            </button>
          </div>
          {isYearly && (
            <Badge variant="secondary" className="text-xs">
              Economize 20%
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container pb-16">
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => {
            const price = isYearly ? formatPrice(plan.yearlyPrice) : formatPrice(plan.monthlyPrice)
            const interval = isYearly ? '/ano' : '/mês'
            
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
                  <CardTitle className="text-2xl">{plan.displayName}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">{price}</span>
                      <span className="text-muted-foreground ml-2">{interval}</span>
                    </div>
                    {isYearly && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatPrice(Math.round(plan.yearlyPrice / 12))}/mês cobrado anualmente
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span className="font-semibold">
                        {isYearly 
                          ? `${((plan as any).yearlyCredits || plan.monthlyCredits * 12).toLocaleString('pt-BR')} créditos anuais`
                          : `${plan.monthlyCredits} créditos/mês`
                        }
                      </span>
                    </div>
                    {isYearly ? (
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        ✓ Créditos acumulativos - use quando quiser
                      </p>
                    ) : (
                      <p className="text-xs text-orange-600 mt-2 font-medium">
                        ⚠️ Créditos não acumulam - renovam mensalmente
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-medium">Incluído:</p>
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    
                    {/* Show billing-specific features */}
                    {isYearly && (plan as any).yearlyFeatures && (
                      <>
                        <div className="pt-2 border-t border-green-200">
                          {(plan as any).yearlyFeatures.map((feature: string) => (
                            <div key={feature} className="flex items-start gap-2 mt-2">
                              <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                              <span className="text-sm font-medium text-green-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    {!isYearly && (plan as any).monthlyFeatures && (
                      <>
                        <div className="pt-2 border-t border-orange-200">
                          {(plan as any).monthlyFeatures.map((feature: string) => (
                            <div key={feature} className="flex items-start gap-2 mt-2">
                              <span className="text-sm text-orange-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
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
                      'Começar Agora'
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
          
          <div className="grid gap-4 md:grid-cols-4 max-w-6xl mx-auto">
            {Object.values(PRICING_CONFIG.creditPacks).map((pack) => (
              <Card key={pack.id} className={pack.maximum ? 'md:col-span-2' : ''}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{pack.name}</CardTitle>
                  {pack.popular && <Badge variant="secondary" className="w-fit">Popular</Badge>}
                  {pack.bestValue && <Badge variant="secondary" className="w-fit">Best Value</Badge>}
                  {pack.maximum && <Badge className="w-fit">Maximum Savings</Badge>}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pack.credits.toLocaleString('pt-BR')} créditos</div>
                  <div className="text-muted-foreground">{formatPrice(pack.price)}</div>
                  {pack.savings && (
                    <div className="text-xs text-green-600 mt-1">{pack.savings}</div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={pack.maximum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleBuyCredits(pack.id)}
                    disabled={loadingPack === pack.id}
                  >
                    {loadingPack === pack.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Comprar Agora'
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}