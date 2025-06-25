'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Coins, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function FloatingCredits() {
  const { data: session, status } = useSession()
  const [credits, setCredits] = useState<number | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)

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
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-16 right-0 bg-background border border-border rounded-lg shadow-xl p-4 w-64"
          >
            <h3 className="font-semibold mb-3">Saldo de Créditos</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Disponível</span>
                <span className="font-bold text-lg">{credits.toLocaleString()}</span>
              </div>
              <div className="border-t pt-3 space-y-2">
                <Link 
                  href="/pricing" 
                  className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors"
                  onClick={() => setIsExpanded(false)}
                >
                  <span className="text-sm">Comprar créditos</span>
                  <Plus className="h-4 w-4" />
                </Link>
                <Link 
                  href="/dashboard" 
                  className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors"
                  onClick={() => setIsExpanded(false)}
                >
                  <span className="text-sm">Ver histórico</span>
                  <span className="text-xs text-muted-foreground">→</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative flex items-center gap-2 bg-gradient-to-r from-primary to-violet-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
          <Coins className="h-5 w-5" />
          <span className="font-bold text-lg">{credits.toLocaleString()}</span>
        </div>
        
        {/* Indicador pulsante para chamar atenção */}
        {credits < 100 && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </motion.button>
    </div>
  )
}