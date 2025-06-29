'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function TestReferralPage() {
  const [referralLink, setReferralLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)

  const fetchReferralLink = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/referral/link')
      const data = await response.json()
      
      if (response.ok) {
        setReferralLink(data.referralLink)
        toast.success('Referral link loaded!')
      } else {
        toast.error(data.error || 'Failed to get referral link')
      }
    } catch (error) {
      toast.error('Error fetching referral link')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/referral/stats')
      const data = await response.json()
      
      if (response.ok) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchReferralLink()
    fetchStats()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Referral System</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : referralLink ? (
              <div className="space-y-4">
                <p className="font-mono text-sm bg-muted p-2 rounded">{referralLink}</p>
                <Button 
                  onClick={() => {
                    navigator.clipboard.writeText(referralLink)
                    toast.success('Copied to clipboard!')
                  }}
                >
                  Copy Link
                </Button>
              </div>
            ) : (
              <p>Not logged in or no link available</p>
            )}
          </CardContent>
        </Card>

        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Referral Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>Total Referrals: {stats.totalReferrals}</p>
                <p>Active Referrals: {stats.activeReferrals}</p>
                <p>Total Earnings: ${(stats.totalEarnings / 100).toFixed(2)}</p>
                <p>Pending: ${(stats.pendingEarnings / 100).toFixed(2)}</p>
                <p>Paid: ${(stats.paidEarnings / 100).toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}