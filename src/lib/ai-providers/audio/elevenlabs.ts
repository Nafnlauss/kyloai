import { AudioProvider, AudioGenerationOptions, AudioGenerationResult, AIProviderError } from '../types'

export class ElevenLabsProvider implements AudioProvider {
  name = 'ElevenLabs'
  version = '1.0'
  apiKey: string
  private baseUrl = 'https://api.elevenlabs.io/v1'

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new AIProviderError('ElevenLabs API key is required', 'ElevenLabs')
    }
    this.apiKey = apiKey
  }

  async generateSpeech(text: string, options?: AudioGenerationOptions): Promise<AudioGenerationResult> {
    try {
      const voiceId = options?.voiceId || 'EXAVITQu4vr4xnSDxMaL' // Default voice (Bella)
      const model = options?.model || 'eleven_multilingual_v2' // Atualizado para modelo multilingual mais recente

      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0,
            use_speaker_boost: true
          }
        })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: { message: 'Unknown error' } }))
        throw new AIProviderError(
          error.detail?.message || `ElevenLabs API error: ${response.status}`,
          'ElevenLabs',
          response.status,
          error
        )
      }

      // ElevenLabs returns audio data directly
      const audioBuffer = await response.arrayBuffer()
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' })
      
      // Create a temporary URL for the audio
      // In production, you'd want to upload this to a storage service
      const audioUrl = URL.createObjectURL(audioBlob)

      return {
        id: `el_${Date.now()}`,
        url: audioUrl,
        duration: 0, // Would need to analyze audio to get actual duration
        format: options?.format || 'mp3',
        createdAt: new Date(),
        metadata: {
          voiceId,
          model,
          textLength: text.length
        }
      }
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to generate speech: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'ElevenLabs'
      )
    }
  }

  async getVoices(): Promise<Array<{ id: string; name: string; language: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      })

      if (!response.ok) {
        throw new AIProviderError(
          `Failed to fetch voices: ${response.status}`,
          'ElevenLabs',
          response.status
        )
      }

      const data = await response.json()

      return data.voices.map((voice: any) => ({
        id: voice.voice_id,
        name: voice.name,
        language: voice.labels?.language || 'en'
      }))
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to get voices: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'ElevenLabs'
      )
    }
  }

  // Helper method to get user subscription info
  async getSubscriptionInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/user/subscription`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      })

      if (!response.ok) {
        throw new AIProviderError(
          `Failed to fetch subscription info: ${response.status}`,
          'ElevenLabs',
          response.status
        )
      }

      return await response.json()
    } catch (error) {
      if (error instanceof AIProviderError) {
        throw error
      }
      throw new AIProviderError(
        `Failed to get subscription info: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'ElevenLabs'
      )
    }
  }
}

// Available models for ElevenLabs
export const ELEVENLABS_MODELS = {
  MONOLINGUAL_V1: 'eleven_monolingual_v1',
  MULTILINGUAL_V1: 'eleven_multilingual_v1',
  MULTILINGUAL_V2: 'eleven_multilingual_v2',
  TURBO_V2: 'eleven_turbo_v2'
}

// Popular voice IDs
export const ELEVENLABS_VOICES = {
  RACHEL: '21m00Tcm4TlvDq8ikWAM',
  DREW: '29vD33N1CtxCmqQRPOHJ',
  CLYDE: '2EiwWnXFnvU5JabPnv8n',
  PAUL: '5Q0t7uMcjvnagumLfvZi',
  DOMI: 'AZnzlk1XvdvUeBnXmlld',
  DAVE: 'CYw3kZ02Hs0563khs1Fj',
  FIN: 'D38z5RcWu1voky8WS1ja',
  BELLA: 'EXAVITQu4vr4xnSDxMaL',
  ANTONI: 'ErXwobaYiN019PkySvjV',
  THOMAS: 'GBv7mTt0atIp3Br8iCZE'
}

// Factory function
export function createElevenLabsProvider(): ElevenLabsProvider {
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    throw new AIProviderError('ELEVENLABS_API_KEY environment variable is not set', 'ElevenLabs')
  }
  return new ElevenLabsProvider(apiKey)
}