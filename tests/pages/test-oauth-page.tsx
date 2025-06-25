'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signIn, signOut } from 'next-auth/react'

export default function TestOAuthPage() {
  const { data: session, status } = useSession()
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    checkSession()
  }, [])
  
  const checkSession = async () => {
    try {
      const res = await fetch('/api/check-session')
      const data = await res.json()
      setDebugInfo(data)
    } catch (error) {
      console.error('Error checking session:', error)
    }
  }
  
  const checkOAuthStatus = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/debug/oauth-fix')
      const data = await res.json()
      setDebugInfo(prev => ({ ...prev, oauthStatus: data }))
    } catch (error) {
      console.error('Error checking OAuth status:', error)
    }
    setLoading(false)
  }
  
  const cleanDuplicates = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/debug/oauth-fix?action=clean-duplicates')
      const data = await res.json()
      alert(data.message)
      checkOAuthStatus()
    } catch (error) {
      console.error('Error cleaning duplicates:', error)
    }
    setLoading(false)
  }
  
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">OAuth Test Page</h1>
      
      {/* Session Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Session Status</CardTitle>
          <CardDescription>Current authentication state</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Authenticated:</strong> {session ? 'Yes' : 'No'}</p>
            {session && (
              <>
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>Name:</strong> {session.user?.name}</p>
                <p><strong>ID:</strong> {session.user?.id}</p>
              </>
            )}
          </div>
          
          <div className="mt-4 space-x-2">
            {!session ? (
              <Button onClick={() => signIn('google')} variant="default">
                Sign in with Google
              </Button>
            ) : (
              <Button onClick={() => signOut()} variant="destructive">
                Sign Out
              </Button>
            )}
            <Button onClick={checkSession} variant="outline">
              Refresh Session
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Debug Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
          <CardDescription>Technical details about the session</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
          
          <div className="mt-4 space-x-2">
            <Button onClick={checkOAuthStatus} disabled={loading} variant="outline">
              Check OAuth Status
            </Button>
            <Button onClick={cleanDuplicates} disabled={loading} variant="destructive">
              Clean Duplicates
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>1. Click "Sign in with Google" to test OAuth authentication</p>
          <p>2. Try logging in with different Google accounts</p>
          <p>3. Check the debug information to see account linking status</p>
          <p>4. Use "Check OAuth Status" to see all Google accounts in the database</p>
          <p>5. Use "Clean Duplicates" if you see duplicate accounts</p>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This page is for testing only. Remove it before deploying to production.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}