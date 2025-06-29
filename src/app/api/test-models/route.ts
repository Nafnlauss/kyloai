import { NextResponse } from 'next/server'
import { ALL_MODELS, getModelsByMediaType, getModelsByProvider } from '@/config/all-models-config'

export async function GET() {
  try {
    // Obter todos os modelos
    const allProviders = Object.keys(ALL_MODELS)
    const videoModels = getModelsByMediaType('video')
    const imageModels = getModelsByMediaType('image')
    const audioModels = getModelsByMediaType('audio')
    
    // Obter providers únicos para vídeo
    const videoProviders = Array.from(
      new Set(videoModels.map(m => m.provider))
    ).sort()
    
    // Testar obter modelos por provider
    const lumaModels = getModelsByProvider('luma')
    
    return NextResponse.json({
      success: true,
      data: {
        allProviders,
        counts: {
          video: videoModels.length,
          image: imageModels.length,
          audio: audioModels.length,
          total: videoModels.length + imageModels.length + audioModels.length
        },
        videoProviders,
        sampleModels: {
          luma: lumaModels,
          firstVideo: videoModels[0],
          firstImage: imageModels[0],
          firstAudio: audioModels[0]
        }
      }
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}