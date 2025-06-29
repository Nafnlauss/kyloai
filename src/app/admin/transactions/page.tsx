'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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
import { EmptyState } from '@/components/ui/empty-state'
import { formatCurrency } from '@/lib/admin/calculations'
import { format } from 'date-fns'
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Loader2,
  Receipt,
  Download,
  Filter
} from 'lucide-react'

export default function AdminTransactionsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [page, filterType, filterStatus])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filterType !== 'all' && { type: filterType }),
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/transactions?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }

      const data = await response.json()
      setTransactions(data.transactions || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchTransactions()
  }

  const handleExport = async () => {
    try {
      setExporting(true)
      
      // Fetch all transactions with current filters (no pagination)
      const params = new URLSearchParams({
        limit: '10000', // Get all transactions
        ...(filterType !== 'all' && { type: filterType }),
        ...(filterStatus !== 'all' && { status: filterStatus }),
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/transactions?${params}`)
      if (!response.ok) throw new Error('Failed to fetch transactions for export')
      
      const data = await response.json()
      const allTransactions = data.transactions || []

      // Convert to CSV
      const headers = ['Date', 'Email', 'Name', 'Type', 'Amount', 'Status', 'Method', 'Description', 'ID']
      const rows = allTransactions.map((t: any) => [
        format(new Date(t.createdAt), 'MMM dd, yyyy HH:mm'),
        t.user?.email || '',
        t.user?.name || 'Anonymous',
        getTypeBadgeText(t.type),
        `$${(t.amount / 100).toFixed(2)}`,
        getStatusBadgeText(t.status),
        t.paymentMethod || 'Card',
        t.description || '',
        t.id
      ])

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      // Download file
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Export error:', err)
      setError('Failed to export transactions')
    } finally {
      setExporting(false)
    }
  }

  const getStatusBadgeText = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'succeeded':
        return 'Completed'
      case 'pending':
        return 'Pending'
      case 'failed':
        return 'Failed'
      case 'refunded':
        return 'Refunded'
      default:
        return status
    }
  }

  const getTypeBadgeText = (type: string) => {
    switch (type) {
      case 'SUBSCRIPTION':
        return 'Subscription'
      case 'CREDIT_PURCHASE':
        return 'Credit Purchase'
      case 'SUBSCRIPTION_RENEWAL':
        return 'Renewal'
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'succeeded':
        return <Badge variant="default">Completed</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'refunded':
        return <Badge variant="outline">Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'SUBSCRIPTION':
        return <Badge className="bg-purple-500">Subscription</Badge>
      case 'CREDIT_PURCHASE':
        return <Badge className="bg-blue-500">Credit Purchase</Badge>
      case 'SUBSCRIPTION_RENEWAL':
        return <Badge className="bg-green-500">Renewal</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  if (loading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        <p className="text-muted-foreground">
          View all payment transactions and credit purchases
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Filter and search through all transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email, transaction ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button type="submit" disabled={loading}>
                Search
              </Button>
            </form>

            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="SUBSCRIPTION">Subscriptions</SelectItem>
                  <SelectItem value="CREDIT_PURCHASE">Credit Purchases</SelectItem>
                  <SelectItem value="SUBSCRIPTION_RENEWAL">Renewals</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                size="icon"
                onClick={handleExport}
                disabled={exporting || loading}
                title="Export transactions"
              >
                {exporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {error ? (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          ) : transactions.length === 0 ? (
            <EmptyState
              icon={Receipt}
              title="No transactions found"
              subtitle="Transactions will appear here once users make purchases"
            />
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {transaction.user?.name || 'Anonymous'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.user?.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(transaction.amount / 100)}
                        </TableCell>
                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {transaction.paymentMethod || 'Card'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {transaction.description || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages || loading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}