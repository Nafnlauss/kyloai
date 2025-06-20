'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Video, 
  Sparkles, 
  Clock, 
  CreditCard, 
  Settings, 
  LogOut,
  Home,
  Plus,
  Grid3X3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Create Video',
    href: '/dashboard/create',
    icon: Plus,
  },
  {
    title: 'My Videos',
    href: '/dashboard/videos',
    icon: Grid3X3,
  },
  {
    title: 'History',
    href: '/dashboard/history',
    icon: Clock,
  },
  {
    title: 'Billing',
    href: '/dashboard/billing',
    icon: CreditCard,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Video className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">KyloAI</span>
            </Link>
          </div>

          {/* Credits Display */}
          <div className="mx-4 mt-6 rounded-lg bg-primary/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Credits</span>
              </div>
              <span className="text-2xl font-bold text-primary">10</span>
            </div>
            <Button size="sm" variant="secondary" className="mt-3 w-full">
              Get More Credits
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4 py-4">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-3 rounded-lg px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-primary/20" />
              <div className="flex-1">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full justify-start"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}