import { prisma } from '@/lib/prisma'
import { CreditTransactionType } from '@prisma/client'

export class CreditManager {
  /**
   * Grant credits to a user when subscription is created/renewed
   */
  static async grantSubscriptionCredits(
    userId: string, 
    subscriptionId: string,
    amount: number,
    isAccumulative: boolean,
    description?: string
  ) {
    return await prisma.$transaction(async (tx) => {
      // Get current balance
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { credits: true }
      })

      if (!user) {
        throw new Error('User not found')
      }

      const newBalance = user.credits + amount

      // Update user credits
      await tx.user.update({
        where: { id: userId },
        data: { 
          credits: newBalance,
          creditsLastReset: new Date() // Reset the timer for monthly plans
        }
      })

      // Update subscription
      await tx.subscription.update({
        where: { id: subscriptionId },
        data: {
          totalCreditsGranted: { increment: amount },
          creditsGrantedAt: new Date(),
          creditsAccumulative: isAccumulative
        }
      })

      // Create history record
      await tx.creditHistory.create({
        data: {
          userId,
          subscriptionId,
          amount,
          type: CreditTransactionType.GRANTED,
          description: description || `Credits granted from subscription`,
          balance: newBalance
        }
      })

      return newBalance
    })
  }

  /**
   * Use credits for video generation
   */
  static async useCredits(
    userId: string,
    amount: number,
    videoId: string,
    description?: string
  ) {
    return await prisma.$transaction(async (tx) => {
      // Get current balance
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { credits: true }
      })

      if (!user) {
        throw new Error('User not found')
      }

      if (user.credits < amount) {
        throw new Error('Insufficient credits')
      }

      const newBalance = user.credits - amount

      // Update user credits
      await tx.user.update({
        where: { id: userId },
        data: { credits: newBalance }
      })

      // Create history record
      await tx.creditHistory.create({
        data: {
          userId,
          videoId,
          amount: -amount, // Negative for used credits
          type: CreditTransactionType.USED,
          description: description || `Credits used for video generation`,
          balance: newBalance
        }
      })

      return newBalance
    })
  }

  /**
   * Purchase credits (one-time)
   */
  static async purchaseCredits(
    userId: string,
    amount: number,
    transactionId?: string,
    description?: string
  ) {
    return await prisma.$transaction(async (tx) => {
      // Get current balance
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { credits: true }
      })

      if (!user) {
        throw new Error('User not found')
      }

      const newBalance = user.credits + amount

      // Update user credits
      await tx.user.update({
        where: { id: userId },
        data: { credits: newBalance }
      })

      // Create history record
      await tx.creditHistory.create({
        data: {
          userId,
          amount,
          type: CreditTransactionType.PURCHASED,
          description: description || `${amount} credits purchased`,
          balance: newBalance,
          metadata: transactionId ? JSON.stringify({ transactionId }) : undefined
        }
      })

      return newBalance
    })
  }

  /**
   * Expire credits for non-accumulative (monthly) plans
   */
  static async expireMonthlyCredits(userId: string, subscriptionId: string) {
    return await prisma.$transaction(async (tx) => {
      // Get user and subscription
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: {
          subscription: {
            include: { plan: true }
          }
        }
      })

      if (!user || !user.subscription) {
        throw new Error('User or subscription not found')
      }

      // Only expire if not accumulative
      if (user.subscription.creditsAccumulative) {
        return user.credits // No expiration for yearly plans
      }

      const expiredAmount = user.credits
      
      // Reset credits to 0
      await tx.user.update({
        where: { id: userId },
        data: { 
          credits: 0,
          creditsLastReset: new Date()
        }
      })

      // Create history record if credits were expired
      if (expiredAmount > 0) {
        await tx.creditHistory.create({
          data: {
            userId,
            subscriptionId,
            amount: -expiredAmount,
            type: CreditTransactionType.EXPIRED,
            description: `${expiredAmount} credits expired (monthly plan)`,
            balance: 0
          }
        })
      }

      return 0
    })
  }

  /**
   * Get credit history for a user
   */
  static async getCreditHistory(
    userId: string,
    limit = 50,
    offset = 0
  ) {
    return await prisma.creditHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        video: {
          select: {
            id: true,
            prompt: true
          }
        },
        subscription: {
          select: {
            id: true,
            plan: {
              select: {
                displayName: true
              }
            }
          }
        }
      }
    })
  }

  /**
   * Get credit balance and usage stats
   */
  static async getCreditStats(userId: string) {
    const [user, usage, granted] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { 
          credits: true,
          creditsLastReset: true,
          subscription: {
            select: {
              creditsAccumulative: true,
              plan: {
                select: {
                  monthlyCredits: true
                }
              }
            }
          }
        }
      }),
      
      // Total credits used
      prisma.creditHistory.aggregate({
        where: {
          userId,
          type: CreditTransactionType.USED
        },
        _sum: {
          amount: true
        }
      }),

      // Total credits granted
      prisma.creditHistory.aggregate({
        where: {
          userId,
          type: CreditTransactionType.GRANTED
        },
        _sum: {
          amount: true
        }
      })
    ])

    if (!user) {
      throw new Error('User not found')
    }

    return {
      balance: user.credits,
      totalUsed: Math.abs(usage._sum.amount || 0),
      totalGranted: granted._sum.amount || 0,
      isAccumulative: user.subscription?.creditsAccumulative || false,
      monthlyAllocation: user.subscription?.plan.monthlyCredits || 0,
      lastReset: user.creditsLastReset
    }
  }
}