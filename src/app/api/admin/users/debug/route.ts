import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Simple query to test database connection
    const userCount = await prisma.user.count()
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      },
      take: 10
    })
    
    return NextResponse.json({
      success: true,
      totalUsers: userCount,
      sampleUsers: users,
      databaseConnected: true
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      databaseConnected: false
    })
  }
}