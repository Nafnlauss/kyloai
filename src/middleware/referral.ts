import { NextRequest, NextResponse } from 'next/server'
import { ReferralManager } from '@/lib/referral'

export async function handleReferral(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const referralCode = searchParams.get('ref')

  if (referralCode) {
    try {
      // Set referral cookie
      const response = NextResponse.next()
      
      // Verify referral code exists (we'll do this on server-side)
      response.cookies.set('ref', referralCode, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: '/'
      })

      // Remove ref param from URL to clean it up
      const url = new URL(request.url)
      url.searchParams.delete('ref')
      
      return NextResponse.redirect(url, {
        headers: response.headers
      })
    } catch (error) {
      console.error('Error handling referral:', error)
    }
  }

  return NextResponse.next()
}