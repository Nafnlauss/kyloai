import { LumaProvider } from './luma'
import { KlingProvider } from './kling'
import { VideoProvider } from './types'

export function getVideoProvider(provider: 'LUMA' | 'KLING'): VideoProvider {
  switch (provider) {
    case 'LUMA':
      if (!process.env.LUMA_API_KEY) {
        throw new Error('LUMA_API_KEY not configured')
      }
      return new LumaProvider(process.env.LUMA_API_KEY)
      
    case 'KLING':
      if (!process.env.KLING_API_KEY || !process.env.KLING_SECRET_KEY) {
        throw new Error('KLING_API_KEY or KLING_SECRET_KEY not configured')
      }
      return new KlingProvider(
        process.env.KLING_API_KEY,
        process.env.KLING_SECRET_KEY
      )
      
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

export * from './types'
export { LumaProvider } from './luma'
export { KlingProvider } from './kling'