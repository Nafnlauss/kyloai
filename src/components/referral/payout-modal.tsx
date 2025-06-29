'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatPrice } from '@/config/pricing'
import { toast } from 'sonner'
import { Loader2, AlertCircle, Wallet, Info } from 'lucide-react'

interface PayoutModalProps {
  isOpen: boolean
  onClose: () => void
  availableBalance: number
  onSuccess?: () => void
}

const MINIMUM_PAYOUT = 1000 // $10 in cents

const NETWORK_INFO = {
  ERC20: {
    name: 'Ethereum (ERC-20)',
    placeholder: '0x1234...abcd',
    description: 'USDT on Ethereum mainnet',
    fee: 'Network fees: ~$5-15'
  },
  POLYGON: {
    name: 'Polygon',
    placeholder: '0x1234...abcd',
    description: 'USDT on Polygon network',
    fee: 'Network fees: ~$0.01-0.10'
  },
  SOL: {
    name: 'Solana',
    placeholder: 'So11...1111',
    description: 'USDT on Solana network',
    fee: 'Network fees: ~$0.001'
  }
}

export function PayoutModal({ isOpen, onClose, availableBalance, onSuccess }: PayoutModalProps) {
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const [network, setNetwork] = useState<'ERC20' | 'POLYGON' | 'SOL'>('POLYGON')
  const [address, setAddress] = useState('')
  const [savedWallets, setSavedWallets] = useState<any[]>([])
  const [useNewAddress, setUseNewAddress] = useState(true)

  const amountInCents = Math.floor(parseFloat(amount || '0') * 100)
  const isValidAmount = amountInCents >= MINIMUM_PAYOUT && amountInCents <= availableBalance

  const handleSubmit = async () => {
    if (!isValidAmount || !address) {
      toast.error('Please fill in all fields correctly')
      return
    }

    try {
      setLoading(true)

      const response = await fetch('/api/referral/request-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInCents,
          method: `USDT_${network}`,
          cryptoAddress: address,
          cryptoNetwork: network
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request payout')
      }

      toast.success('Payout requested successfully!')
      onSuccess?.()
      onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to request payout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Payout</DialogTitle>
          <DialogDescription>
            Withdraw your referral earnings to USDT
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Available Balance */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <span className="text-lg font-bold">{formatPrice(availableBalance)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Minimum payout: {formatPrice(MINIMUM_PAYOUT)}
            </p>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min={MINIMUM_PAYOUT / 100}
                max={availableBalance / 100}
                placeholder="10.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8"
              />
            </div>
            {amount && !isValidAmount && (
              <p className="text-xs text-destructive">
                {amountInCents < MINIMUM_PAYOUT 
                  ? `Minimum payout is ${formatPrice(MINIMUM_PAYOUT)}`
                  : 'Amount exceeds available balance'}
              </p>
            )}
          </div>

          {/* Network Selection */}
          <div className="space-y-2">
            <Label htmlFor="network">Network</Label>
            <Select value={network} onValueChange={(v) => setNetwork(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(NETWORK_INFO).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    <div>
                      <div className="font-medium">{info.name}</div>
                      <div className="text-xs text-muted-foreground">{info.fee}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {NETWORK_INFO[network].description}
            </p>
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <Label htmlFor="address">USDT Wallet Address</Label>
            <Input
              id="address"
              placeholder={NETWORK_INFO[network].placeholder}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Double-check your address. Transactions cannot be reversed.
            </p>
          </div>

          {/* Warning */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Make sure you're using a {NETWORK_INFO[network].name} compatible wallet address. 
              Sending USDT to the wrong network will result in permanent loss of funds.
            </AlertDescription>
          </Alert>

          {/* Processing Time Info */}
          <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3">
            <div className="flex gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100">Processing Time</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Payouts are processed within 24-48 hours on business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || !isValidAmount || !address}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Request Payout
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}