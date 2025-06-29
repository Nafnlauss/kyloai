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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, ChevronLeft, ChevronRight, Loader2, Shield, Trash2, ShieldOff, MoreHorizontal } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ExportButton } from '@/components/admin/export-button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// import { useToast } from '@/components/ui/use-toast'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'

interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string
  credits: number
  isActive: boolean
  createdAt: string
  lastLoginAt: string | null
  plan: string
  subscriptionStatus: string
  videoCount: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    action: () => Promise<void>
    variant?: 'default' | 'destructive'
  }>({
    open: false,
    title: '',
    description: '',
    action: async () => {},
  })
  // const { toast } = useToast()
  
  // Simple toast implementation
  const showToast = (message: { title: string; description?: string; variant?: 'default' | 'destructive' }) => {
    // Create toast element
    const toastEl = document.createElement('div')
    toastEl.className = `fixed bottom-4 right-4 z-50 p-4 rounded-md shadow-lg transition-all ${
      message.variant === 'destructive' ? 'bg-red-600 text-white' : 'bg-gray-900 text-white'
    }`
    toastEl.innerHTML = `
      <div class="font-semibold">${message.title}</div>
      ${message.description ? `<div class="text-sm opacity-90">${message.description}</div>` : ''}
    `
    document.body.appendChild(toastEl)
    
    // Remove after 3 seconds
    setTimeout(() => {
      toastEl.style.opacity = '0'
      setTimeout(() => document.body.removeChild(toastEl), 300)
    }, 3000)
  }

  useEffect(() => {
    fetchUsers()
  }, [page, search])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        q: search
      })

      const response = await fetch(`/api/admin/users?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data.users)
      setTotalPages(data.pagination.totalPages)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchUsers()
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Badge variant="destructive">Admin</Badge>
      case 'MODERATOR':
        return <Badge variant="secondary">Moderator</Badge>
      default:
        return <Badge variant="outline">User</Badge>
    }
  }

  const handleRoleChange = async (userId: string, newRole: string, userEmail: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update role')
      }

      const data = await response.json()
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))

      showToast({
        title: 'Role Updated',
        description: `${userEmail} is now ${newRole.toLowerCase()}`,
      })
    } catch (error) {
      showToast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        // Handle errors for non-204 responses
        if (response.status !== 204) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to delete user')
        }
      }

      // Remove from local state
      setUsers(users.filter(user => user.id !== userId))

      showToast({
        title: 'User removed successfully',
        description: `${userEmail} and all associated data have been deleted`,
      })

      // Refresh the page data
      fetchUsers()
    } catch (error) {
      showToast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const confirmRoleChange = (userId: string, userEmail: string, currentRole: string, newRole: string) => {
    setConfirmDialog({
      open: true,
      title: `Change User Role`,
      description: `Are you sure you want to change ${userEmail} from ${currentRole} to ${newRole}?`,
      action: async () => handleRoleChange(userId, newRole, userEmail),
    })
  }

  const confirmDelete = (userId: string, userEmail: string) => {
    setConfirmDialog({
      open: true,
      title: 'Delete User Account',
      description: `Are you sure you want to permanently delete ${userEmail}? This action cannot be undone and will delete all associated data.`,
      action: async () => handleDeleteUser(userId, userEmail),
      variant: 'destructive',
    })
  }

  const getPlanBadge = (plan: string, status: string) => {
    if (status !== 'ACTIVE' && plan !== 'FREE') {
      return <Badge variant="secondary">{plan} (Inactive)</Badge>
    }
    
    switch (plan) {
      case 'FREE':
        return <Badge variant="outline">Free</Badge>
      case 'LITE':
        return <Badge>Lite</Badge>
      case 'CREATOR':
        return <Badge className="bg-purple-600">Creator</Badge>
      case 'PROFESSIONAL':
        return <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">Pro</Badge>
      default:
        return <Badge>{plan}</Badge>
    }
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage and monitor user accounts
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Search and view all registered users
              </CardDescription>
            </div>
            <ExportButton
              data={users}
              filename={`users-export-${new Date().toISOString().split('T')[0]}`}
              onExport={async () => {
                // Fetch all users for export (without pagination)
                try {
                  const response = await fetch('/api/admin/users?limit=1000')
                  if (!response.ok) throw new Error('Failed to fetch users')
                  const data = await response.json()
                  return data.users
                } catch (error) {
                  console.error('Export error:', error)
                  return users // Return current page as fallback
                }
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by email or name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button type="submit" disabled={loading}>
                Search
              </Button>
            </div>
          </form>

          {error ? (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Videos</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.image || undefined} />
                              <AvatarFallback>
                                {user.name?.[0] || user.email[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.name || 'Anonymous'}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getPlanBadge(user.plan, user.subscriptionStatus)}</TableCell>
                        <TableCell>{user.credits.toLocaleString('en-US')}</TableCell>
                        <TableCell>{user.videoCount}</TableCell>
                        <TableCell>
                          {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          {user.lastLoginAt
                            ? formatDistanceToNow(new Date(user.lastLoginAt), { addSuffix: true })
                            : 'Never'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.isActive ? 'default' : 'secondary'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {user.role !== 'ADMIN' && (
                                <DropdownMenuItem
                                  onClick={() => confirmRoleChange(user.id, user.email, user.role, 'ADMIN')}
                                >
                                  <Shield className="mr-2 h-4 w-4" />
                                  Promote to Admin
                                </DropdownMenuItem>
                              )}
                              {user.role === 'ADMIN' && (
                                <DropdownMenuItem
                                  onClick={() => confirmRoleChange(user.id, user.email, user.role, 'USER')}
                                >
                                  <ShieldOff className="mr-2 h-4 w-4" />
                                  Remove Admin
                                </DropdownMenuItem>
                              )}
                              {user.role === 'USER' && (
                                <DropdownMenuItem
                                  onClick={() => confirmRoleChange(user.id, user.email, user.role, 'MODERATOR')}
                                >
                                  <Shield className="mr-2 h-4 w-4" />
                                  Make Moderator
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => confirmDelete(user.id, user.email)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.action}
        variant={confirmDialog.variant}
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </div>
  )
}