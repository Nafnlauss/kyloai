'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { formatPrice } from '@/config/pricing'
import { formatDistanceToNow } from 'date-fns'
import { 
  Loader2, 
  DollarSign, 
  Clock, 
  CheckCircle2,
  XCircle,
  ExternalLink,
  Copy,
  AlertCircle,
  RefreshCw,
  Filter
} from 'lucide-react'

interface Payout {
  id: string
  user: {
    id: string
    email: string
    name: string | null
  }
  amount: number
  currency: string
  method: string
  status: string
  cryptoAddress: string
  cryptoNetwork: string
  transactionHash: string | null
  notes: string | null
  createdAt: string
  processedAt: string | null
}

export default function AdminPayoutsPage() {
  const [loading, setLoading] = useState(true)
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null)
  const [processingModal, setProcessingModal] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const [notes, setNotes] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('pending')
  
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  useEffect(() => {
    fetchPayouts()
  }, [filter])

  const fetchPayouts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/payouts?status=${filter}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch payouts')
      }

      const data = await response.json()
      setPayouts(data.payouts || [])
    } catch (error) {
      toast.error('Failed to load payouts')
    } finally {
      setLoading(false)
    }
  }

  const handleProcessPayout = async (status: 'COMPLETED' | 'FAILED') => {
    if (!selectedPayout || isDemoMode) return

    try {
      const response = await fetch(`/api/admin/payouts/${selectedPayout.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          transactionHash: status === 'COMPLETED' ? transactionHash : undefined,
          notes
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update payout')
      }

      toast.success(`Payout ${status === 'COMPLETED' ? 'completed' : 'marked as failed'}`)
      setProcessingModal(false)
      setSelectedPayout(null)
      setTransactionHash('')
      setNotes('')
      fetchPayouts()
    } catch (error) {
      toast.error('Failed to process payout')
    }
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.success('Address copied to clipboard')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50">Pending</Badge>
      case 'PROCESSING':
        return <Badge variant="secondary">Processing</Badge>
      case 'COMPLETED':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>
      case 'FAILED':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getNetworkExplorerUrl = (network: string, txHash: string) => {
    switch (network) {
      case 'ERC20':
        return `https://etherscan.io/tx/${txHash}`
      case 'POLYGON':
        return `https://polygonscan.com/tx/${txHash}`
      case 'SOL':
        return `https://solscan.io/tx/${txHash}`
      default:
        return '#'
    }
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
          <h2 className="text-3xl font-bold tracking-tight">Referral Payouts</h2>
          <p className="text-muted-foreground">
            Manage and process referral payout requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payouts</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchPayouts} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payouts.filter(p => p.status === 'PENDING').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(
                payouts
                  .filter(p => p.status === 'PENDING')
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total amount to pay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payouts.filter(p => 
                p.status === 'COMPLETED' && 
                p.processedAt && 
                new Date(p.processedAt).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Processed today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(
                payouts
                  .filter(p => p.status === 'COMPLETED')
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              All time payouts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payouts List */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Requests</CardTitle>
          <CardDescription>
            Click on a payout to process or view details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payouts.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No payout requests found
              </p>
            ) : (
              payouts.map((payout) => (
                <div
                  key={payout.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setSelectedPayout(payout)
                    if (payout.status === 'PENDING') {
                      setProcessingModal(true)
                    }
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{payout.user.name || payout.user.email}</p>
                      {getStatusBadge(payout.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatPrice(payout.amount)} {payout.currency}</span>
                      <span>•</span>
                      <span>{payout.method.replace(/_/g, ' ')}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(payout.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {payout.transactionHash && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(getNetworkExplorerUrl(payout.cryptoNetwork, payout.transactionHash), '_blank')
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Modal */}
      <Dialog open={processingModal} onOpenChange={setProcessingModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Process Payout</DialogTitle>
            <DialogDescription>
              Complete or reject this payout request
            </DialogDescription>
          </DialogHeader>

          {selectedPayout && (
            <div className="space-y-4">
              {/* Payout Details */}
              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">User</span>
                  <span className="font-medium">{selectedPayout.user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-medium">{formatPrice(selectedPayout.amount)} {selectedPayout.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <span className="font-medium">{selectedPayout.cryptoNetwork}</span>
                </div>
              </div>

              {/* Wallet Address */}
              <div className="space-y-2">
                <Label>Wallet Address</Label>
                <div className="flex gap-2">
                  <Input
                    value={selectedPayout.cryptoAddress}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => copyAddress(selectedPayout.cryptoAddress)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Transaction Hash */}
              <div className="space-y-2">
                <Label htmlFor="txHash">Transaction Hash (if completed)</Label>
                <Input
                  id="txHash"
                  placeholder="0x..."
                  value={transactionHash}
                  onChange={(e) => setTransactionHash(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {isDemoMode && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Demo mode is active. Payout processing is disabled.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProcessingModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleProcessPayout('FAILED')}
              disabled={isDemoMode}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={() => handleProcessPayout('COMPLETED')}
              disabled={isDemoMode || !transactionHash}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Complete Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}