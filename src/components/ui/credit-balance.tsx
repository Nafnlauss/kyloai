'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Coins, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'

export function CreditBalance() {
  const { data: session, status } = useSession()
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCredits() {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          const response = await fetch('/api/user/credits')
          if (response.ok) {
            const data = await response.json()
            setCredits(data.credits)
          }
        } catch (error) {
          console.error('Failed to fetch credits:', error)
        } finally {
          setLoading(false)
        }
      } else if (status === 'unauthenticated') {
        setLoading(false)
      }
    }

    fetchCredits()
  }, [session, status])

  // Se não estiver autenticado, não mostra nada
  if (status === 'unauthenticated') {
    return null
  }

  // Se estiver carregando
  if (status === 'loading' || loading) {
    return (
      <Button variant="ghost" size="sm" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  // Mostra o saldo de créditos
  return (
    <Link href="#pricing" className="group">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-violet-600/10 hover:from-primary/20 hover:to-violet-600/20 transition-all duration-200 border border-primary/20">
        <Coins className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
        <span className="font-bold text-sm">
          {credits !== null ? credits.toLocaleString() : '0'}
        </span>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          créditos
        </span>
      </div>
    </Link>
  )
}