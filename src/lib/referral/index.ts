import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const REFERRAL_COOKIE_NAME = 'ref'
const REFERRAL_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 // 30 days
export const REFERRAL_COMMISSION_PERCENTAGE = 5.0 // 5% lifetime commission

export class ReferralManager {
  /**
   * Generate referral link for a user
   */
  static generateReferralLink(referralCode: string, baseUrl?: string): string {
    const base = baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://kylo.video'
    return `${base}?ref=${referralCode}`
  }

  /**
   * Set referral cookie when user visits with ref parameter
   */
  static async setReferralCookie(referralCode: string) {
    const cookieStore = cookies()
    
    // Verify referral code exists
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
      select: { id: true }
    })

    if (!referrer) {
      return false
    }

    cookieStore.set(REFERRAL_COOKIE_NAME, referralCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REFERRAL_COOKIE_MAX_AGE,
      path: '/'
    })

    return true
  }

  /**
   * Get referral code from cookie
   */
  static getReferralFromCookie(): string | null {
    const cookieStore = cookies()
    return cookieStore.get(REFERRAL_COOKIE_NAME)?.value || null
  }

  /**
   * Clear referral cookie
   */
  static clearReferralCookie() {
    const cookieStore = cookies()
    cookieStore.set(REFERRAL_COOKIE_NAME, '', {
      maxAge: 0,
      path: '/'
    })
  }

  /**
   * Link new user to referrer
   */
  static async linkReferral(newUserId: string, referralCode: string): Promise<boolean> {
    try {
      // Find referrer
      const referrer = await prisma.user.findUnique({
        where: { referralCode },
        select: { id: true }
      })

      if (!referrer || referrer.id === newUserId) {
        return false
      }

      // Update new user with referrer
      await prisma.user.update({
        where: { id: newUserId },
        data: { referredById: referrer.id }
      })

      // Update referrer stats
      await prisma.referralStats.upsert({
        where: { userId: referrer.id },
        create: {
          userId: referrer.id,
          totalReferrals: 1
        },
        update: {
          totalReferrals: { increment: 1 }
        }
      })

      return true
    } catch (error) {
      console.error('Error linking referral:', error)
      return false
    }
  }

  /**
   * Calculate commission for a transaction
   */
  static calculateCommission(amount: number, percentage: number = REFERRAL_COMMISSION_PERCENTAGE): number {
    return Math.floor(amount * (percentage / 100))
  }

  /**
   * Create referral earning record
   */
  static async createEarning(
    transactionId: string,
    referrerId: string,
    referredUserId: string,
    amount: number
  ): Promise<void> {
    const commission = this.calculateCommission(amount)

    if (commission <= 0) return

    try {
      // Create earning record
      await prisma.referralEarning.create({
        data: {
          userId: referrerId,
          referredUserId,
          transactionId,
          amount: commission,
          percentage: REFERRAL_COMMISSION_PERCENTAGE,
          status: 'PENDING'
        }
      })

      // Update stats
      await prisma.referralStats.upsert({
        where: { userId: referrerId },
        create: {
          userId: referrerId,
          totalEarnings: commission,
          pendingEarnings: commission
        },
        update: {
          totalEarnings: { increment: commission },
          pendingEarnings: { increment: commission },
          lastCalculatedAt: new Date()
        }
      })
    } catch (error) {
      console.error('Error creating referral earning:', error)
    }
  }

  /**
   * Get user's referral stats
   */
  static async getUserStats(userId: string) {
    const stats = await prisma.referralStats.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            referralCode: true,
            referrals: {
              select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                subscription: {
                  select: {
                    status: true,
                    planId: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!stats) {
      return {
        totalReferrals: 0,
        activeReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        paidEarnings: 0,
        referralCode: null,
        referrals: []
      }
    }

    return {
      ...stats,
      referralCode: stats.user.referralCode,
      referrals: stats.user.referrals
    }
  }

  /**
   * Get earnings history for a user
   */
  static async getEarningsHistory(userId: string, limit = 50) {
    return prisma.referralEarning.findMany({
      where: { userId },
      include: {
        referredUser: {
          select: {
            id: true,
            email: true,
            name: true
          }
        },
        transaction: {
          select: {
            amount: true,
            createdAt: true,
            type: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }

  /**
   * Get payouts history for a user
   */
  static async getPayoutsHistory(userId: string) {
    return prisma.referralPayout.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  }
}