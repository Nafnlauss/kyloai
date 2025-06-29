'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/admin/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Users,
  Search,
  Download,
  RefreshCw,
  DollarSign
} from 'lucide-react'
import { formatBRL, formatDate } from '@/lib/utils'
import { EmptyState } from '@/components/admin/empty-state'
import LoadingSpinner from '@/components/loading-spinner'

interface UserCredit {
  id: string
  email: string
  name: string
  credits: number
  totalSpent: number
  totalPurchased: number
  lastActivity: string
  subscription: string | null
  status: 'active' | 'inactive' | 'suspended'
}

interface CreditTransaction {
  id: string
  userId: string
  userName: string
  userEmail: string
  type: 'purchase' | 'usage' | 'refund' | 'bonus'
  amount: number
  balance: number
  description: string
  createdAt: string
}

export default function AdminCreditsPage() {
  const [users, setUsers] = useState<UserCredit[]>([])
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  useEffect(() => {
    fetchCreditData()
  }, [])

  const fetchCreditData = async () => {
    try {
      setLoading(true)
      const [usersRes, transactionsRes] = await Promise.all([
        fetch('/api/admin/credits/users'),
        fetch('/api/admin/credits/transactions')
      ])

      if (usersRes.ok && transactionsRes.ok) {
        const usersData = await usersRes.json()
        const transData = await transactionsRes.json()
        setUsers(usersData.users || [])
        setTransactions(transData.transactions || [])
      }
    } catch (error) {
      console.error('Error fetching credit data:', error)
    } finally {
      setLoading(false)
    }
  }

  const userColumns = [
    {
      accessorKey: 'name',
      header: 'User',
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.name || 'N/A'}</p>
          <p className="text-sm text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: 'credits',
      header: 'Current Balance',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-muted-foreground" />
          <span className="font-bold text-lg">{row.original.credits}</span>
        </div>
      ),
    },
    {
      accessorKey: 'totalSpent',
      header: 'Total Used',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 text-red-500">
          <TrendingDown className="h-4 w-4" />
          <span>{row.original.totalSpent}</span>
        </div>
      ),
    },
    {
      accessorKey: 'totalPurchased',
      header: 'Total Purchased',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2 text-green-500">
          <TrendingUp className="h-4 w-4" />
          <span>{row.original.totalPurchased}</span>
        </div>
      ),
    },
    {
      accessorKey: 'subscription',
      header: 'Subscription',
      cell: ({ row }: any) => (
        row.original.subscription ? (
          <Badge variant="default">{row.original.subscription}</Badge>
        ) : (
          <Badge variant="secondary">Free</Badge>
        )
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge 
          variant={row.original.status === 'active' ? 'default' : 
                   row.original.status === 'suspended' ? 'destructive' : 'secondary'}
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSelectedUser(row.original.id)}
          >
            View Details
          </Button>
          <Button variant="outline" size="sm">
            Add Credits
          </Button>
        </div>
      ),
    },
  ]

  const transactionColumns = [
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }: any) => formatDate(new Date(row.original.createdAt)),
    },
    {
      accessorKey: 'userName',
      header: 'User',
      cell: ({ row }: any) => (
        <div>
          <p className="font-medium">{row.original.userName}</p>
          <p className="text-sm text-muted-foreground">{row.original.userEmail}</p>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }: any) => {
        const typeIcons = {
          purchase: <CreditCard className="h-4 w-4" />,
          usage: <TrendingDown className="h-4 w-4" />,
          refund: <RefreshCw className="h-4 w-4" />,
          bonus: <DollarSign className="h-4 w-4" />
        }
        const typeColors = {
          purchase: 'text-green-500',
          usage: 'text-red-500',
          refund: 'text-blue-500',
          bonus: 'text-purple-500'
        }
        return (
          <div className={`flex items-center gap-2 ${typeColors[row.original.type]}`}>
            {typeIcons[row.original.type]}
            <span className="capitalize">{row.original.type}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }: any) => (
        <span className={`font-bold ${row.original.type === 'usage' ? 'text-red-500' : 'text-green-500'}`}>
          {row.original.type === 'usage' ? '-' : '+'}{row.original.amount}
        </span>
      ),
    },
    {
      accessorKey: 'balance',
      header: 'Balance After',
      cell: ({ row }: any) => (
        <span className="font-medium">{row.original.balance}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
  ]

  // Calculate stats
  const totalCreditsInSystem = users.reduce((sum, user) => sum + user.credits, 0)
  const totalCreditsUsed = users.reduce((sum, user) => sum + user.totalSpent, 0)
  const totalCreditsPurchased = users.reduce((sum, user) => sum + user.totalPurchased, 0)
  const activeUsersCount = users.filter(u => u.status === 'active').length

  // Filter users based on search
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter transactions for selected user
  const userTransactions = selectedUser 
    ? transactions.filter(t => t.userId === selectedUser)
    : transactions

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Credits Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage user credits and consumption
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchCreditData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCreditsInSystem.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              In all user accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Used</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {totalCreditsUsed.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total consumption
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Purchased</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {totalCreditsPurchased.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total bought by users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsersCount}</div>
            <p className="text-xs text-muted-foreground">
              With credit balance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">User Credits</TabsTrigger>
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Search Bar */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Credit Balances</CardTitle>
              <CardDescription>
                View and manage credits for all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No users found"
                  description={searchTerm ? "Try adjusting your search" : "No users with credits yet"}
                />
              ) : (
                <DataTable columns={userColumns} data={filteredUsers} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                All credit transactions across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userTransactions.length === 0 ? (
                <EmptyState
                  icon={CreditCard}
                  title="No transactions"
                  description="No credit transactions recorded yet"
                />
              ) : (
                <DataTable columns={transactionColumns} data={userTransactions} pageSize={20} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Credit Usage by Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Free', 'Lite', 'Creator', 'Pro', 'Mega'].map((plan) => {
                    const planUsers = users.filter(u => 
                      (u.subscription || 'Free').toLowerCase() === plan.toLowerCase()
                    )
                    const planCredits = planUsers.reduce((sum, u) => sum + u.credits, 0)
                    const percentage = totalCreditsInSystem > 0 
                      ? ((planCredits / totalCreditsInSystem) * 100).toFixed(1)
                      : '0'
                    
                    return (
                      <div key={plan} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{plan}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {planUsers.length} users
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{planCredits.toLocaleString()} credits</p>
                          <p className="text-sm text-muted-foreground">{percentage}%</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Credit Consumers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .slice(0, 5)
                    .map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name || user.email}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.totalSpent} credits used
                          </p>
                        </div>
                        <Badge variant={user.subscription ? 'default' : 'secondary'}>
                          {user.subscription || 'Free'}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}