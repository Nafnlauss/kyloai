'use client'

import { ReactNode, useEffect, useState } from 'react'
import { ErrorBoundary } from '@/components/error-boundary'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FileVideo,
  Image as ImageIcon,
  Volume2,
  History,
  LogOut
} from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/simple-popover'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface StudioLayoutProps {
  children: ReactNode
}

interface UserData {
  credits: number
  plan: 'Free' | 'Lite' | 'Creator' | 'Professional'
}

function StudioLayoutContent({ children }: StudioLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<UserData>({
    credits: 300, // Default for new users
    plan: 'Free'
  })
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  const [showUpgradeRequiredModal, setShowUpgradeRequiredModal] = useState(false)

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      // Fetch user data
      const fetchUserData = async () => {
        try {
          const res = await fetch('/api/user/dashboard')
          
          if (!res.ok) {
            console.error(`HTTP error! status: ${res.status}`)
            // Use default values on error
            setUserData({
              credits: 300,
              plan: 'Free'
            })
            return
          }
          
          const data = await res.json()
          setUserData({
            credits: data.credits !== undefined ? data.credits : 300,
            plan: data.subscription?.plan || 'Free'
          })
        } catch (error) {
          console.error('Failed to fetch user profile:', error)
          // Keep default values for new users
          setUserData({
            credits: 300,
            plan: 'Free'
          })
        }
      }
      
      fetchUserData()
      
      // Poll for updates every 10 seconds
      const interval = setInterval(fetchUserData, 10000)
      
      return () => clearInterval(interval)
    }
  }, [session, status])

  const sidebarItems = [
    {
      icon: <FileVideo className="w-5 h-5" />,
      href: '/studio/video',
      label: 'Video'
    },
    {
      icon: <ImageIcon className="w-5 h-5" />,
      href: '/studio/image',
      label: 'Image'
    },
    {
      icon: <Volume2 className="w-5 h-5" />,
      href: '/studio/audio',
      label: 'Audio'
    },
    {
      icon: <History className="w-5 h-5" />,
      href: '/studio/history',
      label: 'History'
    }
  ]

  const getInitial = (name?: string | null) => {
    return name ? name.charAt(0).toUpperCase() : 'U'
  }

  const handleBuyCredits = () => {
    // Check if user is logged in
    if (status === 'unauthenticated' || !session) {
      setShowCreditsModal(false)
      toast({
        title: 'Login required',
        description: 'Please login to purchase credits.',
        variant: 'destructive',
      })
      return
    }
    
    if (userData.plan === 'Free') {
      setShowCreditsModal(false)
      setShowUpgradeRequiredModal(true)
    } else {
      router.push('/credits/packs')
    }
  }

  const handleUpgradePlan = () => {
    router.push('/membership')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-16 flex flex-col items-center py-8 bg-zinc-950 border-r border-zinc-900 z-50">
        {/* Main Navigation */}
        <div className="flex-1 flex flex-col items-center space-y-6">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`p-2 rounded-lg transition-all ${
                pathname === item.href 
                  ? 'text-white bg-zinc-800' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-zinc-900'
              }`}
              title={item.label}
            >
              {item.icon}
            </Link>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="space-y-4">
          {/* Separator */}
          <div className="w-10 border-t border-zinc-800" />
          
          {/* Logo + Credits - Clickable */}
          <button
            type="button"
            onClick={() => setShowCreditsModal(true)}
            className="flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#A259FF]/20 flex items-center justify-center group-hover:bg-[#A259FF]/30 transition-colors">
              <span className="text-[#A259FF] text-lg">◆</span>
            </div>
            <div className="text-center mt-1 text-xs font-medium">
              {userData.credits}
            </div>
          </button>

          {/* Avatar + Profile Menu */}
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-zinc-600 transition-all"
                aria-label="Open profile menu"
                aria-haspopup="menu"
              >
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#A259FF] flex items-center justify-center text-sm font-semibold text-white">
                    {getInitial(session?.user?.name)}
                  </div>
                )}
              </button>
            </PopoverTrigger>
            
            <PopoverContent 
              side="right" 
              align="end"
              className="w-64 rounded-xl bg-zinc-900 border-zinc-800 p-4 shadow-xl"
            >
              {/* Header */}
              <div className="mb-4">
                <p className="text-sm font-medium text-white truncate">{session?.user?.email || 'user@example.com'}</p>
                <p className="text-xs text-zinc-400">{userData.plan === 'Free' ? 'Free plan' : userData.plan}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="w-full bg-[#A259FF] hover:bg-[#9148e0] text-white"
                  onClick={() => {
                    setIsPopoverOpen(false)
                    router.push('/membership')
                  }}
                >
                  Upgrade plan
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-[#A259FF] bg-transparent text-white hover:bg-[#A259FF]/10"
                  onClick={() => {
                    setIsPopoverOpen(false)
                    setShowCreditsModal(true)
                  }}
                >
                  Buy credits
                </Button>

                <Separator className="my-2 bg-zinc-700" />

                <Button 
                  size="sm" 
                  variant="ghost"
                  className="w-full justify-start text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  onClick={() => {
                    setIsPopoverOpen(false)
                    router.push('/settings')
                  }}
                >
                  Settings
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="w-full justify-start text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  onClick={() => {
                    setIsPopoverOpen(false)
                    router.push('/contact')
                  }}
                >
                  Help & Support
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost"
                  className="w-full justify-start text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-16">
        {children}
      </div>

      {/* Credits Options Modal - Purple Outline Style */}
      <Dialog open={showCreditsModal} onOpenChange={setShowCreditsModal}>
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
            onClick={() => setShowCreditsModal(false)}
            className="absolute top-4 right-4 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogContent>
      </Dialog>

      {/* Upgrade Required Modal */}
      <Dialog open={showUpgradeRequiredModal} onOpenChange={setShowUpgradeRequiredModal}>
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
                setShowUpgradeRequiredModal(false)
                router.push('/membership')
              }}
              className="flex-1 bg-white text-zinc-900 hover:bg-gray-100 h-11"
            >
              Membership plans
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowUpgradeRequiredModal(false)}
              className="flex-1 border-zinc-700 hover:bg-zinc-800 h-11"
            >
              No thanks
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function StudioLayout({ children }: StudioLayoutProps) {
  return (
    <ErrorBoundary>
      <StudioLayoutContent>{children}</StudioLayoutContent>
    </ErrorBoundary>
  )
}