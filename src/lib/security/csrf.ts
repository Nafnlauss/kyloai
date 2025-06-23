import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

// CSRF token storage (in production, use Redis or database)
const csrfTokens = new Map<string, { token: string; expires: number }>()

// Generate CSRF token
export function generateCSRFToken(): string {
  return randomBytes(32).toString('base64url')
}

// Store CSRF token for a session
export function storeCSRFToken(sessionId: string, token: string): void {
  const expires = Date.now() + 60 * 60 * 1000 // 1 hour
  csrfTokens.set(sessionId, { token, expires })
  
  // Clean up expired tokens
  for (const [key, value] of csrfTokens.entries()) {
    if (value.expires < Date.now()) {
      csrfTokens.delete(key)
    }
  }
}

// Validate CSRF token
export function validateCSRFToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId)
  
  if (!stored || stored.expires < Date.now()) {
    return false
  }
  
  return stored.token === token
}

// Get session ID from request
async function getSessionId(request: NextRequest): Promise<string | null> {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  })
  
  return token?.sub || null
}

// CSRF protection middleware
export async function csrfProtection(request: NextRequest): Promise<NextResponse | null> {
  // Only protect state-changing methods
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    return null
  }
  
  // Skip CSRF for certain paths
  const skipPaths = [
    '/api/auth/', // NextAuth handles its own CSRF
    '/api/stripe/webhook', // Webhooks have their own verification
    '/api/health', // Health check endpoint
  ]
  
  const pathname = request.nextUrl.pathname
  if (skipPaths.some(path => pathname.startsWith(path))) {
    return null
  }
  
  // Get session ID
  const sessionId = await getSessionId(request)
  if (!sessionId) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401 }
    )
  }
  
  // Get CSRF token from header or body
  const headerToken = request.headers.get('X-CSRF-Token')
  const contentType = request.headers.get('content-type')
  
  let bodyToken: string | null = null
  if (contentType?.includes('application/json')) {
    try {
      const body = await request.clone().json()
      bodyToken = body._csrf
    } catch {
      // Invalid JSON body
    }
  }
  
  const csrfToken = headerToken || bodyToken
  
  if (!csrfToken) {
    return new NextResponse(
      JSON.stringify({ error: 'CSRF token missing' }),
      { status: 403 }
    )
  }
  
  // Validate token
  if (!validateCSRFToken(sessionId, csrfToken)) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid CSRF token' }),
      { status: 403 }
    )
  }
  
  return null // Continue with request
}

// Helper to add CSRF token to response
export async function addCSRFToken(request: NextRequest, response: NextResponse): Promise<NextResponse> {
  const sessionId = await getSessionId(request)
  
  if (sessionId) {
    const token = generateCSRFToken()
    storeCSRFToken(sessionId, token)
    
    // Add token to response header
    response.headers.set('X-CSRF-Token', token)
    
    // Also set as a cookie for client-side access
    response.cookies.set('csrf-token', token, {
      httpOnly: false, // Allow JavaScript access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60, // 1 hour
    })
  }
  
  return response
}

// Client-side helper hook
export function useCSRFToken(): string | null {
  if (typeof window === 'undefined') return null
  
  // Try to get from cookie
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'csrf-token') {
      return value
    }
  }
  
  // Try to get from meta tag
  const metaTag = document.querySelector('meta[name="csrf-token"]')
  return metaTag?.getAttribute('content') || null
}