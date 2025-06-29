import { LumaProvider } from './luma'
import { KlingProvider } from './kling'
import { KlingProviderV2, KlingAPIType } from './kling-v2'
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
    case 'KLING_V2':
      // Determinar qual tipo de API usar baseado nas variáveis de ambiente
      const apiType: KlingAPIType = process.env.KLING_API_TYPE as KlingAPIType || 'piapi'
      
      if (apiType === 'official') {
        // API oficial requer Access Key e Secret Key
        if (!process.env.KLING_ACCESS_KEY || !process.env.KLING_SECRET_KEY) {
          throw new Error('KLING_ACCESS_KEY or KLING_SECRET_KEY not configured for official API')
        }
        return new KlingProviderV2(
          'official',
          {
            accessKey: process.env.KLING_ACCESS_KEY,
            secretKey: process.env.KLING_SECRET_KEY,
          },
          provider === 'KLING_V1' ? 'v1' : 'v2'
        )
      } else {
        // PiAPI ou outras APIs não-oficiais usam API Key simples
        if (!process.env.KLING_API_KEY) {
          throw new Error('KLING_API_KEY not configured')
        }
        return new KlingProviderV2(
          apiType,
          {
            apiKey: process.env.KLING_API_KEY,
          },
          provider === 'KLING_V1' ? 'v1' : 'v2'
        )
      }
      
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}

export * from './types'
export { LumaProvider } from './luma'
export { KlingProvider } from './kling'
export { KlingProviderV2, KlingAPIType } from './kling-v2'