'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
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
  Home,
  DollarSign,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const navigation = [
  { name: 'Overview', href: '/demo/admin/overview', icon: LayoutDashboard },
  { name: 'Users', href: '/demo/admin/users', icon: Users },
  { name: 'Videos', href: '/demo/admin/videos', icon: Video },
  { name: 'Transactions', href: '/demo/admin/transactions', icon: Receipt },
  { name: 'Stripe', href: '/demo/admin/stripe', icon: DollarSign },
  { name: 'Alerts', href: '/demo/admin/alerts', icon: AlertTriangle },
  { name: 'Pricing', href: '/demo/admin/pricing', icon: Calculator },
  { name: 'API Status', href: '/demo/admin/api-status', icon: WifiIcon },
  { name: 'Audit Log', href: '/demo/admin/audit', icon: FileText },
  { name: 'Plans', href: '/demo/admin/plans', icon: Package },
  { name: 'Payments', href: '/demo/admin/payments', icon: CreditCard },
]

export function DemoAdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">Admin Demo</span>
          <Badge variant="secondary" className="ml-2">DEMO</Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
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
      <div className="border-t p-4 space-y-2">
        <div className="px-3 py-2 text-xs text-muted-foreground">
          Demo mode - Read only
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start"
          asChild
        >
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}