'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency } from '@/lib/admin/calculations'
import { 
  DollarSign, 
  Package, 
  Users,
  TrendingUp,
  Loader2,
  RefreshCw,
  CreditCard,
  ShoppingBag
} from 'lucide-react'

interface Price {
  id: string
  active: boolean
  currency: string
  unitAmount: number
  type: 'one_time' | 'recurring'
  recurring?: {
    interval: string
    intervalCount: number
  }
  metadata?: any
  activeSubscriptions?: number
}

interface Product {
  id: string
  name: string
  description?: string
  active: boolean
  metadata?: any
  prices: Price[]
}

export default function AdminPricingPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filterType, setFilterType] = useState('all')
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalPrices: 0,
    totalActiveSubscriptions: 0
  })

  useEffect(() => {
    fetchProducts()
  }, [filterType])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        type: filterType
      })

      const response = await fetch(`/api/admin/stripe/products?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      
      // Handle if Stripe is not configured
      if (data.error === 'Stripe not configured') {
        setError('Stripe is not configured. Please add your Stripe API key.')
        setProducts([])
        setSummary({
          totalProducts: 0,
          totalPrices: 0,
          totalActiveSubscriptions: 0
        })
        return
      }

      setProducts(data.products || [])
      setSummary(data.summary || {
        totalProducts: 0,
        totalPrices: 0,
        totalActiveSubscriptions: 0
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getPriceDisplay = (price: Price) => {
    const amount = formatCurrency(price.unitAmount / 100)
    if (price.type === 'recurring' && price.recurring) {
      const interval = price.recurring.intervalCount > 1 
        ? `${price.recurring.intervalCount} ${price.recurring.interval}s`
        : price.recurring.interval
      return `${amount} / ${interval}`
    }
    return amount
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pricing Management</h2>
          <p className="text-muted-foreground">
            View and manage Stripe products and pricing
          </p>
        </div>
        <Button onClick={fetchProducts} variant="outline" disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active in Stripe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price Points</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalPrices}</div>
            <p className="text-xs text-muted-foreground">
              Across all products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalActiveSubscriptions}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="recurring">Subscriptions</SelectItem>
              <SelectItem value="one_time">One-time</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Products & Pricing</CardTitle>
          <CardDescription>
            Live data from your Stripe account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No products found"
              subtitle="Create products in your Stripe dashboard to see them here"
            />
          ) : (
            <div className="space-y-6">
              {products.map((product) => (
                <div key={product.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <Badge variant={product.active ? 'default' : 'secondary'}>
                      {product.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  {product.prices.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Price</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Active Subscriptions</TableHead>
                            <TableHead className="text-right">Price ID</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {product.prices.map((price) => (
                            <TableRow key={price.id}>
                              <TableCell className="font-medium">
                                {getPriceDisplay(price)}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">
                                  {price.type === 'recurring' ? (
                                    <><CreditCard className="mr-1 h-3 w-3" /> Subscription</>
                                  ) : (
                                    <><ShoppingBag className="mr-1 h-3 w-3" /> One-time</>
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={price.active ? 'default' : 'secondary'}>
                                  {price.active ? 'Active' : 'Inactive'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {price.activeSubscriptions || 0}
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs">
                                {price.id}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No prices configured</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}