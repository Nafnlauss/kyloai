import { LumaProvider } from './luma'
import { KlingProvider } from './kling'
import { VideoProvider } from './types'

export function getVideoProvider(provider: 'LUMA_V1' | 'LUMA_V2' | 'KLING_V1' | 'KLING_V2'): VideoProvider {
  switch (provider) {
    case 'LUMA_V1':
      if (!process.env.LUMA_API_KEY) {
        throw new Error('LUMA_API_KEY not configured')
      }
      return new LumaProvider(process.env.LUMA_API_KEY, 'v1')
      
    case 'LUMA_V2':
      if (!process.env.LUMA_API_KEY) {
        throw new Error('LUMA_API_KEY not configured')
      }
      return new LumaProvider(process.env.LUMA_API_KEY, 'v2')
      
    case 'KLING_V1':
      if (!process.env.KLING_API_KEY || !process.env.KLING_SECRET_KEY) {
        throw new Error('KLING_API_KEY or KLING_SECRET_KEY not configured')
      }
      return new KlingProvider(
        process.env.KLING_API_KEY,
        process.env.KLING_SECRET_KEY,
        'v1'
      )
      
    case 'KLING_V2':
      if (!process.env.KLING_API_KEY || !process.env.KLING_SECRET_KEY) {
        throw new Error('KLING_API_KEY or KLING_SECRET_KEY not configured')
      }
      return new KlingProvider(
        process.env.KLING_API_KEY,
        process.env.KLING_SECRET_KEY,
        'v2'
      )
      
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

export * from './types'
export { LumaProvider } from './luma'
export { KlingProvider } from './kling'