'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, X, Star, ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { toast } from '@/hooks/use-toast'

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
    buttonText: 'Current Plan',
    disabled: true,
  },
  {
    id: 'lite',
    name: 'Lite',
    price: {
      monthly: 8,
      yearly: 76.80, // $6.40/month when paid yearly
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
    buttonText: 'Get Started',
  },
  {
    id: 'creator',
    name: 'Creator',
    price: {
      monthly: 26,
      yearly: 249.60, // $20.80/month when paid yearly
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
    buttonText: 'Get Started',
  },
  {
    id: 'professional',
    name: 'Professional',
    price: {
      monthly: 68,
      yearly: 652.80, // $54.40/month when paid yearly
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
    buttonText: 'Get Started',
  },
]

export default function MembershipPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'free') return
    
    // Check if user is logged in
    if (!session) {
      router.push('/login?callbackUrl=/membership')
      return
    }
    
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          billingCycle
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }
      
      const { url } = await response.json()
      
      if (url) {
        window.location.href = url
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create checkout session',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error creating checkout:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handleBack = () => {
    if (session) {
      router.push('/studio/video')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose your plan</h1>
          <p className="text-zinc-400 text-lg mb-8">
            Transform your ideas into amazing AI videos
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-zinc-800 ring-1 ring-zinc-700 p-1 rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white text-zinc-900'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-white text-zinc-900'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Yearly
              {billingCycle === 'yearly' && (
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
                        : billingCycle === 'monthly' 
                          ? `$${plan.price.monthly}`
                          : `$${(plan.price.yearly / 12).toFixed(2)}`
                      }
                    </span>
                    {plan.price.monthly !== 0 && (
                      <span className="text-zinc-400 ml-2">/month</span>
                    )}
                  </div>
                  {billingCycle === 'yearly' && plan.price.yearly !== 0 && (
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
                      {billingCycle === 'yearly' 
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
                      : plan.disabled
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={plan.disabled}
                >
                  {plan.buttonText}
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

        <div className="text-center text-sm text-zinc-400">
          <p>All paid plans include access to our latest AI models.</p>
          <p className="mt-2">Cancel or change your plan anytime.</p>
        </div>
      </div>
    </div>
  )
}