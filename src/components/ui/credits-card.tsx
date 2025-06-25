'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useSession } from 'next-auth/react'

export function CreditsCard() {
  const router = useRouter()
  const { data: session } = useSession()
  const [showOptionsModal, setShowOptionsModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [credits, setCredits] = useState(0)
  const [userPlan, setUserPlan] = useState<'Free' | 'Lite' | 'Creator' | 'Professional'>('Free')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) {
        setIsLoading(false)
        return
      }
      
      try {
        const res = await fetch('/api/user/dashboard')
        
        if (!res.ok) {
          console.error(`HTTP error! status: ${res.status}`)
          setCredits(300)
          setUserPlan('Free')
          return
        }
        
        const data = await res.json()
        setCredits(data.credits !== undefined ? data.credits : 300)
        setUserPlan(data.subscription?.plan || 'Free')
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        // Use default values on error
        setCredits(300)
        setUserPlan('Free')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchUserData, 5000)

    return () => clearInterval(interval)
  }, [session])

  // Listen for credit update events (for instant updates)
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleCreditUpdate = (event: Event) => {
      try {
        const customEvent = event as CustomEvent
        if (customEvent.detail && typeof customEvent.detail.credits === 'number') {
          setCredits(customEvent.detail.credits)
        }
      } catch (error) {
        console.error('Error handling credit update:', error)
      }
    }

    // Listen for custom events that might be triggered after purchases or usage
    window.addEventListener('credits-updated', handleCreditUpdate)
    
    return () => {
      window.removeEventListener('credits-updated', handleCreditUpdate)
    }
  }, [])

  const handleCardClick = () => {
    setShowOptionsModal(true)
  }

  const handleBuyCredits = () => {
    // Check if user is logged in
    if (!session) {
      setShowOptionsModal(false)
      // Import toast would be needed here, but for now we'll use alert
      alert('Please login to purchase credits.')
      return
    }
    
    if (userPlan === 'Free') {
      setShowOptionsModal(false)
      setShowUpgradeModal(true)
    } else {
      router.push('/credits/packs')
    }
  }

  const handleUpgradePlan = () => {
    router.push('/membership')
  }

  return (
    <>
      <Card 
        className="rounded-2xl bg-zinc-900/80 p-6 w-72 shadow-xl cursor-pointer hover:ring-2 hover:ring-[#A259FF] transition-all duration-200"
        onClick={handleCardClick}
      >
        <CardHeader className="p-0 space-y-4">
          <div>
            <CardTitle className="text-lg font-semibold text-white">Kylo Credits</CardTitle>
            <CardDescription className="text-sm text-zinc-400 mt-1">
              Credits are the currency you use to generate videos, images, or audio with any Kylo model.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#A259FF]/20 ring-2 ring-[#A259FF] flex items-center justify-center">
              <span className="text-[#A259FF] text-xl">◆</span>
            </div>
            <div>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-6 w-20 bg-zinc-800 rounded" />
                  <div className="h-3 w-16 bg-zinc-800 rounded mt-1" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">
                    {credits.toLocaleString()}
                  </div>
                  <div className="text-xs text-zinc-400">remaining</div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal Credits Options - Purple Outline Style */}
      <Dialog open={showOptionsModal} onOpenChange={setShowOptionsModal}>
        <DialogContent className="w-[420px] rounded-xl bg-zinc-900 p-6 shadow-2xl border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">Manage your credits</DialogTitle>
            <DialogDescription className="text-sm text-zinc-400">
              Choose how you'd like to continue.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-3 mt-6">
            <Button
              id="btn-buy-credits"
              variant="outline"
              onClick={handleBuyCredits}
              className="w-full border-[#A259FF] bg-transparent text-white hover:bg-[#A259FF]/10 h-11"
            >
              Purchase credit packs
            </Button>
            
            <Button
              id="btn-upgrade-plan"
              onClick={handleUpgradePlan}
              className="w-full bg-[#A259FF] hover:bg-[#9148e0] text-white h-11"
            >
              Upgrade plan
            </Button>
          </div>
          
          <button
            onClick={() => setShowOptionsModal(false)}
            className="absolute top-4 right-4 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogContent>
      </Dialog>

      {/* Modal Upgrade Required */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="w-[420px] rounded-xl bg-zinc-900 p-6 shadow-2xl border-zinc-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-white">Subscribe to a premium plan to purchase credits</DialogTitle>
            <DialogDescription className="text-sm text-zinc-400 leading-relaxed mt-2">
              To purchase additional credit packs, you need to upgrade to a paid membership first. 
              Choose from our flexible plans and unlock the full power of AI generation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => {
                setShowUpgradeModal(false)
                router.push('/membership')
              }}
              className="flex-1 bg-white text-zinc-900 hover:bg-gray-100 h-11"
            >
              Membership plans
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowUpgradeModal(false)}
              className="flex-1 border-zinc-700 hover:bg-zinc-800 h-11"
            >
              No thanks
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}