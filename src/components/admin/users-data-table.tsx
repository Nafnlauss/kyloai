'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  MoreHorizontal, 
  Edit, 
  CreditCard, 
  Ban, 
  CheckCircle,
  Mail,
  Key
} from 'lucide-react'
import { EditUserCreditsDialog } from './edit-user-credits-dialog'
import { format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  email: string
  name: string | null
  role: string
  credits: number
  isActive: boolean
  subscription?: {
    plan: {
      displayName: string
    }
    status: string
  }
  createdAt: string
  lastLoginAt: string | null
}

interface UsersDataTableProps {
  data: User[]
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  isLoading: boolean
}

export function UsersDataTable({
  data,
  totalPages,
  currentPage,
  onPageChange,
  isLoading
}: UsersDataTableProps) {
  const { toast } = useToast()
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const handleToggleStatus = async (user: User) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}/toggle-status`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to update user status')

      toast({
        title: 'Success',
        description: `User ${user.isActive ? 'deactivated' : 'activated'} successfully`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user status',
        variant: 'destructive',
      })
    }
  }

  const handleResetPassword = async (user: User) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}/reset-password`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to send reset email')

      toast({
        title: 'Success',
        description: 'Password reset email sent',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send reset email',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.name || 'No name'}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.subscription ? (
                    <div>
                      <div className="text-sm">{user.subscription.plan.displayName}</div>
                      <Badge 
                        variant={user.subscription.status === 'ACTIVE' ? 'success' : 'secondary'}
                        className="text-xs"
                      >
                        {user.subscription.status}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Free</span>
                  )}
                </TableCell>
                <TableCell>{user.credits}</TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'success' : 'destructive'}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.lastLoginAt ? (
                    format(new Date(user.lastLoginAt), 'MMM d, yyyy')
                  ) : (
                    <span className="text-muted-foreground">Never</span>
                  )}
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
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Edit Credits
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                        <Key className="mr-2 h-4 w-4" />
                        Send Password Reset
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                        {user.isActive ? (
                          <>
                            <Ban className="mr-2 h-4 w-4" />
                            Deactivate Account
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate Account
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Credits Dialog */}
      {editingUser && (
        <EditUserCreditsDialog
          user={editingUser}
          open={!!editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
    </>
  )
}