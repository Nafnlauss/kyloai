'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import confetti from 'canvas-confetti'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setError('No session ID provided')
      setLoading(false)
      return
    }

    fetchSession()
  }, [sessionId])

  const fetchSession = async () => {
    try {
      const response = await fetch(`/api/admin/stripe/session/${sessionId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch session')
      }
      
      const data = await response.json()
      setSession(data)
      
      // Trigger confetti for successful payment
      if (data.paymentStatus === 'paid') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Verifying payment...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <XCircle className="mx-auto h-12 w-12 text-destructive" />
            <CardTitle className="mt-4">Payment Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/pricing">Return to Pricing</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isSuccessful = session?.paymentStatus === 'paid'

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {isSuccessful ? (
            <>
              <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <CardTitle className="mt-4">Payment Successful!</CardTitle>
              <CardDescription>
                Thank you for your purchase. Your credits have been added to your account.
              </CardDescription>
            </>
          ) : (
            <>
              <XCircle className="mx-auto h-12 w-12 text-destructive" />
              <CardTitle className="mt-4">Payment Not Completed</CardTitle>
              <CardDescription>
                Your payment was not completed. Please try again.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {isSuccessful && session && (
            <div className="rounded-lg bg-muted p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-medium">
                    ${((session.amountTotal || 0) / 100).toFixed(2)} {session.currency?.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium">{session.customer?.email}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button className="flex-1" variant="outline" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}