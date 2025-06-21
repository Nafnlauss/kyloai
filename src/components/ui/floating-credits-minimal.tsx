'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Coins } from 'lucide-react'
import { useState, useEffect } from 'react'

export function FloatingCreditsMinimal() {
  const { data: session, status } = useSession()
  const [credits, setCredits] = useState<number | null>(null)

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
        }
      }
    }

    fetchCredits()
    // Atualiza a cada 30 segundos
    const interval = setInterval(fetchCredits, 30000)
    return () => clearInterval(interval)
  }, [session, status])

  // Só mostra se estiver autenticado
  if (status !== 'authenticated' || credits === null) {
    return null
  }

  return (
    <Link href="/pricing" className="fixed bottom-6 right-6 z-40 group">
      <div className="relative">
        {/* Badge principal */}
        <div className="flex items-center gap-2 bg-background border-2 border-primary/20 px-4 py-2 rounded-full shadow-lg group-hover:shadow-xl group-hover:border-primary/40 transition-all duration-200">
          <div className="relative">
            <Coins className="h-5 w-5 text-primary" />
            {credits < 100 && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
          </div>
          <span className="font-bold text-lg">{credits.toLocaleString()}</span>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Clique para comprar créditos
          </div>
        </div>
      </div>
    </Link>
  )
}