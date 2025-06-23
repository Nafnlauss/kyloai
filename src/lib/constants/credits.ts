/**
 * Credit amounts for each subscription plan
 */
export const PLAN_CREDITS = {
  FREE: 300,
  LITE: 1000,
  CREATOR: 4000,
  PROFESSIONAL: 12000,
} as const

/**
 * Credit costs per second for each video provider
 */
export const VIDEO_CREDIT_COSTS = {
  LUMA_V1: 3,    // Luma V1 - PRO (3 credits/sec)
  LUMA_V2: 5,    // Luma V2 - BEST (5 credits/sec)
  KLING_V1: 5,   // Kling V1 - PRO (5 credits/sec)
  KLING_V2: 10,  // Kling V2.1 - BEST (10 credits/sec)
} as const

/**
 * Default video duration in seconds
 */
export const DEFAULT_VIDEO_DURATION = 5

/**
 * Calculate credits needed for a video
 */
export function calculateVideoCredits(
  provider: keyof typeof VIDEO_CREDIT_COSTS,
  durationSeconds: number = DEFAULT_VIDEO_DURATION
): number {
  return VIDEO_CREDIT_COSTS[provider] * durationSeconds
}

/**
 * Credit pack options for purchase (only available for subscribers)
 */
export const CREDIT_PACKS = [
  { credits: 1000, price: 8, stripePriceId: 'price_1RcK7CRuScAuCzn2N1NJhAdA' },
  { credits: 2500, price: 18, stripePriceId: 'price_1RcK7YRuScAuCzn27Gpx7QWl' },
  { credits: 7000, price: 45, stripePriceId: 'price_1RcK7qRuScAuCzn2u8bgZWxv' },
  { credits: 16000, price: 90, stripePriceId: 'price_1RcK86RuScAuCzn2o4Zt0ipI' },
] as const