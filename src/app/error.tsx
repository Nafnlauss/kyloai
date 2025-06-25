'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console for debugging
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Oops! Algo deu errado</h2>
        <p className="text-muted-foreground">
          {error.message || 'Ocorreu um erro inesperado'}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Tentar novamente</Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Ir para início
          </Button>
        </div>
      </div>
    </div>
  )
}