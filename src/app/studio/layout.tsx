'use client'

import { ReactNode, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FileVideo,
  Image as ImageIcon,
  Volume2,
  History,
  X
} from 'lucide-react'
import { useSession } from 'next-auth/react'

interface StudioLayoutProps {
  children: ReactNode
}

export default function StudioLayout({ children }: StudioLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [showCreditsModal, setShowCreditsModal] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  const sidebarItems = [
    { icon: <FileVideo className="w-5 h-5" />, href: '/studio/video', label: 'Video' },
    { icon: <ImageIcon className="w-5 h-5" />, href: '/studio/image', label: 'Image' },
    { icon: <Volume2 className="w-5 h-5" />, href: '/studio/audio', label: 'Audio' },
    { icon: <History className="w-5 h-5" />, href: '/studio/history', label: 'History' }
  ]

  const handleCreditsClick = () => {
    setShowCreditsModal(true)
  }

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Left Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-16 flex flex-col items-center py-8 bg-zinc-950 border-r border-zinc-900">
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
          <div className="w-10 border-t border-zinc-800" />
          
          {/* Simple Credits Button */}
          <div 
            onClick={handleCreditsClick}
            className="credits-button flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-[#A259FF]/20 flex items-center justify-center group-hover:bg-[#A259FF]/30 transition-colors">
              <span className="text-[#A259FF] text-lg">◆</span>
            </div>
            <div className="text-center mt-1 text-xs font-medium">300</div>
          </div>

          {/* Simple Profile Button */}
          <div 
            onClick={handleProfileClick}
            className="profile-button w-10 h-10 rounded-full bg-[#A259FF] flex items-center justify-center text-sm font-semibold text-white cursor-pointer hover:ring-2 hover:ring-[#A259FF] transition-all"
          >
            {session?.user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-16">
        {children}
      </div>

      {/* Simple Credits Modal */}
      {showCreditsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowCreditsModal(false)}>
          <div className="w-[420px] rounded-xl bg-zinc-900 p-6 shadow-2xl border border-zinc-800" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-white mb-4">Manage your credits</h2>
            
            <div className="flex flex-col gap-3">
              <div
                onClick={() => {
                  setShowCreditsModal(false)
                  router.push('/credits/packs')
                }}
                className="px-4 py-3 border border-[#A259FF] text-white hover:bg-[#A259FF]/10 rounded-lg cursor-pointer text-center"
              >
                Purchase credit packs
              </div>
              
              <div
                onClick={() => {
                  setShowCreditsModal(false)
                  router.push('/membership')
                }}
                className="px-4 py-3 bg-[#A259FF] hover:bg-[#9148e0] text-white rounded-lg cursor-pointer text-center"
              >
                Upgrade plan
              </div>
            </div>
            
            <div
              onClick={() => setShowCreditsModal(false)}
              className="absolute top-4 right-4 cursor-pointer opacity-70 hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </div>
          </div>
        </div>
      )}

      {/* Simple Profile Menu */}
      {showProfileMenu && (
        <div className="fixed bottom-8 left-20 w-72 rounded-xl bg-zinc-900 border border-zinc-800 p-4 shadow-xl">
          <div className="space-y-2">
            <div 
              onClick={() => {
                setShowProfileMenu(false)
                router.push('/settings')
              }}
              className="px-3 py-2 hover:bg-zinc-800 rounded cursor-pointer"
            >
              Settings
            </div>
            <div 
              onClick={() => {
                setShowProfileMenu(false)
                window.location.href = '/api/auth/signout'
              }}
              className="px-3 py-2 hover:bg-zinc-800 rounded cursor-pointer"
            >
              Sign out
            </div>
          </div>
        </div>
      )}
    </div>
  )
}