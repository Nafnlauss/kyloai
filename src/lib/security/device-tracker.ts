import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import crypto from 'crypto'

interface DeviceInfo {
  fingerprint: string
  accountsCreated: number
  lastAttempt: string
  firstSeen: string
}

export class DeviceTracker {
  private readonly cookieName = 'device_tracker'
  private readonly maxAccounts = 1
  private readonly cookieMaxAge = 60 * 60 * 24 * 365 // 1 year

  async trackDevice(request: NextRequest): Promise<DeviceInfo> {
    const cookieStore = cookies()
    const existingCookie = cookieStore.get(this.cookieName)
    
    let deviceInfo: DeviceInfo
    
    if (existingCookie) {
      try {
        deviceInfo = JSON.parse(
          Buffer.from(existingCookie.value, 'base64').toString()
        )
      } catch {
        deviceInfo = this.createNewDeviceInfo(request)
      }
    } else {
      deviceInfo = this.createNewDeviceInfo(request)
    }
    
    return deviceInfo
  }

  async canCreateAccount(request: NextRequest): Promise<{ allowed: boolean; reason?: string }> {
    const deviceInfo = await this.trackDevice(request)
    
    if (deviceInfo.accountsCreated >= this.maxAccounts) {
      return {
        allowed: false,
        reason: `This device has already created ${deviceInfo.accountsCreated} account(s). Please use your existing account or contact support.`
      }
    }
    
    // Check if rapid attempt
    const lastAttempt = new Date(deviceInfo.lastAttempt)
    const now = new Date()
    const minutesSinceLastAttempt = (now.getTime() - lastAttempt.getTime()) / 1000 / 60
    
    if (minutesSinceLastAttempt < 5) {
      return {
        allowed: false,
        reason: 'Please wait a few minutes before creating another account.'
      }
    }
    
    return { allowed: true }
  }

  async recordAccountCreation(request: NextRequest): Promise<void> {
    const deviceInfo = await this.trackDevice(request)
    
    deviceInfo.accountsCreated += 1
    deviceInfo.lastAttempt = new Date().toISOString()
    
    // Save updated info to cookie
    const cookieValue = Buffer.from(JSON.stringify(deviceInfo)).toString('base64')
    
    cookies().set(this.cookieName, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: this.cookieMaxAge,
      path: '/'
    })
  }

  private createNewDeviceInfo(request: NextRequest): DeviceInfo {
    // Generate fingerprint from request headers
    const headers = request.headers
    const fingerprint = crypto
      .createHash('sha256')
      .update(
        JSON.stringify({
          userAgent: headers.get('user-agent') || '',
          acceptLanguage: headers.get('accept-language') || '',
          acceptEncoding: headers.get('accept-encoding') || '',
          accept: headers.get('accept') || '',
          ip: headers.get('x-forwarded-for') || headers.get('x-real-ip') || ''
        })
      )
      .digest('hex')
      .substring(0, 16)
    
    return {
      fingerprint,
      accountsCreated: 0,
      lastAttempt: new Date().toISOString(),
      firstSeen: new Date().toISOString()
    }
  }

  clearDeviceData(request: NextRequest): void {
    cookies().delete(this.cookieName)
  }
}