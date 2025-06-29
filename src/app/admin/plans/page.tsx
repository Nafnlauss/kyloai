'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, CreditCard, TrendingUp, Package } from 'lucide-react'
import { formatBRL } from '@/lib/utils'
import { EmptyState } from '@/components/admin/empty-state'
import LoadingSpinner from '@/components/loading-spinner'

interface Plan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  monthlyCredits: number
  yearlyCredits: number
  features: string[]
  isPopular: boolean
  subscriptionCount: number
  revenue: number
  status: 'active' | 'inactive'
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans || [])
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      accessorKey: 'name',
      header: 'Plan Name',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.original.name}</span>
          {row.original.isPopular && (
            <Badge variant="secondary">Popular</Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'monthlyPrice',
      header: 'Monthly Price',
      cell: ({ row }: any) => formatBRL(row.original.monthlyPrice),
    },
    {
      accessorKey: 'yearlyPrice',
      header: 'Yearly Price',
      cell: ({ row }: any) => formatBRL(row.original.yearlyPrice),
    },
    {
      accessorKey: 'monthlyCredits',
      header: 'Credits/Month',
    },
    {
      accessorKey: 'subscriptionCount',
      header: 'Active Subs',
      cell: ({ row }: any) => (
        <Badge variant="outline">{row.original.subscriptionCount}</Badge>
      ),
    },
    {
      accessorKey: 'revenue',
      header: 'Monthly Revenue',
      cell: ({ row }: any) => formatBRL(row.original.revenue),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <Button variant="outline" size="sm">
          Edit
        </Button>
      ),
    },
  ]

  // Calculate stats
  const totalRevenue = plans.reduce((sum, plan) => sum + plan.revenue, 0)
  const totalSubscriptions = plans.reduce((sum, plan) => sum + plan.subscriptionCount, 0)
  const activePlans = plans.filter(plan => plan.status === 'active').length

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <p className="text-muted-foreground">
          Manage subscription plans and pricing
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">
              {activePlans} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Across all plans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBRL(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Recurring revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Revenue/Plan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.length > 0 ? formatBRL(totalRevenue / plans.length) : formatBRL(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per active plan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plans Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Structure</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Plans</CardTitle>
              <CardDescription>
                Manage your subscription plans and monitor performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {plans.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No plans configured"
                  description="Create subscription plans to start accepting payments"
                />
              ) : (
                <DataTable columns={columns} data={plans} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Structure</CardTitle>
              <CardDescription>
                View and edit pricing for all plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              {plans.length === 0 ? (
                <EmptyState
                  icon={CreditCard}
                  title="No pricing data"
                  description="Configure plans to see pricing structure"
                />
              ) : (
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                        </div>
                        <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                          {plan.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm font-medium">Monthly</p>
                          <p className="text-2xl font-bold">{formatBRL(plan.monthlyPrice)}</p>
                          <p className="text-sm text-muted-foreground">{plan.monthlyCredits} credits</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Yearly</p>
                          <p className="text-2xl font-bold">{formatBRL(plan.yearlyPrice)}</p>
                          <p className="text-sm text-muted-foreground">{plan.yearlyCredits} credits</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan Features</CardTitle>
              <CardDescription>
                Features included in each subscription plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {plans.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No features configured"
                  description="Add plans to configure features"
                />
              ) : (
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{plan.name}</h3>
                      <ul className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="text-sm flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}