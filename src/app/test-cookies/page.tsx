'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestCookiesPage() {
  const [cookieData, setCookieData] = useState<any>(null)
  const [oauthData, setOauthData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [createResult, setCreateResult] = useState<any>(null)

  const checkCookies = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test/cookies')
      const data = await response.json()
      setCookieData(data)
    } catch (error) {
      console.error('Error checking cookies:', error)
    }
    setLoading(false)
  }

  const createCookies = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test/cookies', { method: 'POST' })
      const data = await response.json()
      setCreateResult(data)
      // Check cookies again after creating
      setTimeout(checkCookies, 1000)
    } catch (error) {
      console.error('Error creating cookies:', error)
    }
    setLoading(false)
  }

  const checkOAuth = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test/oauth-debug')
      const data = await response.json()
      setOauthData(data)
    } catch (error) {
      console.error('Error checking OAuth:', error)
    }
    setLoading(false)
  }

  // Check client-side cookies
  const getClientCookies = () => {
    return document.cookie || 'No cookies found'
  }

  useEffect(() => {
    checkCookies()
    checkOAuth()
  }, [])

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Cookie & OAuth Debug Page</h1>
      
      {/* Cookie Test Section */}
      <Card>
        <CardHeader>
          <CardTitle>Cookie Test</CardTitle>
          <CardDescription>Test cookie creation and retrieval</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={checkCookies} disabled={loading}>
              Check Cookies
            </Button>
            <Button onClick={createCookies} disabled={loading} variant="secondary">
              Create Test Cookies
            </Button>
          </div>
          
          {createResult && (
            <div className="bg-green-50 p-4 rounded">
              <h3 className="font-semibold">Cookies Created:</h3>
              <pre className="text-sm mt-2">{JSON.stringify(createResult, null, 2)}</pre>
            </div>
          )}
          
          {cookieData && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Server-Side Cookies:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(cookieData, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold">Client-Side Cookies (document.cookie):</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {getClientCookies()}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* OAuth Debug Section */}
      <Card>
        <CardHeader>
          <CardTitle>OAuth Configuration</CardTitle>
          <CardDescription>Check OAuth setup and environment variables</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={checkOAuth} disabled={loading}>
            Check OAuth Config
          </Button>
          
          {oauthData && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Environment:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(oauthData.environment, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold">Expected URLs:</h3>
                <pre className="bg-blue-50 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(oauthData.expectedUrls, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold">Issues:</h3>
                <pre className="bg-red-50 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(oauthData.issues, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-semibold">Request Info:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(oauthData.requestInfo, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>1. Click "Create Test Cookies" to set various types of cookies</p>
          <p>2. Click "Check Cookies" to see what cookies are visible server-side</p>
          <p>3. Compare server-side vs client-side cookies</p>
          <p>4. Check OAuth Config to see environment variables and potential issues</p>
          <p className="text-sm text-gray-600 mt-4">
            Note: httpOnly cookies won't appear in document.cookie (client-side)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}