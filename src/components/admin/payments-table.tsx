'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/admin/calculations'
import { format } from 'date-fns'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

interface Payment {
  id: string
  amount: number
  currency: string
  status: string
  createdAt: string
  user: {
    id: string
    email: string
    name: string | null
  }
  metadata?: string
}

interface PaymentsResponse {
  payments: Payment[]
  pagination: {
    total: number
    limit: number
    offset: number
  }
  summary: {
    totalRevenue: number
    totalRefunded: number
    netRevenue: number
  }
}

export function PaymentsTable() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<PaymentsResponse | null>(null)
  const [page, setPage] = useState(0)
  const limit = 20

  useEffect(() => {
    fetchPayments()
  }, [page])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/admin/stripe/payments?limit=${limit}&offset=${page * limit}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch payments')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">Failed to load payments: {error}</p>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const totalPages = Math.ceil(data.pagination.total / limit)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge variant="default" className="bg-green-500">Succeeded</Badge>
      case 'refunded':
        return <Badge variant="destructive">Refunded</Badge>
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold">
            {formatCurrency(data.summary.totalRevenue / 100)}
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Total Refunded</p>
          <p className="text-2xl font-bold text-destructive">
            {formatCurrency(data.summary.totalRefunded / 100)}
          </p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Net Revenue</p>
          <p className="text-2xl font-bold text-green-500">
            {formatCurrency(data.summary.netRevenue / 100)}
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Credits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.payments.map((payment) => {
              const metadata = payment.metadata 
                ? JSON.parse(payment.metadata)
                : null
              
              return (
                <TableRow key={payment.id}>
                  <TableCell>
                    {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {payment.user.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payment.user.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(payment.amount / 100)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payment.status)}
                  </TableCell>
                  <TableCell>
                    {metadata?.credits ? (
                      <span className="font-medium">
                        {metadata.credits.toLocaleString('en-US')}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {page * limit + 1} to {Math.min((page + 1) * limit, data.pagination.total)} of {data.pagination.total} payments
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages - 1}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}