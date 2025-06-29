'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Overview } from '@/components/admin/overview'
import { RecentSales } from '@/components/admin/recent-sales'
import { ProfitabilityCard } from '@/components/admin/profitability-card'
import { ApiUsageChart } from '@/components/admin/api-usage-chart'
import { StripeStats } from '@/components/admin/stripe-stats'
import { EmptyState } from '@/components/ui/empty-state'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  Video,
  TrendingUp,
  Activity,
  Loader2,
  Coins,
  AlertCircle,
  FileX
} from 'lucide-react'
import { formatCurrency } from '@/lib/admin/calculations'

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/stats')
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Failed to load admin dashboard: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Calculate growth percentages (mock for now since we don't have historical data)
  const revenueGrowth = 0
  const userGrowth = 0
  const videoGrowth = 0
  const subscriptionGrowth = 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">
          Your platform performance with real-time data
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly: {formatCurrency(stats.stats.monthlyRevenue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.stats.activeUsers.toLocaleString('en-US')}
            </div>
            <p className="text-xs text-muted-foreground">
              Total: {stats.stats.totalUsers.toLocaleString('en-US')} users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Videos Generated
            </CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.stats.totalVideos.toLocaleString('en-US')}
            </div>
            <p className="text-xs text-muted-foreground">
              This month: {stats.stats.monthlyVideos.toLocaleString('en-US')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.stats.activeSubscriptions}
            </div>
            <p className="text-xs text-muted-foreground">
              Generating recurring revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profitability Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profitability Analysis</CardTitle>
          <CardDescription>
            Revenue vs API costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.stats.totalRevenue)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">API Costs</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(stats.stats.totalApiCost)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
              <p className="text-2xl font-bold">
                {formatCurrency(stats.stats.profit || 0)}
              </p>
              <p className="text-sm text-muted-foreground">
                Margin: {stats.stats.profitMargin?.toFixed(1) || '0.0'}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credits Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Credits Overview</CardTitle>
          <CardDescription>
            Credit sales vs usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Credits Sold</p>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                {stats.stats.totalCreditsSold?.toLocaleString('en-US') || '0'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Credits Used</p>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {stats.stats.totalCreditsUsed?.toLocaleString('en-US') || '0'}
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Usage Rate: {stats.stats.totalCreditsSold > 0 
                ? ((stats.stats.totalCreditsUsed / stats.stats.totalCreditsSold) * 100).toFixed(1)
                : '0'}%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Latest payment activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!stats.recentTransactions || stats.recentTransactions.length === 0 ? (
            <EmptyState
              icon={FileX}
              title="No transactions yet"
              subtitle="Transactions will appear here once users make purchases"
            />
          ) : (
            <div className="space-y-4">
              {(stats.recentTransactions || []).map((transaction: any) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{transaction.user}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {transaction.type}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stripe Statistics */}
      <StripeStats />

      {/* API Usage by Provider */}
      {stats.videoCosts && stats.videoCosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>API Usage by Provider</CardTitle>
            <CardDescription>
              Cost breakdown by video provider
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stats.videoCosts || []).map((provider: any) => (
                <div key={provider.provider} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{provider.provider}</span>
                    <span className="text-sm text-muted-foreground">
                      {provider.count} videos
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {provider.totalCredits.toLocaleString('en-US')} credits
                    </span>
                    <span className="text-xs font-medium">
                      {formatCurrency(provider.estimatedCost)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}