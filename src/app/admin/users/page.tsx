'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UsersDataTable } from '@/components/admin/users-data-table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, UserPlus } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

export const dynamic = 'force-dynamic'

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 500)
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', debouncedSearch, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        q: debouncedSearch,
        page: page.toString(),
        limit: '10'
      })
      
      const response = await fetch(`/api/admin/users?${params}`)
      if (!response.ok) throw new Error('Failed to fetch users')
      return response.json()
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage user accounts and credits
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <UsersDataTable
        data={data?.users || []}
        totalPages={data?.totalPages || 1}
        currentPage={page}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  )
}