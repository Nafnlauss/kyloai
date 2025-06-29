'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreditCard, DollarSign, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'
import { formatBRL, formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/admin/empty-state'
import LoadingSpinner from '@/components/loading-spinner'

interface Payment {
  id: string
  userId: string
  userEmail: string
  userName: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: string
  provider: 'stripe' | 'paypal'
  description: string
  createdAt: string
  metadata?: {
    planName?: string
    credits?: number
    invoiceUrl?: string
  }
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [dateRange, setDateRange] = useState('7d')

  useEffect(() => {
    fetchPayments()
  }, [dateRange])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/payments?range=${dateRange}`)
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'refunded':
        return <AlertCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  const columns = [
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }: any) => formatDate(new Date(row.original.createdAt)),
    },
    {
      accessorKey: 'userEmail',
      header: 'Customer',
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.userName || 'N/A'}</p>
          <p className="text-sm text-muted-foreground">{row.original.userEmail}</p>
        </div>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }: any) => (
        <div>
          <p>{row.original.description}</p>
          {row.original.metadata?.planName && (
            <p className="text-sm text-muted-foreground">
              Plan: {row.original.metadata.planName}
            </p>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }: any) => (
        <span className="font-medium">
          {row.original.currency === 'BRL' 
            ? formatBRL(row.original.amount / 100)
            : `$${(row.original.amount / 100).toFixed(2)}`
          }
        </span>
      ),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Method',
      cell: ({ row }: any) => (
        <Badge variant="outline">{row.original.paymentMethod}</Badge>
      ),
    },
    {
      accessorKey: 'provider',
      header: 'Provider',
      cell: ({ row }: any) => (
        <Badge variant="secondary">{row.original.provider}</Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(row.original.status)}
          <span className="capitalize">{row.original.status}</span>
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">View</Button>
          {row.original.metadata?.invoiceUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={row.original.metadata.invoiceUrl} target="_blank" rel="noopener noreferrer">
                Invoice
              </a>
            </Button>
          )}
        </div>
      ),
    },
  ]

  // Calculate stats
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amount / 100), 0)
  
  const pendingPayments = payments.filter(p => p.status === 'pending').length
  const failedPayments = payments.filter(p => p.status === 'failed').length
  const completedPayments = payments.filter(p => p.status === 'completed').length

  const filteredPayments = activeTab === 'all' 
    ? payments 
    : payments.filter(p => p.status === activeTab)

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
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">
          Monitor and manage payment transactions
        </p>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-2">
        <Button
          variant={dateRange === '7d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDateRange('7d')}
        >
          Last 7 days
        </Button>
        <Button
          variant={dateRange === '30d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDateRange('30d')}
        >
          Last 30 days
        </Button>
        <Button
          variant={dateRange === '90d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setDateRange('90d')}
        >
          Last 90 days
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBRL(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {completedPayments} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.length > 0 
                ? `${((completedPayments / payments.length) * 100).toFixed(1)}%`
                : '0%'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{failedPayments}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Payments</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
          <TabsTrigger value="refunded">Refunded</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Transactions</CardTitle>
              <CardDescription>
                View and manage all payment transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPayments.length === 0 ? (
                <EmptyState
                  icon={CreditCard}
                  title="No payments found"
                  description={`No ${activeTab === 'all' ? '' : activeTab} payments in the selected time range`}
                />
              ) : (
                <DataTable columns={columns} data={filteredPayments} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Methods Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Breakdown by payment provider and method
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['stripe', 'paypal'].map((provider) => {
              const providerPayments = payments.filter(p => p.provider === provider)
              const providerRevenue = providerPayments
                .filter(p => p.status === 'completed')
                .reduce((sum, p) => sum + (p.amount / 100), 0)
              
              return (
                <div key={provider} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">{provider}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {providerPayments.length} transactions
                    </span>
                  </div>
                  <span className="font-medium">{formatBRL(providerRevenue)}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}