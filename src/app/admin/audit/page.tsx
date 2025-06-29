'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  Download,
  Filter,
  Shield,
  User,
  Calendar,
  Activity,
  AlertCircle,
  LogIn,
  LogOut,
  UserPlus,
  UserX,
  CreditCard,
  Settings,
  Video,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { format } from 'date-fns'

interface AuditLog {
  id: string
  userId?: string
  action: string
  ipAddress?: string
  userAgent?: string
  details?: any
  createdAt: Date
  user?: {
    email: string
    name?: string
  }
}

const actionIcons: Record<string, any> = {
  'user.login': LogIn,
  'user.logout': LogOut,
  'user.update': User,
  'user.delete': UserX,
  'subscription.create': CreditCard,
  'subscription.cancel': CreditCard,
  'credits.add': DollarSign,
  'credits.remove': DollarSign,
  'video.generate': Video,
  'admin.settings.update': Settings,
}

const actionColors: Record<string, string> = {
  'user.login': 'text-green-600',
  'user.logout': 'text-gray-600',
  'user.update': 'text-blue-600',
  'user.delete': 'text-red-600',
  'subscription.create': 'text-green-600',
  'subscription.cancel': 'text-orange-600',
  'credits.add': 'text-green-600',
  'credits.remove': 'text-red-600',
  'video.generate': 'text-purple-600',
  'admin.settings.update': 'text-yellow-600',
}

export default function AuditPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [actionStats, setActionStats] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterAction, setFilterAction] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchAuditLogs()
  }, [page, filterAction])

  const fetchAuditLogs = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        ...(filterAction !== 'all' && { action: filterAction }),
        ...(search && { search })
      })

      const response = await fetch(`/api/admin/audit?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs')
      }

      const data = await response.json()
      setLogs(data.logs || [])
      setActionStats(data.actionStats || [])
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
    fetchAuditLogs()
  }

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Export audit logs')
  }

  const getActionBadge = (action: string) => {
    if (action.includes('FAILED') || action.includes('ERROR')) {
      return <Badge variant="destructive">{action}</Badge>
    }
    if (action.includes('CREATE') || action.includes('UPDATE')) {
      return <Badge variant="default">{action}</Badge>
    }
    if (action.includes('DELETE')) {
      return <Badge variant="outline">{action}</Badge>
    }
    if (action.includes('LOGIN') || action.includes('LOGOUT')) {
      return <Badge className="bg-blue-500">{action}</Badge>
    }
    return <Badge variant="secondary">{action}</Badge>
  }

  if (loading && logs.length === 0) {
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
          <h2 className="text-3xl font-bold tracking-tight">Audit Log</h2>
          <p className="text-muted-foreground">
            Track all administrative actions and system events
          </p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>


      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {actionStats.reduce((sum, stat) => sum + stat.count, 0).toLocaleString('en-US')}
            </div>
            <p className="text-xs text-muted-foreground">
              In selected period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Login Events</CardTitle>
            <LogIn className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {actionStats
                .filter(stat => stat.action.includes('LOGIN'))
                .reduce((sum, stat) => sum + stat.count, 0)
                .toLocaleString('en-US')}
            </div>
            <p className="text-xs text-muted-foreground">
              User authentications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Config Changes</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {actionStats
                .filter(stat => stat.action.includes('UPDATE') || stat.action.includes('SETTINGS'))
                .reduce((sum, stat) => sum + stat.count, 0)
                .toLocaleString('en-US')}
            </div>
            <p className="text-xs text-muted-foreground">
              System modifications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Actions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {actionStats
                .filter(stat => stat.action.includes('DELETE') || stat.action.includes('CANCEL'))
                .reduce((sum, stat) => sum + stat.count, 0)
                .toLocaleString('en-US')}
            </div>
            <p className="text-xs text-muted-foreground">
              Deletions & cancellations
            </p>
          </CardContent>
        </Card>
      </div>


      <Card>
        <CardHeader>
          <CardTitle>Audit History</CardTitle>
          <CardDescription>
            View and search through all system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by action, email, or details..."
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
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="USER_LOGIN">User Login</SelectItem>
                  <SelectItem value="USER_LOGOUT">User Logout</SelectItem>
                  <SelectItem value="FAILED_LOGIN">Failed Login</SelectItem>
                  <SelectItem value="VIDEO_CREATED">Video Created</SelectItem>
                  <SelectItem value="PAYMENT_COMPLETED">Payment Completed</SelectItem>
                  <SelectItem value="SUBSCRIPTION_CREATED">Subscription Created</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error ? (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          ) : logs.length === 0 ? (
            <EmptyState
              icon={Shield}
              title="No audit logs found"
              subtitle="System events will appear here as they occur"
            />
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                        </TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {log.user?.name || 'System'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {log.user?.email || 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs">{log.ipAddress || 'N/A'}</code>
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          <p className="text-sm truncate">
                            {typeof log.details === 'object' 
                              ? JSON.stringify(log.details)
                              : log.details || '-'}
                          </p>
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