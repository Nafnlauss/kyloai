// Server-side account limiter - simplified version that works on the server
interface VerificationResult {
  allowed: boolean
  reason?: string
  requireEmailVerification?: boolean
  score: number
}

export class AccountLimiter {
  private readonly suspicionThreshold = 50

  async canCreateAccount(email: string): Promise<VerificationResult> {
    const score = await this.calculateSuspicionScore(email)
    
    return {
      allowed: score < this.suspicionThreshold,
      reason: score >= this.suspicionThreshold ? 'Suspicious activity detected' : undefined,
      requireEmailVerification: true,
      score
    }
  }

  private async calculateSuspicionScore(email: string): Promise<number> {
    let score = 0

    // Check for suspicious email patterns
    if (this.isSuspiciousEmail(email)) {
      score += 30
    }

    // For now, we'll keep it simple on the server
    // In production, you would check against a database of IPs, fingerprints, etc.
    
    return Math.min(score, 100)
  }

  private isSuspiciousEmail(email: string): boolean {
    // Common temporary email domains
    const suspiciousDomains = [
      'tempmail.com',
      '10minutemail.com',
      'guerrillamail.com',
      'mailinator.com',
      'throwaway.email',
      'yopmail.com'
    ]
    
    const domain = email.split('@')[1]?.toLowerCase()
    return suspiciousDomains.some(d => domain?.includes(d))
  }

  async recordAccountCreation(email: string): Promise<void> {
    // In production, record this in the database
    // For now, we'll just log it
    console.log(`Account created for: ${email}`)
  }
}