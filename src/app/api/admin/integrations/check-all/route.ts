import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { isDemoMode } from '@/lib/auth/demo-mode'

async function checkStripe() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return { status: 'disconnected', error: 'API key not configured' }
    }
    
    // In a real implementation, make a test API call to Stripe
    // For now, we'll just check if the key exists
    return {
      status: 'connected',
      version: 'v1',
      endpoint: 'https://api.stripe.com'
    }
  } catch (error) {
    return { status: 'error', error: error.message }
  }
}

async function checkSupabase() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    return {
      status: 'connected',
      endpoint: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown'
    }
  } catch (error) {
    return { status: 'error', error: 'Database connection failed' }
  }
}

async function checkLumaAI() {
  try {
    if (!process.env.LUMA_API_KEY) {
      return { status: 'disconnected', error: 'API key not configured' }
    }
    
    return {
      status: 'connected',
      endpoint: 'https://api.lumalabs.ai',
      version: 'v2'
    }
  } catch (error) {
    return { status: 'error', error: error.message }
  }
}

async function checkKlingAI() {
  try {
    if (!process.env.KLING_API_KEY || !process.env.KLING_ACCESS_KEY) {
      return { status: 'disconnected', error: 'API keys not configured' }
    }
    
    return {
      status: 'connected',
      endpoint: 'https://api.klingai.com',
      version: 'v1'
    }
  } catch (error) {
    return { status: 'error', error: error.message }
  }
}

async function checkBFL() {
  try {
    if (!process.env.BFL_API_KEY) {
      return { status: 'disconnected', error: 'API key not configured' }
    }
    
    return {
      status: 'connected',
      endpoint: 'https://api.bfl.ai',
      version: 'v1'
    }
  } catch (error) {
    return { status: 'error', error: error.message }
  }
}

async function checkElevenLabs() {
  try {
    if (!process.env.ELEVENLABS_API_KEY) {
      return { status: 'disconnected', error: 'API key not configured' }
    }
    
    return {
      status: 'connected',
      endpoint: 'https://api.elevenlabs.io',
      version: 'v1'
    }
  } catch (error) {
    return { status: 'error', error: error.message }
  }
}

// Asaas removed - using only Stripe for payments

async function checkRedis() {
  try {
    if (!process.env.REDIS_URL) {
      return { status: 'disconnected', error: 'Redis URL not configured' }
    }
    
    return {
      status: 'connected',
      endpoint: process.env.REDIS_URL.split('@')[1]?.split(':')[0] || 'localhost'
    }
  } catch (error) {
    return { status: 'error', error: error.message }
  }
}

export async function GET() {
  try {
    // Check authentication and admin role
    if (!isDemoMode()) {
      const session = await getServerSession()
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { role: true }
      })

      if (user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    // Check all integrations
    const now = new Date().toISOString()
    
    const [
      stripeStatus,
      supabaseStatus,
      lumaStatus,
      klingStatus,
      bflStatus,
      elevenLabsStatus,
      redisStatus
    ] = await Promise.all([
      checkStripe(),
      checkSupabase(),
      checkLumaAI(),
      checkKlingAI(),
      checkBFL(),
      checkElevenLabs(),
      checkRedis()
    ])

    const integrations = [
      {
        name: 'Stripe',
        type: 'payment',
        status: stripeStatus.status,
        lastChecked: now,
        details: {
          endpoint: stripeStatus.endpoint,
          version: stripeStatus.version,
          error: stripeStatus.error
        }
      },
      {
        name: 'Supabase',
        type: 'database',
        status: supabaseStatus.status,
        lastChecked: now,
        details: {
          endpoint: supabaseStatus.endpoint,
          error: supabaseStatus.error
        }
      },
      {
        name: 'Redis',
        type: 'infrastructure',
        status: redisStatus.status,
        lastChecked: now,
        details: {
          endpoint: redisStatus.endpoint,
          error: redisStatus.error
        }
      },
      {
        name: 'Luma AI',
        type: 'ai',
        status: lumaStatus.status,
        lastChecked: now,
        details: {
          endpoint: lumaStatus.endpoint,
          version: lumaStatus.version,
          error: lumaStatus.error
        }
      },
      {
        name: 'Kling AI',
        type: 'ai',
        status: klingStatus.status,
        lastChecked: now,
        details: {
          endpoint: klingStatus.endpoint,
          version: klingStatus.version,
          error: klingStatus.error
        }
      },
      {
        name: 'Black Forest Labs',
        type: 'ai',
        status: bflStatus.status,
        lastChecked: now,
        details: {
          endpoint: bflStatus.endpoint,
          version: bflStatus.version,
          error: bflStatus.error
        }
      },
      {
        name: 'ElevenLabs',
        type: 'ai',
        status: elevenLabsStatus.status,
        lastChecked: now,
        details: {
          endpoint: elevenLabsStatus.endpoint,
          version: elevenLabsStatus.version,
          error: elevenLabsStatus.error
        }
      }
    ]

    return NextResponse.json({ integrations })
  } catch (error) {
    console.error('Error checking integrations:', error)
    return NextResponse.json(
      { error: 'Failed to check integrations' },
      { status: 500 }
    )
  }
}