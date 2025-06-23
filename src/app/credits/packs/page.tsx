'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Star, ArrowLeft } from 'lucide-react'

const creditPacks = [
  {
    id: 'pack-1000',
    credits: 1000,
    price: 8,
    popular: false,
    savings: null,
  },
  {
    id: 'pack-2500',
    credits: 2500,
    price: 18,
    popular: false,
    savings: '10%',
  },
  {
    id: 'pack-7000',
    credits: 7000,
    price: 45,
    popular: false,
    savings: '20%',
  },
  {
    id: 'pack-16000',
    credits: 16000,
    price: 90,
    popular: true,
    savings: '30%',
  },
]

export default function CreditPacksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentCredits, setCurrentCredits] = useState(300) // Default for new accounts
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user credits and check access
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return
      
      try {
        setIsLoading(true)
        const res = await fetch('/api/user/dashboard')
        
        if (!res.ok) {
          console.error('Failed to fetch user profile, status:', res.status)
          // Use default values and continue
          setCurrentCredits(300)
          setIsLoading(false)
          return
        }
        
        const data = await res.json()
        
        // Use the actual credits or default to 300 for new users
        setCurrentCredits(data.credits !== undefined ? data.credits : 300)
        
        // Redirect Free users to membership
        if (data.subscription?.plan === 'Free' || !data.subscription) {
          router.push('/membership?from=credits')
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        // Keep default of 300 for new users or on error
        setCurrentCredits(300)
        // On error, assume Free plan and redirect
        router.push('/membership?from=credits')
      } finally {
        setIsLoading(false)
      }
    }

    if (status === 'authenticated') {
      fetchUserData()
      
      // Poll for updates every 5 seconds
      const interval = setInterval(fetchUserData, 5000)
      return () => clearInterval(interval)
    } else if (status === 'unauthenticated') {
      // Redirect non-authenticated users to login
      router.push('/login')
    }
  }, [status, session, router])

  // Listen for credit update events
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleCreditUpdate = (event: Event) => {
      try {
        const customEvent = event as CustomEvent
        if (customEvent.detail && typeof customEvent.detail.credits === 'number') {
          setCurrentCredits(customEvent.detail.credits)
        }
      } catch (error) {
        console.error('Error handling credit update:', error)
      }
    }

    window.addEventListener('credits-updated', handleCreditUpdate)
    return () => {
      window.removeEventListener('credits-updated', handleCreditUpdate)
    }
  }, [])

  const handleCheckout = (packId: string) => {
    // Here you would integrate with Stripe or your payment processor
    console.log('Checkout for pack:', packId)
    // For now, just show an alert
    alert('Checkout functionality will be implemented with Stripe integration')
  }

  const handleBack = () => {
    router.push('/studio/video')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Studio
          </Button>
        </div>

        {/* Header with current balance */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Power up your creativity
          </h1>
          <p className="text-zinc-300 text-lg mb-8">
            Get more credits to generate amazing AI videos, images and audio
          </p>
          
          {/* Current Balance Banner */}
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#A259FF]/10 to-violet-600/10 rounded-full border border-[#A259FF]/20">
            <div className="w-2 h-2 rounded-full bg-[#A259FF] animate-pulse" />
            <span className="text-zinc-300">Your balance:</span>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-6 w-16 bg-zinc-800 rounded animate-pulse" />
                <span className="text-zinc-400">credits</span>
              </div>
            ) : (
              <>
                <span className="font-bold text-xl text-[#A259FF]">{currentCredits.toLocaleString()}</span>
                <span className="text-zinc-400">credits</span>
              </>
            )}
          </div>
        </div>

        {/* Credit Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {creditPacks.map((pack) => (
            <Card 
              key={pack.id}
              className={`relative rounded-2xl transition-all duration-300 ${
                pack.popular 
                  ? 'bg-gradient-to-b from-[#A259FF]/20 to-transparent border-[#A259FF]/50 scale-105 shadow-xl shadow-[#A259FF]/20' 
                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-[#A259FF] to-violet-600 text-white border-0 px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Best Value
                  </Badge>
                </div>
              )}
              
              {pack.savings && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                    Save {pack.savings}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2 pt-8">
                <CardTitle className="text-4xl font-bold mb-1">
                  {pack.credits.toLocaleString()}
                </CardTitle>
                <p className="text-zinc-400">credits</p>
              </CardHeader>
              
              <CardContent className="text-center pb-6">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">${pack.price}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-zinc-400">
                    {pack.popular ? (
                      <span className="text-[#A259FF] font-semibold">Best price per credit</span>
                    ) : (
                      <span>One-time purchase</span>
                    )}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="px-6 pb-6">
                <Button 
                  className={`w-full h-12 font-medium text-base ${
                    pack.popular 
                      ? 'bg-[#A259FF] hover:bg-[#9148e0] text-white' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                  }`}
                  onClick={() => handleCheckout(pack.id)}
                >
                  {pack.popular ? 'Get Best Deal' : 'Select Pack'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-center gap-8 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Never expire</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Use with any AI model</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Instant delivery</span>
              </div>
            </div>
            
            <p className="text-xs text-zinc-500 mt-6">
              Secure payment powered by Stripe. All prices in USD.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}