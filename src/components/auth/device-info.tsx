'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, AlertCircle } from 'lucide-react'

interface DeviceData {
  fingerprint: string
  accountsCreated: number
  lastAttempt: string
  firstSeen: string
}

export function DeviceInfo() {
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check localStorage for device data
    const storageKey = 'device_account_data'
    const data = localStorage.getItem(storageKey)
    
    if (data) {
      try {
        const parsed = JSON.parse(data)
        setDeviceData(parsed)
        setIsVisible(true)
      } catch (error) {
        console.error('Error parsing device data:', error)
      }
    }
  }, [])

  if (!isVisible || !deviceData) {
    return null
  }

  const maxAccounts = 1
  const remainingAccounts = Math.max(0, maxAccounts - deviceData.accountsCreated)

  return (
    <Card className="mt-4 border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Device Protection Active
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {remainingAccounts > 0 ? (
              <>
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span>
                  You can create <strong>{remainingAccounts}</strong> more account{remainingAccounts === 1 ? '' : 's'} from this device.
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-600">
                  Account limit reached for this device. Please use your existing account.
                </span>
              </>
            )}
          </div>
          
          {deviceData.accountsCreated > 0 && (
            <p className="text-xs text-muted-foreground">
              Accounts created: {deviceData.accountsCreated} | 
              Device first seen: {new Date(deviceData.firstSeen).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}