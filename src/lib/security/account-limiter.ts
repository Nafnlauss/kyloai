import FingerprintJS from '@fingerprintjs/fingerprintjs'

interface DeviceData {
  fingerprint: string
  localStorage: boolean
  firstSeen: string
  accountsCreated: number
  lastAttempt: string
}

interface VerificationResult {
  allowed: boolean
  reason?: string
  requireEmailVerification?: boolean
  score: number
}

export class AccountLimiter {
  private readonly storageKey = 'device_account_data'
  private readonly maxFreeAccounts = 1
  private readonly suspicionThreshold = 50

  async canCreateAccount(email: string): Promise<VerificationResult> {
    const score = await this.calculateSuspicionScore(email)
    
    return {
      allowed: score < this.suspicionThreshold,
      reason: score >= this.suspicionThreshold ? 'Multiple accounts detected from this device' : undefined,
      requireEmailVerification: true, // Always require email verification for non-Google accounts
      score
    }
  }

  private async calculateSuspicionScore(email: string): Promise<number> {
    let score = 0

    // 1. Check localStorage/cookies
    const localData = this.checkLocalStorage()
    if (localData && localData.accountsCreated >= this.maxFreeAccounts) {
      score += 40
    }

    // 2. Generate device fingerprint
    const fingerprint = await this.generateFingerprint()
    
    // 3. Check for suspicious email patterns (without blocking legitimate domains)
    if (this.isSuspiciousEmail(email)) {
      score += 15
    }

    // 4. Check browser fingerprint history
    const fingerprintData = await this.checkFingerprintHistory(fingerprint)
    if (fingerprintData && fingerprintData.accountsCreated > 0) {
      score += 30
    }

    // 5. Check for rapid account creation attempts
    if (localData && this.isRapidAttempt(localData.lastAttempt)) {
      score += 20
    }

    // 6. Combine multiple signals for better accuracy
    const deviceProfile = await this.getDeviceProfile()
    if (deviceProfile.suspiciousPatterns) {
      score += 10
    }

    return Math.min(score, 100)
  }

  private checkLocalStorage(): DeviceData | null {
    try {
      const data = localStorage.getItem(this.storageKey)
      if (data) {
        return JSON.parse(data)
      }
    } catch (error) {
      console.error('Error reading localStorage:', error)
    }
    return null
  }

  private async generateFingerprint(): Promise<string> {
    try {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      return result.visitorId
    } catch (error) {
      console.error('Error generating fingerprint:', error)
      // Fallback to basic fingerprint
      return this.generateBasicFingerprint()
    }
  }

  private generateBasicFingerprint(): string {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillText('fingerprint', 2, 2)
    }
    
    const dataURL = canvas.toDataURL()
    const hash = this.simpleHash(dataURL + navigator.userAgent + screen.width + screen.height)
    
    return hash
  }

  private simpleHash(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16)
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

  private async checkFingerprintHistory(fingerprint: string): Promise<DeviceData | null> {
    // In a real implementation, this would check against a backend database
    // For now, we'll use localStorage as a simple implementation
    try {
      const key = `fp_${fingerprint}`
      const data = localStorage.getItem(key)
      if (data) {
        return JSON.parse(data)
      }
    } catch (error) {
      console.error('Error checking fingerprint history:', error)
    }
    return null
  }

  private isRapidAttempt(lastAttempt: string): boolean {
    if (!lastAttempt) return false
    
    const lastTime = new Date(lastAttempt).getTime()
    const now = Date.now()
    const hoursSinceLastAttempt = (now - lastTime) / (1000 * 60 * 60)
    
    // Consider rapid if less than 1 hour since last attempt
    return hoursSinceLastAttempt < 1
  }

  private async getDeviceProfile(): Promise<{ suspiciousPatterns: boolean }> {
    const patterns = {
      // Check for automation tools
      hasWebdriver: navigator.webdriver === true,
      // Check for headless browsers
      hasHeadlessIndicators: this.checkHeadlessIndicators(),
      // Check for unusual screen dimensions
      hasUnusualDimensions: this.checkUnusualDimensions(),
      // Check for missing browser features
      hasMissingFeatures: this.checkMissingFeatures()
    }
    
    const suspiciousPatterns = Object.values(patterns).filter(Boolean).length >= 2
    
    return { suspiciousPatterns }
  }

  private checkHeadlessIndicators(): boolean {
    return (
      !navigator.plugins?.length ||
      navigator.userAgent.includes('HeadlessChrome') ||
      !window.chrome
    )
  }

  private checkUnusualDimensions(): boolean {
    return (
      screen.width === 0 || 
      screen.height === 0 ||
      (screen.width === 800 && screen.height === 600) // Common headless default
    )
  }

  private checkMissingFeatures(): boolean {
    return (
      !window.MediaStreamTrack ||
      !window.RTCPeerConnection ||
      !navigator.mediaDevices
    )
  }

  async recordAccountCreation(email: string, fingerprint?: string): Promise<void> {
    // Update localStorage
    const localData = this.checkLocalStorage() || {
      fingerprint: fingerprint || await this.generateFingerprint(),
      localStorage: true,
      firstSeen: new Date().toISOString(),
      accountsCreated: 0,
      lastAttempt: new Date().toISOString()
    }
    
    localData.accountsCreated += 1
    localData.lastAttempt = new Date().toISOString()
    
    localStorage.setItem(this.storageKey, JSON.stringify(localData))
    
    // Also store by fingerprint
    if (localData.fingerprint) {
      const key = `fp_${localData.fingerprint}`
      localStorage.setItem(key, JSON.stringify(localData))
    }
  }

  clearDeviceData(): void {
    localStorage.removeItem(this.storageKey)
    // Note: We intentionally don't clear fingerprint data
  }
}