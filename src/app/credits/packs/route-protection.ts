// This file demonstrates the route protection logic for credit packs
// In a real implementation, this would be handled by middleware

export function canAccessCreditPacks(userPlan: string | null): boolean {
  // User must be logged in and have a paid plan
  return userPlan !== null && userPlan !== 'Free'
}

export function getRedirectUrl(from: string = '/credits/packs'): string {
  return `/membership?from=${encodeURIComponent(from)}`
}