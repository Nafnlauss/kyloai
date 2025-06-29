'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PayoutModal } from './payout-modal'
import { toast } from 'sonner'
import { formatPrice } from '@/config/pricing'
import { formatDistanceToNow } from 'date-fns'
import { 
  Copy, 
  Users, 
  DollarSign, 
  TrendingUp,
  Share2,
  Wallet,
  Link,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react'

interface ReferralStats {
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  pendingEarnings: number
  paidEarnings: number
  referralLink: string | null
}

interface Referral {
  id: string
  email: string
  name: string | null
  joinedAt: string
  isActive: boolean
  plan: string
}

interface Earning {
  id: string
  amount: number
  status: string
  date: string
  referredUser: {
    email: string
    name: string | null
  }
  transaction: {
    amount: number
    type: string
    date: string
  }
}

interface Payout {
  id: string
  amount: number
  currency: string
  method: string
  status: string
  date: string
  processedAt: string | null
  transactionHash: string | null
}

export function ReferralDashboard() {
  const [loading, setLoading] = useState(true)
  const [referralLink, setReferralLink] = useState('')
  const [showPayoutModal, setShowPayoutModal] = useState(false)
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    activeReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    paidEarnings: 0,
    referralLink: null
  })
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      setLoading(true)
      
      // Get referral link
      const linkRes = await fetch('/api/referral/link')
      if (linkRes.ok) {
        const linkData = await linkRes.json()
        setReferralLink(linkData.referralLink)
      }

      // Get stats
      const statsRes = await fetch('/api/referral/stats')
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data.stats)
        setReferrals(data.referrals || [])
        setEarnings(data.recentEarnings || [])
        setPayouts(data.payouts || [])
      }
    } catch (error) {
      console.error('Error fetching referral data:', error)
      toast.error('Failed to load referral data')
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success('Referral link copied to clipboard!')
  }

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Kylo AI',
        text: 'Create amazing AI videos with Kylo!',
        url: referralLink
      }).catch(err => console.log('Error sharing:', err))
    } else {
      copyReferralLink()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link to earn 5% lifetime commission on all purchases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="font-mono text-sm"
            />
            <Button onClick={copyReferralLink} size="icon" variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
            <Button onClick={shareReferralLink} size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeReferrals} active users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.pendingEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting payout
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Out</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.paidEarnings)}</div>
            <p className="text-xs text-muted-foreground">
              Total withdrawn
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="referrals" className="space-y-4">
        <TabsList>
          <TabsTrigger value="referrals">Referrals ({stats.totalReferrals})</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals</CardTitle>
              <CardDescription>
                Users who signed up using your referral link
              </CardDescription>
            </CardHeader>
            <CardContent>
              {referrals.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No referrals yet. Share your link to start earning!
                </p>
              ) : (
                <div className="space-y-4">
                  {referrals.map((referral) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{referral.name || referral.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {formatDistanceToNow(new Date(referral.joinedAt), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={referral.isActive ? 'default' : 'secondary'}>
                          {referral.plan}
                        </Badge>
                        {referral.isActive && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Earnings</CardTitle>
              <CardDescription>
                Your commission from referral purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              {earnings.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No earnings yet. Your referrals need to make purchases.
                </p>
              ) : (
                <div className="space-y-4">
                  {earnings.map((earning) => (
                    <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {formatPrice(earning.amount)} earned
                        </p>
                        <p className="text-sm text-muted-foreground">
                          From {earning.referredUser.name || earning.referredUser.email}'s {earning.transaction.type.toLowerCase().replace('_', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(earning.date), { addSuffix: true })}
                        </p>
                      </div>
                      <Badge variant={
                        earning.status === 'PAID' ? 'default' : 
                        earning.status === 'CONFIRMED' ? 'secondary' : 
                        'outline'
                      }>
                        {earning.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>
                Your withdrawal transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {payouts.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">
                  No payouts yet. Request a withdrawal when you have pending earnings.
                </p>
              ) : (
                <div className="space-y-4">
                  {payouts.map((payout) => (
                    <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">
                          {formatPrice(payout.amount)} {payout.currency}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          via {payout.method.replace(/_/g, ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(payout.date), { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          payout.status === 'COMPLETED' ? 'default' : 
                          payout.status === 'PROCESSING' ? 'secondary' : 
                          payout.status === 'FAILED' ? 'destructive' :
                          'outline'
                        }>
                          {payout.status}
                        </Badge>
                        {payout.transactionHash && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => {
                              // Open blockchain explorer
                              window.open(`https://etherscan.io/tx/${payout.transactionHash}`, '_blank')
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Request Payout Button */}
      {stats.pendingEarnings >= 1000 && ( // Minimum $10 for payout
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ready to withdraw</p>
                <p className="text-sm text-muted-foreground">
                  You have {formatPrice(stats.pendingEarnings)} available for payout
                </p>
              </div>
              <Button onClick={() => setShowPayoutModal(true)}>
                <Wallet className="mr-2 h-4 w-4" />
                Request Payout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payout Modal */}
      <PayoutModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        availableBalance={stats.pendingEarnings}
        onSuccess={fetchReferralData}
      />
    </div>
  )
}