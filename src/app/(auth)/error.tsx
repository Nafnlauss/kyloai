'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Auth error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold">Erro de Autenticação</h2>
        <p className="text-muted-foreground">
          {error.message || 'Ocorreu um erro durante a autenticação. Por favor, tente novamente.'}
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button onClick={reset}>
            Tentar novamente
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
          >
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  )
}