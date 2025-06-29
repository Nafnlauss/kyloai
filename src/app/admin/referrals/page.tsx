'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/admin/calculations'
import {
  Users,
  TrendingUp,
  DollarSign,
  Link2,
  Search,
  UserPlus,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'

interface ReferralUser {
  id: string
  email: string
  name: string
  referralCode: string
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  pendingEarnings: number
  paidEarnings: number
  createdAt: string
}

export default function AdminReferralsPage() {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<ReferralUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalReferrals: 0,
    totalEarnings: 0,
    pendingPayouts: 0,
  })

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/referrals')
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users || [])
        setSummary(data.summary || {
          totalUsers: 0,
          totalReferrals: 0,
          totalEarnings: 0,
          pendingPayouts: 0,
        })
      } else {
        toast.error('Failed to load referral data')
      }
    } catch (error) {
      toast.error('Error loading referral data')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.referralCode?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const copyReferralLink = (code: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kylo.video'
    const link = `${baseUrl}?ref=${code}`
    navigator.clipboard.writeText(link)
    toast.success('Referral link copied!')
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Referral Management</h2>
        <p className="text-muted-foreground">
          Manage user referrals and commissions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users with Code</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active referral codes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              Users referred
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.totalEarnings / 100)}</div>
            <p className="text-xs text-muted-foreground">
              5% lifetime commission
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summary.pendingPayouts / 100)}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting withdrawal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email, name or referral code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Users</CardTitle>
          <CardDescription>
            Users with referral codes and their statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Referral Code</TableHead>
                  <TableHead className="text-center">Total Referrals</TableHead>
                  <TableHead className="text-center">Active Referrals</TableHead>
                  <TableHead className="text-right">Total Earnings</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name || 'No name'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm">{user.referralCode}</code>
                      </TableCell>
                      <TableCell className="text-center">
                        {user.totalReferrals}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={user.activeReferrals > 0 ? 'default' : 'secondary'}>
                          {user.activeReferrals}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(user.totalEarnings / 100)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(user.pendingEarnings / 100)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(user.paidEarnings / 100)}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyReferralLink(user.referralCode)}
                        >
                          <Link2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}