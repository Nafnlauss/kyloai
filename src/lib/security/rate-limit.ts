import { NextRequest, NextResponse } from 'next/server'
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export type RateLimitConfig = {
  windowMs: number
  max: number
  message?: string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

// Default configurations for different endpoints
export const rateLimitConfigs: Record<string, RateLimitConfig> = {
  // Auth endpoints - strict limits
  '/api/auth/register': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many registration attempts, please try again later',
  },
  '/api/auth/login': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window
    message: 'Too many login attempts, please try again later',
  },
  '/api/auth/reset': {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 requests per hour
    message: 'Too many password reset requests, please try again later',
  },
  
  // Payment endpoints - moderate limits
  '/api/stripe/checkout': {
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute
    message: 'Too many checkout attempts, please slow down',
  },
  '/api/stripe/portal': {
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 requests per minute
  },
  
  // Video generation - resource intensive
  '/api/videos/generate': {
    windowMs: 60 * 1000, // 1 minute
    max: 3, // 3 requests per minute
    message: 'Too many video generation requests, please wait a moment',
  },
  
  // General API endpoints
  '/api': {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute (default)
  },
}

export function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: async (request: NextRequest, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1])
        } else {
          tokenCount[0] += 1
          tokenCache.set(token, tokenCount)
        }
        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage > limit
        
        if (isRateLimited) {
          reject(new Error('Rate limit exceeded'))
        } else {
          resolve()
        }
      }),
  }
}

// Helper function to get client identifier
export function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwardedFor?.split(',')[0] || realIp || 'anonymous'
  
  // For authenticated requests, also consider user ID
  const userId = request.headers.get('x-user-id')
  
  return userId ? `${ip}:${userId}` : ip
}

// Middleware helper for rate limiting
export async function applyRateLimit(
  request: NextRequest,
  config?: RateLimitConfig
): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname
  
  // Find the most specific config for this path
  let appliedConfig = config || rateLimitConfigs['/api']
  
  for (const [path, pathConfig] of Object.entries(rateLimitConfigs)) {
    if (pathname.startsWith(path) && path !== '/api') {
      appliedConfig = pathConfig
      break
    }
  }
  
  const limiter = rateLimit({
    interval: appliedConfig.windowMs,
    uniqueTokenPerInterval: 500,
  })
  
  const identifier = getClientIdentifier(request)
  
  try {
    await limiter.check(request, appliedConfig.max, identifier)
    return null // Continue with request
  } catch {
    return new NextResponse(
      JSON.stringify({
        error: appliedConfig.message || 'Too many requests, please try again later',
        retryAfter: Math.ceil(appliedConfig.windowMs / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(Math.ceil(appliedConfig.windowMs / 1000)),
          'X-RateLimit-Limit': String(appliedConfig.max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(new Date(Date.now() + appliedConfig.windowMs).toISOString()),
        },
      }
    )
  }
}