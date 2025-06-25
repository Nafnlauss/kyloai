'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const login = useCallback(async (provider?: string) => {
    if (provider) {
      await signIn(provider, { callbackUrl: '/dashboard' })
    } else {
      router.push('/auth/signin')
    }
  }, [router])
  
  const logout = useCallback(async () => {
    await signOut({ callbackUrl: '/' })
  }, [])
  
  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    login,
    logout,
  }
}