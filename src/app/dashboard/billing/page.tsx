'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  CreditCard, 
  Download, 
  ExternalLink, 
  Loader2,
  Settings,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

export default function BillingPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)

  // Check for success parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('success') === 'true') {
      toast({
        title: 'Success!',
        description: 'Your subscription has been activated.',
        duration: 5000,
      })
      // Remove the parameter from URL
      window.history.replaceState({}, '', '/dashboard/billing')
    }
  }, [toast])

  const { data: billing, isLoading } = useQuery({
    queryKey: ['billing'],
    queryFn: async () => {
      const response = await fetch('/api/user/billing')
      if (!response.ok) throw new Error('Failed to fetch billing data')
      return response.json()
    },
  })

  const handleManageSubscription = async () => {
    setIsLoadingPortal(true)
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open billing portal')
      }

      window.location.href = data.url
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoadingPortal(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  const { subscription, transactions, credits } = billing || {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and view your billing history
        </p>
      </div>

      {/* Current Credits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Available Credits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{credits || 0}</div>
          <p className="text-muted-foreground mt-1">
            Credits never expire
          </p>
        </CardContent>
      </Card>

      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
          <CardDescription>
            Your current plan and billing details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {subscription.plan.displayName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {subscription.plan.monthlyCredits} credits per month
                  </p>
                </div>
                <Badge
                  variant={subscription.status === 'ACTIVE' ? 'success' : 'secondary'}
                >
                  {subscription.status}
                </Badge>
              </div>

              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing cycle</span>
                  <span className="font-medium">{subscription.interval}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current period</span>
                  <span className="font-medium">
                    {format(new Date(subscription.currentPeriodStart), 'MMM d')} - 
                    {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                  </span>
                </div>
                {subscription.cancelAtPeriodEnd && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">
                      Cancels on {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </div>

              <Button
                onClick={handleManageSubscription}
                disabled={isLoadingPortal}
                className="w-full"
              >
                {isLoadingPortal ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Subscription
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You don't have an active subscription
              </p>
              <Button asChild>
                <a href="/pricing">View Plans</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>
            Your recent transactions and invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction: any) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium">
                        R$ {(transaction.amount / 100).toFixed(2)}
                      </p>
                      <Badge
                        variant={transaction.status === 'COMPLETED' ? 'success' : 'secondary'}
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    {transaction.invoiceUrl && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <a
                          href={transaction.invoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No transactions yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}