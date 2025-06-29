'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  Users,
  Video,
  CreditCard,
  Package,
  FileText,
  Shield,
  ChevronLeft,
  Receipt,
  AlertTriangle,
  Calculator,
  Activity,
  WifiIcon,
  DollarSign,
  Wallet,
  Link2,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
  { name: 'Metrics', href: '/admin/metrics', icon: BarChart3 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Credits', href: '/admin/credits', icon: Wallet },
  { name: 'Videos', href: '/admin/videos', icon: Video },
  { name: 'Stripe', href: '/admin/stripe', icon: DollarSign },
  { name: 'Transactions', href: '/admin/transactions', icon: Receipt },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Referrals', href: '/admin/referrals', icon: Users },
  { name: 'Payouts', href: '/admin/payouts', icon: Wallet },
  { name: 'Plans', href: '/admin/plans', icon: Package },
  { name: 'Alerts', href: '/admin/alerts', icon: AlertTriangle },
  { name: 'Pricing', href: '/admin/pricing', icon: Calculator },
  { name: 'Pricing Config', href: '/admin/pricing-config', icon: Calculator },
  { name: 'API Status', href: '/admin/api-status', icon: WifiIcon },
  { name: 'Integrations', href: '/admin/integrations', icon: Link2 },
  { name: 'Audit Log', href: '/admin/audit', icon: FileText },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = mounted && pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          asChild
        >
          <Link href="/dashboard">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}