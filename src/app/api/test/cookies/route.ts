import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  // Check if device tracker cookie exists
  const cookieStore = cookies()
  const deviceCookie = cookieStore.get('device_tracker')
  
  // Get all cookies
  const allCookies = cookieStore.getAll()
  
  // Get request headers for debugging
  const headers = Object.fromEntries(request.headers.entries())
  
  // Check if cookies are being sent from browser
  const cookieHeader = request.headers.get('cookie')
  
  return NextResponse.json({
    deviceTrackerCookie: deviceCookie ? {
      exists: true,
      value: deviceCookie.value,
      decoded: (() => {
        try {
          return JSON.parse(Buffer.from(deviceCookie.value, 'base64').toString())
        } catch {
          return 'Could not decode'
        }
      })()
    } : {
      exists: false,
      message: 'Device tracker cookie not found'
    },
    allCookies: allCookies.map(c => ({
      name: c.name,
      hasValue: !!c.value,
      value: c.value?.substring(0, 20) + '...' // Show first 20 chars
    })),
    browserCookieHeader: cookieHeader || 'No cookie header sent',
    environment: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'NOT SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT SET',
      isProduction: process.env.NODE_ENV === 'production'
    },
    requestInfo: {
      url: request.url,
      host: headers.host || 'NO HOST',
      origin: headers.origin || 'NO ORIGIN',
      referer: headers.referer || 'NO REFERER'
    }
  })
}

export async function POST(request: NextRequest) {
  const timestamp = Date.now()
  
  // Test creating multiple cookies with different configurations
  const cookieConfigs = [
    {
      name: 'test_cookie_httponly',
      value: `httponly_${timestamp}`,
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 60 * 60, // 1 hour
        path: '/'
      }
    },
    {
      name: 'test_cookie_client',
      value: `client_${timestamp}`,
      options: {
        httpOnly: false, // Accessible from JavaScript
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 60 * 60, // 1 hour
        path: '/'
      }
    },
    {
      name: 'device_tracker',
      value: Buffer.from(JSON.stringify({
        deviceId: `test_${timestamp}`,
        accounts: [],
        createdAt: new Date().toISOString()
      })).toString('base64'),
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict' as const,
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/'
      }
    }
  ]
  
  // Set all cookies
  cookieConfigs.forEach(({ name, value, options }) => {
    cookies().set(name, value, options)
  })
  
  return NextResponse.json({
    message: 'Test cookies created',
    cookies: cookieConfigs.map(c => ({ name: c.name, value: c.value })),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      isProduction: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production'
    },
    check: 'Access GET endpoint to verify cookies were set'
  })
}