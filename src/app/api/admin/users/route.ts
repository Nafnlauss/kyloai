import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth/get-session'
import { prisma } from '@/lib/prisma'
import { isDemoMode } from '@/lib/auth/demo-mode'
import { adminGuardAPI } from '@/lib/auth/admin-guard'

export async function GET(req: NextRequest) {
  try {
    // Check authentication and admin/moderator role
    if (!isDemoMode()) {
      const guardResult = await adminGuardAPI(req, ['ADMIN', 'MODERATOR'])
      if (!guardResult.authorized) {
        return guardResult.response!
      }
    }

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('q') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const offset = (page - 1) * limit

    // Build where clause
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}

    // Get users and total count
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          role: true,
          credits: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true,
          subscription: {
            select: {
              plan: true,
              status: true
            }
          },
          _count: {
            select: {
              videos: true
            }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip: offset,
        take: limit
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        credits: user.credits,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        plan: user.subscription?.plan || 'FREE',
        subscriptionStatus: user.subscription?.status || 'INACTIVE',
        videoCount: user._count.videos
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}