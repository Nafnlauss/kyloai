'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global application error:', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4 p-8">
            <h1 className="text-4xl font-bold text-destructive">500</h1>
            <h2 className="text-2xl font-semibold">Global System Error</h2>
            <p className="text-muted-foreground max-w-md">
              A critical error occurred in the application. Please try again or contact support if the problem persists.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Button onClick={reset}>Try again</Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
              >
                Back to home
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}