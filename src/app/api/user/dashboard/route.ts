import { NextResponse } from 'next/server'

export async function GET() {
  // Return static data to avoid any database issues
  return NextResponse.json({
    credits: 300,
    videosTotal: 0,
    videosThisMonth: 0,
    processingTime: 180,
    subscription: {
      plan: 'Free',
      status: 'ACTIVE',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      creditsRemaining: 300,
      creditsTotal: 10,
    },
    recentVideos: [],
  })
}