'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: string[] = ['ADMIN', 'MODERATOR']
) {
  return function AdminProtectedComponent(props: P) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { toast } = useToast()
    const [authorized, setAuthorized] = useState(false)

    useEffect(() => {
      if (status === 'loading') return

      if (!session) {
        router.push('/login')
        return
      }

      const userRole = session.user?.role
      if (!userRole || !allowedRoles.includes(userRole)) {
        toast({
          title: 'Access Restricted',
          description: 'You do not have permission to access this area.',
          variant: 'destructive',
        })
        router.push('/dashboard')
        return
      }

      setAuthorized(true)
    }, [session, status, router, toast])

    if (status === 'loading' || !authorized) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )
    }

    return <Component {...props} />
  }
}