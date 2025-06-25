/**
 * Subscription pricing constants
 */

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'free',
    displayName: 'Free',
    credits: 300,
    prices: {
      monthly: 0,
      yearly: 0,
    },
  },
  LITE: {
    name: 'lite',
    displayName: 'Lite',
    credits: 1000,
    prices: {
      monthly: 8,
      yearly: 76.80, // $6.40/mês
    },
  },
  CREATOR: {
    name: 'creator',
    displayName: 'Creator',
    credits: 4000,
    prices: {
      monthly: 26,
      yearly: 249.60, // $20.80/mês
    },
  },
  PROFESSIONAL: {
    name: 'professional',
    displayName: 'Professional',
    credits: 12000,
    prices: {
      monthly: 68,
      yearly: 652.80, // $54.40/mês
    },
  },
} as const

/**
 * Credit accumulation rules
 */
export const CREDIT_ACCUMULATION_RULES = {
  MONTHLY: {
    accumulative: false,
    description: 'Credits reset each month to plan amount',
  },
  YEARLY: {
    accumulative: true,
    description: 'Credits accumulate month over month',
  },
} as const

/**
 * Calculate yearly savings percentage
 */
export function calculateYearlySavings(monthlyPrice: number, yearlyPrice: number): number {
  if (monthlyPrice === 0) return 0
  const yearlyMonthlyEquivalent = monthlyPrice * 12
  const savings = yearlyMonthlyEquivalent - yearlyPrice
  return Math.round((savings / yearlyMonthlyEquivalent) * 100)
}

/**
 * Get monthly equivalent price for yearly plans
 */
export function getMonthlyEquivalent(yearlyPrice: number): number {
  return Math.round((yearlyPrice / 12) * 100) / 100
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price)
}