import { prisma } from '@/lib/prisma'
import { CreditManager } from './credit-manager'

export class SubscriptionManager {
  /**
   * Handle subscription renewal - for monthly plans
   * This replaces credits instead of adding to them
   */
  static async handleMonthlyRenewal(userId: string, subscriptionId: string) {
    return await prisma.$transaction(async (tx) => {
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

      // Only process monthly subscriptions
      if (user.subscription.interval !== 'MONTHLY') {
        return
      }

      const currentCredits = user.credits
      const newCredits = user.subscription.plan.monthlyCredits

      // For monthly plans, we REPLACE credits, not add
      // But we need to track what happened to the old credits
      if (currentCredits > 0) {
        // Log the loss of previous credits
        await tx.creditHistory.create({
          data: {
            userId,
            subscriptionId,
            amount: -currentCredits,
            type: 'EXPIRED',
            description: `${currentCredits} unused credits lost on monthly renewal`,
            balance: 0
          }
        })
      }

      // Set new credits (not increment)
      await tx.user.update({
        where: { id: userId },
        data: { 
          credits: newCredits,
          creditsLastReset: new Date()
        }
      })

      // Log the new credits
      await tx.creditHistory.create({
        data: {
          userId,
          subscriptionId,
          amount: newCredits,
          type: 'GRANTED',
          description: `Monthly plan renewed - ${newCredits} credits granted`,
          balance: newCredits
        }
      })

      return newCredits
    })
  }

  /**
   * Check if user can purchase credit packs
   * Users without active subscription cannot buy credit packs
   */
  static async canPurchaseCredits(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true
      }
    })

    if (!user) return false

    // Must have active subscription to buy credit packs
    return user.subscription?.status === 'ACTIVE'
  }

  /**
   * Handle subscription cancellation
   * Credits remain but user loses ability to buy more
   */
  static async handleSubscriptionCancellation(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true
      }
    })

    if (!user || !user.subscription) {
      throw new Error('User or subscription not found')
    }

    // Just mark as cancelled, don't remove credits
    await prisma.subscription.update({
      where: { id: user.subscription.id },
      data: {
        status: 'CANCELLED',
        canceledAt: new Date()
      }
    })

    // Log the cancellation
    await prisma.creditHistory.create({
      data: {
        userId,
        subscriptionId: user.subscription.id,
        amount: 0,
        type: 'BONUS', // Using BONUS type for status changes
        description: `Subscription cancelled - ${user.credits} credits remain in account`,
        balance: user.credits,
        metadata: JSON.stringify({ event: 'subscription_cancelled' })
      }
    })
  }

  /**
   * Get subscription status and capabilities
   */
  static async getSubscriptionStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: {
          include: { plan: true }
        }
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const hasActiveSubscription = user.subscription?.status === 'ACTIVE'

    return {
      credits: user.credits,
      hasActiveSubscription,
      canPurchaseCredits: hasActiveSubscription,
      canGenerateVideos: user.credits > 0,
      subscription: user.subscription ? {
        plan: user.subscription.plan.displayName,
        status: user.subscription.status,
        interval: user.subscription.interval,
        expiresAt: user.subscription.currentPeriodEnd,
        isAccumulative: user.subscription.creditsAccumulative
      } : null
    }
  }
}