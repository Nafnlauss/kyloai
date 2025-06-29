# Código de Implementação Completo - Sistema de Créditos e APIs

## 1. Configuração Base do Sistema de Créditos

### Esquema Prisma Atualizado
```prisma
// prisma/schema.prisma - Adicionar aos modelos existentes

model CreditPackage {
  id          String   @id @default(cuid())
  name        String
  credits     Int
  price       Decimal  @db.Decimal(10, 2)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  transactions Transaction[]
  
  @@index([isActive])
}

model CreditUsage {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  credits     Int
  type        String   // video_generation, image_generation, tts_generation
  provider    String   // luma, kling, bfl, elevenlabs
  metadata    Json?    // Detalhes específicos da geração
  createdAt   DateTime @default(now())
  
  @@index([userId, createdAt])
  @@index([type, provider])
}

model GenerationLog {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  type        String   // video, image, audio
  provider    String
  status      String   // pending, processing, completed, failed
  apiCost     Decimal  @db.Decimal(10, 4)
  creditsCost Int
  input       Json
  output      Json?
  error       String?
  startedAt   DateTime @default(now())
  completedAt DateTime?
  
  @@index([userId, type])
  @@index([status])
}
```

### Sistema Central de Créditos
```typescript
// src/lib/credits/credit-system.ts

import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime';

export class CreditSystem {
  // Tabela de conversão: 1 crédito = $0,01
  private static readonly CREDIT_VALUE = 0.01;
  
  // Custos base por serviço
  private static readonly COSTS = {
    // Vídeo - Luma
    LUMA_VIDEO_5S: 60,
    LUMA_VIDEO_10S: 160,
    LUMA_VIDEO_EXTEND: 64,
    LUMA_IMAGE_TO_VIDEO: 70,
    
    // Vídeo - Kling
    KLING_VIDEO_5S_STANDARD: 28,
    KLING_VIDEO_10S_STANDARD: 56,
    KLING_VIDEO_5S_PRO: 70,
    KLING_VIDEO_10S_PRO: 140,
    
    // Imagem - BFL
    BFL_FLUX_SCHNELL: 2,
    BFL_FLUX_DEV: 5,
    BFL_FLUX_PRO_1_1: 8,
    BFL_FLUX_PRO_1_0: 10,
    
    // Áudio - ElevenLabs (por 1000 caracteres)
    ELEVENLABS_MULTILINGUAL: 36,
    ELEVENLABS_TURBO: 18,
    ELEVENLABS_FLASH: 18,
    
    // Processamentos adicionais
    LIP_SYNC_PROCESSING: 10,
    VIDEO_ENHANCEMENT: 20,
    AUDIO_ENHANCEMENT: 5,
  };

  /**
   * Verifica se o usuário tem créditos suficientes
   */
  static async hasCredits(userId: string, required: number): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });
    
    return user ? user.credits >= required : false;
  }

  /**
   * Deduz créditos do usuário
   */
  static async deductCredits(
    userId: string, 
    amount: number, 
    metadata: {
      type: string;
      provider: string;
      details?: any;
    }
  ): Promise<boolean> {
    try {
      // Transação para garantir consistência
      const result = await prisma.$transaction(async (tx) => {
        // Verificar créditos novamente dentro da transação
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { credits: true },
        });

        if (!user || user.credits < amount) {
          throw new Error('Créditos insuficientes');
        }

        // Deduzir créditos
        await tx.user.update({
          where: { id: userId },
          data: { credits: { decrement: amount } },
        });

        // Registrar uso
        await tx.creditUsage.create({
          data: {
            userId,
            credits: amount,
            type: metadata.type,
            provider: metadata.provider,
            metadata: metadata.details,
          },
        });

        return true;
      });

      return result;
    } catch (error) {
      console.error('Erro ao deduzir créditos:', error);
      return false;
    }
  }

  /**
   * Calcula custo em créditos para geração de vídeo
   */
  static calculateVideoCost(
    provider: 'luma' | 'kling',
    duration: number,
    options?: {
      quality?: 'standard' | 'pro';
      type?: 'text-to-video' | 'image-to-video' | 'extend';
    }
  ): number {
    if (provider === 'luma') {
      if (options?.type === 'extend') return this.COSTS.LUMA_VIDEO_EXTEND;
      if (options?.type === 'image-to-video') return this.COSTS.LUMA_IMAGE_TO_VIDEO;
      return duration <= 5 ? this.COSTS.LUMA_VIDEO_5S : this.COSTS.LUMA_VIDEO_10S;
    }
    
    if (provider === 'kling') {
      const isPro = options?.quality === 'pro';
      if (duration <= 5) {
        return isPro ? this.COSTS.KLING_VIDEO_5S_PRO : this.COSTS.KLING_VIDEO_5S_STANDARD;
      }
      return isPro ? this.COSTS.KLING_VIDEO_10S_PRO : this.COSTS.KLING_VIDEO_10S_STANDARD;
    }
    
    throw new Error(`Provider não suportado: ${provider}`);
  }

  /**
   * Calcula custo em créditos para geração de imagem
   */
  static calculateImageCost(model: string): number {
    const modelCosts: Record<string, number> = {
      'flux-schnell': this.COSTS.BFL_FLUX_SCHNELL,
      'flux-dev': this.COSTS.BFL_FLUX_DEV,
      'flux1.1-pro': this.COSTS.BFL_FLUX_PRO_1_1,
      'flux1.0-pro': this.COSTS.BFL_FLUX_PRO_1_0,
    };
    
    return modelCosts[model] || this.COSTS.BFL_FLUX_PRO_1_1;
  }

  /**
   * Calcula custo em créditos para TTS
   */
  static calculateTTSCost(text: string, model: string): number {
    const charCount = text.length;
    const blocks = Math.ceil(charCount / 1000);
    
    const modelCosts: Record<string, number> = {
      'eleven_multilingual_v2': this.COSTS.ELEVENLABS_MULTILINGUAL,
      'eleven_turbo_v2_5': this.COSTS.ELEVENLABS_TURBO,
      'eleven_flash_v2_5': this.COSTS.ELEVENLABS_FLASH,
    };
    
    const costPerBlock = modelCosts[model] || this.COSTS.ELEVENLABS_MULTILINGUAL;
    return blocks * costPerBlock;
  }

  /**
   * Registra uma geração no log
   */
  static async logGeneration(data: {
    userId: string;
    type: string;
    provider: string;
    status: string;
    apiCost: number;
    creditsCost: number;
    input: any;
    output?: any;
    error?: string;
  }): Promise<void> {
    await prisma.generationLog.create({
      data: {
        ...data,
        apiCost: new Decimal(data.apiCost),
        completedAt: data.status === 'completed' ? new Date() : undefined,
      },
    });
  }

  /**
   * Calcula e valida margem de lucro
   */
  static validateProfitMargin(apiCost: number, creditsCost: number): {
    isValid: boolean;
    margin: number;
    revenue: number;
    profit: number;
  } {
    const revenue = creditsCost * this.CREDIT_VALUE;
    const profit = revenue - apiCost;
    const margin = (profit / apiCost) * 100;
    
    return {
      isValid: margin >= 100, // Mínimo 100% de margem
      margin: Math.round(margin),
      revenue,
      profit,
    };
  }
}
```

---

## 2. Implementação Completa BFL.ai (Geração de Imagem)

### Cliente API BFL
```typescript
// src/lib/providers/bfl/client.ts

interface BFLConfig {
  apiKey: string;
  apiUrl: string;
}

export class BFLClient {
  private config: BFLConfig;

  constructor(config: BFLConfig) {
    this.config = config;
  }

  async generateImage(params: {
    prompt: string;
    model?: string;
    width?: number;
    height?: number;
    num_inference_steps?: number;
    guidance_scale?: number;
    seed?: number;
  }): Promise<{
    id: string;
    status: string;
    result?: { url: string };
  }> {
    const response = await fetch(`${this.config.apiUrl}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: params.prompt,
        model: params.model || 'flux1.1-pro',
        width: params.width || 1024,
        height: params.height || 1024,
        num_inference_steps: params.num_inference_steps || 20,
        guidance_scale: params.guidance_scale || 7.5,
        seed: params.seed,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`BFL API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async getStatus(taskId: string): Promise<{
    id: string;
    status: string;
    result?: { url: string };
  }> {
    const response = await fetch(`${this.config.apiUrl}/status/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`BFL API error: ${response.status}`);
    }

    return response.json();
  }
}

// Singleton instance
export const bflClient = new BFLClient({
  apiKey: process.env.BFL_API_KEY!,
  apiUrl: process.env.BFL_API_URL || 'https://api.bfl.ai/v1',
});
```

### API Route para Geração de Imagem
```typescript
// src/app/api/images/generate/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/utils';
import { CreditSystem } from '@/lib/credits/credit-system';
import { bflClient } from '@/lib/providers/bfl/client';
import { prisma } from '@/lib/prisma';

const GenerateImageSchema = z.object({
  prompt: z.string().min(1).max(1000),
  model: z.enum(['flux-schnell', 'flux-dev', 'flux1.1-pro', 'flux1.0-pro']).default('flux1.1-pro'),
  width: z.number().min(256).max(2048).default(1024),
  height: z.number().min(256).max(2048).default(1024),
  steps: z.number().min(1).max(50).default(20),
  guidance: z.number().min(1).max(20).default(7.5),
  seed: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticação
    const session = await requireAuth(req);
    const userId = session.user.id;

    // 2. Validação de entrada
    const body = await req.json();
    const input = GenerateImageSchema.parse(body);

    // 3. Calcular custo
    const creditsCost = CreditSystem.calculateImageCost(input.model);
    const apiCost = getAPIcost(input.model); // Helper function

    // 4. Verificar créditos
    if (!await CreditSystem.hasCredits(userId, creditsCost)) {
      return NextResponse.json(
        { 
          error: 'Créditos insuficientes',
          required: creditsCost,
          available: await getUserCredits(userId),
        },
        { status: 402 }
      );
    }

    // 5. Validar margem de lucro
    const marginCheck = CreditSystem.validateProfitMargin(apiCost, creditsCost);
    if (!marginCheck.isValid) {
      console.error('Margem insuficiente:', marginCheck);
      return NextResponse.json(
        { error: 'Erro de configuração de preços' },
        { status: 500 }
      );
    }

    // 6. Criar registro no banco
    const generation = await prisma.image.create({
      data: {
        userId,
        provider: 'bfl',
        prompt: input.prompt,
        model: input.model,
        status: 'pending',
        width: input.width,
        height: input.height,
      },
    });

    // 7. Chamar API BFL
    try {
      const result = await bflClient.generateImage({
        prompt: input.prompt,
        model: input.model,
        width: input.width,
        height: input.height,
        num_inference_steps: input.steps,
        guidance_scale: input.guidance,
        seed: input.seed,
      });

      // 8. Deduzir créditos
      await CreditSystem.deductCredits(userId, creditsCost, {
        type: 'image_generation',
        provider: 'bfl',
        details: {
          imageId: generation.id,
          model: input.model,
          taskId: result.id,
        },
      });

      // 9. Atualizar registro
      await prisma.image.update({
        where: { id: generation.id },
        data: {
          status: 'processing',
          externalId: result.id,
        },
      });

      // 10. Registrar no log
      await CreditSystem.logGeneration({
        userId,
        type: 'image',
        provider: 'bfl',
        status: 'processing',
        apiCost,
        creditsCost,
        input,
        output: { taskId: result.id },
      });

      return NextResponse.json({
        id: generation.id,
        taskId: result.id,
        status: 'processing',
        credits_charged: creditsCost,
        estimated_time: 10, // segundos
      });

    } catch (apiError) {
      // Reverter status em caso de erro
      await prisma.image.update({
        where: { id: generation.id },
        data: { status: 'failed' },
      });

      throw apiError;
    }

  } catch (error) {
    console.error('Image generation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao gerar imagem' },
      { status: 500 }
    );
  }
}

// Helper functions
function getAPIcost(model: string): number {
  const costs: Record<string, number> = {
    'flux-schnell': 0,
    'flux-dev': 0.025,
    'flux1.1-pro': 0.04,
    'flux1.0-pro': 0.05,
  };
  return costs[model] || 0.04;
}

async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  return user?.credits || 0;
}
```

### API Route para Status da Imagem
```typescript
// src/app/api/images/status/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { bflClient } from '@/lib/providers/bfl/client';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth(req);
    const userId = session.user.id;

    // Buscar imagem no banco
    const image = await prisma.image.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem não encontrada' },
        { status: 404 }
      );
    }

    // Se já está completa, retornar
    if (image.status === 'completed' && image.imageUrl) {
      return NextResponse.json({
        status: 'completed',
        url: image.imageUrl,
      });
    }

    // Verificar status na API
    if (image.externalId) {
      const status = await bflClient.getStatus(image.externalId);
      
      if (status.status === 'completed' && status.result?.url) {
        // Atualizar no banco
        await prisma.image.update({
          where: { id: image.id },
          data: {
            status: 'completed',
            imageUrl: status.result.url,
          },
        });

        return NextResponse.json({
          status: 'completed',
          url: status.result.url,
        });
      }

      return NextResponse.json({
        status: status.status,
      });
    }

    return NextResponse.json({
      status: image.status,
    });

  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Erro ao verificar status' },
      { status: 500 }
    );
  }
}
```

---

## 3. Implementação Completa ElevenLabs (Text-to-Speech)

### Cliente API ElevenLabs
```typescript
// src/lib/providers/elevenlabs/client.ts

interface ElevenLabsConfig {
  apiKey: string;
  apiUrl: string;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export class ElevenLabsClient {
  private config: ElevenLabsConfig;

  constructor(config: ElevenLabsConfig) {
    this.config = config;
  }

  async textToSpeech(params: {
    text: string;
    voice_id: string;
    model_id?: string;
    language_code?: string;
    voice_settings?: VoiceSettings;
  }): Promise<ArrayBuffer> {
    const response = await fetch(
      `${this.config.apiUrl}/text-to-speech/${params.voice_id}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': this.config.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: params.text,
          model_id: params.model_id || 'eleven_multilingual_v2',
          language_code: params.language_code,
          voice_settings: params.voice_settings || {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
    }

    return response.arrayBuffer();
  }

  async getVoices(): Promise<Array<{
    voice_id: string;
    name: string;
    labels: Record<string, string>;
    preview_url: string;
  }>> {
    const response = await fetch(`${this.config.apiUrl}/voices`, {
      headers: {
        'xi-api-key': this.config.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    return data.voices;
  }

  async getUserInfo(): Promise<{
    character_count: number;
    character_limit: number;
  }> {
    const response = await fetch(`${this.config.apiUrl}/user`, {
      headers: {
        'xi-api-key': this.config.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const data = await response.json();
    return {
      character_count: data.subscription.character_count,
      character_limit: data.subscription.character_limit,
    };
  }
}

// Singleton instance
export const elevenLabsClient = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
  apiUrl: process.env.ELEVENLABS_API_URL || 'https://api.elevenlabs.io/v1',
});
```

### API Route para TTS
```typescript
// src/app/api/audio/tts/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/auth/utils';
import { CreditSystem } from '@/lib/credits/credit-system';
import { elevenLabsClient } from '@/lib/providers/elevenlabs/client';
import { prisma } from '@/lib/prisma';
import { uploadToStorage } from '@/lib/storage';

const TTSSchema = z.object({
  text: z.string().min(1).max(5000),
  voice_id: z.string().default('21m00Tcm4TlvDq8ikWAM'),
  model_id: z.enum([
    'eleven_monolingual_v1',
    'eleven_multilingual_v2',
    'eleven_turbo_v2_5',
    'eleven_flash_v2_5',
  ]).default('eleven_multilingual_v2'),
  language_code: z.string().optional(),
  voice_settings: z.object({
    stability: z.number().min(0).max(1).default(0.5),
    similarity_boost: z.number().min(0).max(1).default(0.5),
    style: z.number().min(0).max(1).default(0),
    use_speaker_boost: z.boolean().default(true),
  }).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticação
    const session = await requireAuth(req);
    const userId = session.user.id;

    // 2. Validação
    const body = await req.json();
    const input = TTSSchema.parse(body);

    // 3. Calcular custos
    const creditsCost = CreditSystem.calculateTTSCost(input.text, input.model_id);
    const apiCost = calculateAPITTSCost(input.text, input.model_id);

    // 4. Verificar créditos
    if (!await CreditSystem.hasCredits(userId, creditsCost)) {
      return NextResponse.json(
        { 
          error: 'Créditos insuficientes',
          required: creditsCost,
          available: await getUserCredits(userId),
        },
        { status: 402 }
      );
    }

    // 5. Validar margem
    const marginCheck = CreditSystem.validateProfitMargin(apiCost, creditsCost);
    if (!marginCheck.isValid) {
      console.error('Margem insuficiente:', marginCheck);
      return NextResponse.json(
        { error: 'Erro de configuração de preços' },
        { status: 500 }
      );
    }

    // 6. Criar registro
    const audio = await prisma.audio.create({
      data: {
        userId,
        provider: 'elevenlabs',
        text: input.text.substring(0, 100) + '...',
        voiceId: input.voice_id,
        model: input.model_id,
        characters: input.text.length,
      },
    });

    try {
      // 7. Gerar áudio
      const audioBuffer = await elevenLabsClient.textToSpeech({
        text: input.text,
        voice_id: input.voice_id,
        model_id: input.model_id,
        language_code: input.language_code,
        voice_settings: input.voice_settings,
      });

      // 8. Salvar arquivo
      const fileName = `audio/${userId}/${audio.id}.mp3`;
      const audioUrl = await uploadToStorage(audioBuffer, fileName, 'audio/mpeg');

      // 9. Deduzir créditos
      await CreditSystem.deductCredits(userId, creditsCost, {
        type: 'tts_generation',
        provider: 'elevenlabs',
        details: {
          audioId: audio.id,
          characters: input.text.length,
          voice_id: input.voice_id,
          model: input.model_id,
        },
      });

      // 10. Atualizar registro
      await prisma.audio.update({
        where: { id: audio.id },
        data: { audioUrl },
      });

      // 11. Log
      await CreditSystem.logGeneration({
        userId,
        type: 'audio',
        provider: 'elevenlabs',
        status: 'completed',
        apiCost,
        creditsCost,
        input,
        output: { audioUrl },
      });

      // 12. Retornar áudio
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      
      return NextResponse.json({
        id: audio.id,
        audio_url: audioUrl,
        audio_base64: `data:audio/mpeg;base64,${base64Audio}`,
        characters: input.text.length,
        credits_charged: creditsCost,
        voice: {
          id: input.voice_id,
          model: input.model_id,
        },
      });

    } catch (apiError) {
      // Marcar como falha
      await prisma.audio.update({
        where: { id: audio.id },
        data: { audioUrl: null },
      });

      throw apiError;
    }

  } catch (error) {
    console.error('TTS generation error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao gerar áudio' },
      { status: 500 }
    );
  }
}

// Helper para calcular custo da API
function calculateAPITTSCost(text: string, model: string): number {
  const charCount = text.length;
  const costPer1k = model.includes('turbo') || model.includes('flash') ? 0.09 : 0.18;
  return (charCount / 1000) * costPer1k;
}

async function getUserCredits(userId: string): Promise<number> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });
  return user?.credits || 0;
}
```

### API Route para Listar Vozes
```typescript
// src/app/api/audio/voices/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { elevenLabsClient } from '@/lib/providers/elevenlabs/client';

// Cache de vozes por 1 hora
let voicesCache: any = null;
let cacheTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);

    // Verificar cache
    if (voicesCache && Date.now() - cacheTime < CACHE_DURATION) {
      return NextResponse.json(voicesCache);
    }

    // Buscar vozes
    const voices = await elevenLabsClient.getVoices();

    // Formatar resposta
    const formattedVoices = voices.map(voice => ({
      voice_id: voice.voice_id,
      name: voice.name,
      category: voice.labels?.category || 'general',
      gender: voice.labels?.gender || 'neutral',
      age: voice.labels?.age || 'adult',
      accent: voice.labels?.accent || 'neutral',
      language: voice.labels?.language || 'en',
      description: voice.labels?.description || '',
      use_case: voice.labels?.use_case || 'general',
      preview_url: voice.preview_url,
    }));

    // Atualizar cache
    voicesCache = formattedVoices;
    cacheTime = Date.now();

    return NextResponse.json(formattedVoices);

  } catch (error) {
    console.error('Error fetching voices:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar vozes' },
      { status: 500 }
    );
  }
}
```

---

## 4. Hooks React Completos

### Hook para Geração de Imagem
```typescript
// src/hooks/use-image-generation.ts

import { useMutation, useQuery } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface GenerateImageParams {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  steps?: number;
  guidance?: number;
  seed?: number;
}

export function useImageGeneration() {
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  // Mutação para gerar imagem
  const generateMutation = useMutation({
    mutationFn: async (params: GenerateImageParams) => {
      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao gerar imagem');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setGeneratingId(data.id);
      toast.success('Imagem sendo gerada...');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Query para verificar status
  const statusQuery = useQuery({
    queryKey: ['image-status', generatingId],
    queryFn: async () => {
      if (!generatingId) return null;

      const response = await fetch(`/api/images/status/${generatingId}`);
      if (!response.ok) throw new Error('Erro ao verificar status');
      
      return response.json();
    },
    enabled: !!generatingId,
    refetchInterval: (data) => {
      if (!data) return false;
      return data.status === 'completed' || data.status === 'failed' ? false : 2000;
    },
  });

  // Limpar estado quando completar
  useCallback(() => {
    if (statusQuery.data?.status === 'completed') {
      toast.success('Imagem gerada com sucesso!');
      setGeneratingId(null);
    } else if (statusQuery.data?.status === 'failed') {
      toast.error('Falha ao gerar imagem');
      setGeneratingId(null);
    }
  }, [statusQuery.data]);

  return {
    generate: generateMutation.mutate,
    isGenerating: generateMutation.isPending || statusQuery.isRefetching,
    currentImage: statusQuery.data,
    error: generateMutation.error || statusQuery.error,
  };
}
```

### Hook para TTS
```typescript
// src/hooks/use-tts-generation.ts

import { useMutation, useQuery } from '@tanstack/react-query';
import { useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface TTSParams {
  text: string;
  voice_id?: string;
  model_id?: string;
  language_code?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style: number;
    use_speaker_boost: boolean;
  };
}

export function useTTSGeneration() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Buscar vozes disponíveis
  const voicesQuery = useQuery({
    queryKey: ['elevenlabs-voices'],
    queryFn: async () => {
      const response = await fetch('/api/audio/voices');
      if (!response.ok) throw new Error('Erro ao carregar vozes');
      return response.json();
    },
    staleTime: 60 * 60 * 1000, // Cache por 1 hora
  });

  // Gerar áudio
  const generateMutation = useMutation({
    mutationFn: async (params: TTSParams) => {
      const response = await fetch('/api/audio/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao gerar áudio');
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.success('Áudio gerado com sucesso!');
      
      // Auto-play se configurado
      if (data.audio_base64) {
        playAudio(data.audio_base64);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Função para tocar áudio
  const playAudio = useCallback((audioSource: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioSource);
    audioRef.current = audio;
    
    audio.play().catch(err => {
      console.error('Erro ao tocar áudio:', err);
      toast.error('Erro ao reproduzir áudio');
    });

    return audio;
  }, []);

  // Parar áudio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  // Calcular custo estimado
  const calculateCost = useCallback((text: string, model?: string) => {
    const charCount = text.length;
    const blocks = Math.ceil(charCount / 1000);
    
    const isEconomic = model?.includes('turbo') || model?.includes('flash');
    const creditsPerBlock = isEconomic ? 18 : 36;
    
    return blocks * creditsPerBlock;
  }, []);

  return {
    voices: voicesQuery.data || [],
    isLoadingVoices: voicesQuery.isLoading,
    generate: generateMutation.mutate,
    isGenerating: generateMutation.isPending,
    lastAudio: generateMutation.data,
    playAudio,
    stopAudio,
    calculateCost,
    error: generateMutation.error || voicesQuery.error,
  };
}
```

---

## 5. Componentes UI Completos

### Componente de Geração de Imagem
```tsx
// src/components/generation/image-generator.tsx

'use client';

import { useState } from 'react';
import { useImageGeneration } from '@/hooks/use-image-generation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Image as ImageIcon, Download, Copy } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

const IMAGE_MODELS = [
  { value: 'flux-schnell', label: 'FLUX Schnell (Grátis)', credits: 2 },
  { value: 'flux-dev', label: 'FLUX Dev', credits: 5 },
  { value: 'flux1.1-pro', label: 'FLUX 1.1 Pro', credits: 8 },
  { value: 'flux1.0-pro', label: 'FLUX 1.0 Pro', credits: 10 },
];

const ASPECT_RATIOS = [
  { value: '1:1', width: 1024, height: 1024, label: 'Quadrado' },
  { value: '16:9', width: 1344, height: 768, label: 'Paisagem' },
  { value: '9:16', width: 768, height: 1344, label: 'Retrato' },
  { value: '4:3', width: 1152, height: 896, label: 'Clássico' },
];

export function ImageGenerator() {
  const { generate, isGenerating, currentImage } = useImageGeneration();
  
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('flux1.1-pro');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [steps, setSteps] = useState([20]);
  const [guidance, setGuidance] = useState([7.5]);
  
  const selectedModel = IMAGE_MODELS.find(m => m.value === model);
  const selectedRatio = ASPECT_RATIOS.find(r => r.value === aspectRatio);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Digite um prompt para gerar a imagem');
      return;
    }

    generate({
      prompt,
      model,
      width: selectedRatio?.width || 1024,
      height: selectedRatio?.height || 1024,
      steps: steps[0],
      guidance: guidance[0],
    });
  };

  const handleDownload = async () => {
    if (!currentImage?.url) return;

    try {
      const response = await fetch(currentImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Imagem baixada!');
    } catch (error) {
      toast.error('Erro ao baixar imagem');
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt);
    toast.success('Prompt copiado!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Painel de Configuração */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar Imagem com IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Prompt</Label>
            <Textarea
              placeholder="Descreva a imagem que você deseja gerar..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              maxLength={1000}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{prompt.length} / 1000</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyPrompt}
                disabled={!prompt}
              >
                <Copy className="h-3 w-3 mr-1" />
                Copiar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Modelo</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IMAGE_MODELS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    <div className="flex justify-between items-center w-full">
                      <span>{m.label}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {m.credits} créditos
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Proporção</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    {ratio.label} ({ratio.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Passos de Inferência</Label>
              <span className="text-sm text-muted-foreground">{steps[0]}</span>
            </div>
            <Slider
              value={steps}
              onValueChange={setSteps}
              min={10}
              max={50}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Orientação</Label>
              <span className="text-sm text-muted-foreground">{guidance[0]}</span>
            </div>
            <Slider
              value={guidance}
              onValueChange={setGuidance}
              min={1}
              max={20}
              step={0.5}
            />
          </div>

          <div className="pt-4">
            <Button
              onClick={handleGenerate}
              disabled={!prompt || isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Gerar Imagem ({selectedModel?.credits} créditos)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Painel de Visualização */}
      <Card>
        <CardHeader>
          <CardTitle>Resultado</CardTitle>
        </CardHeader>
        <CardContent>
          {currentImage?.status === 'processing' && (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Gerando sua imagem...</p>
              <p className="text-sm text-muted-foreground">
                Isso pode levar de 10 a 30 segundos
              </p>
            </div>
          )}

          {currentImage?.status === 'completed' && currentImage.url && (
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <Image
                  src={currentImage.url}
                  alt="Imagem gerada"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar
                </Button>
                <Button
                  onClick={() => window.open(currentImage.url, '_blank')}
                  variant="outline"
                  className="flex-1"
                >
                  Abrir Original
                </Button>
              </div>
            </div>
          )}

          {!currentImage && !isGenerating && (
            <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mb-4" />
              <p>Sua imagem aparecerá aqui</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Componente de TTS
```tsx
// src/components/generation/tts-generator.tsx

'use client';

import { useState, useEffect } from 'react';
import { useTTSGeneration } from '@/hooks/use-tts-generation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  Volume2, 
  Download, 
  Play, 
  Pause,
  Globe,
  Zap,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';

const TTS_MODELS = [
  { 
    value: 'eleven_multilingual_v2', 
    label: 'Multilingual v2', 
    icon: Globe,
    description: 'Melhor qualidade, 70+ idiomas',
    creditsPerK: 36,
  },
  { 
    value: 'eleven_turbo_v2_5', 
    label: 'Turbo v2.5', 
    icon: Zap,
    description: 'Baixa latência (~250ms)',
    creditsPerK: 18,
  },
  { 
    value: 'eleven_flash_v2_5', 
    label: 'Flash v2.5', 
    icon: Star,
    description: 'Ultra baixa latência (~75ms)',
    creditsPerK: 18,
  },
];

export function TTSGenerator() {
  const { 
    voices, 
    isLoadingVoices,
    generate, 
    isGenerating, 
    lastAudio,
    playAudio,
    stopAudio,
    calculateCost,
  } = useTTSGeneration();

  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState('21m00Tcm4TlvDq8ikWAM');
  const [modelId, setModelId] = useState('eleven_multilingual_v2');
  const [languageCode, setLanguageCode] = useState('pt-BR');
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Voice settings
  const [stability, setStability] = useState([0.5]);
  const [similarity, setSimilarity] = useState([0.5]);
  const [style, setStyle] = useState([0]);
  const [speakerBoost, setSpeakerBoost] = useState(true);

  const creditCost = calculateCost(text, modelId);
  const selectedModel = TTS_MODELS.find(m => m.value === modelId);

  const handleGenerate = () => {
    if (!text.trim()) {
      toast.error('Digite um texto para gerar o áudio');
      return;
    }

    generate({
      text,
      voice_id: voiceId,
      model_id: modelId,
      language_code: languageCode,
      voice_settings: {
        stability: stability[0],
        similarity_boost: similarity[0],
        style: style[0],
        use_speaker_boost: speakerBoost,
      },
    });
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else if (lastAudio?.audio_base64) {
      const audio = playAudio(lastAudio.audio_base64);
      setIsPlaying(true);
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
      });
    }
  };

  const handleDownload = () => {
    if (!lastAudio?.audio_base64) return;

    const link = document.createElement('a');
    link.href = lastAudio.audio_base64;
    link.download = `tts-audio-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Áudio baixado!');
  };

  // Filtrar vozes por idioma
  const filteredVoices = voices.filter(voice => {
    if (languageCode === 'pt-BR') {
      return voice.language === 'pt' || voice.language === 'pt-BR';
    }
    return voice.language === languageCode.split('-')[0];
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Painel Principal */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Text-to-Speech Profissional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Texto para Narração</Label>
              <Textarea
                placeholder="Digite ou cole o texto que você deseja converter em áudio..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
                maxLength={5000}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{text.length} / 5000 caracteres</span>
                <span>Custo: {creditCost} créditos</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Modelo de IA</Label>
                <Select value={modelId} onValueChange={setModelId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TTS_MODELS.map((model) => {
                      const Icon = model.icon;
                      return (
                        <SelectItem key={model.value} value={model.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <div>
                              <div>{model.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {model.description}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select value={languageCode} onValueChange={setLanguageCode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                    <SelectItem value="fr-FR">Français</SelectItem>
                    <SelectItem value="de-DE">Deutsch</SelectItem>
                    <SelectItem value="it-IT">Italiano</SelectItem>
                    <SelectItem value="ja-JP">日本語</SelectItem>
                    <SelectItem value="ko-KR">한국어</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Voz</Label>
              <Select 
                value={voiceId} 
                onValueChange={setVoiceId}
                disabled={isLoadingVoices}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma voz" />
                </SelectTrigger>
                <SelectContent>
                  {filteredVoices.length > 0 ? (
                    filteredVoices.map((voice) => (
                      <SelectItem key={voice.voice_id} value={voice.voice_id}>
                        <div>
                          <div className="font-medium">{voice.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {voice.gender} • {voice.age} • {voice.accent}
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-muted-foreground">
                      Nenhuma voz disponível para este idioma
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Configurações Avançadas */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Voz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Estabilidade</Label>
                <span className="text-sm text-muted-foreground">
                  {Math.round(stability[0] * 100)}%
                </span>
              </div>
              <Slider
                value={stability}
                onValueChange={setStability}
                min={0}
                max={1}
                step={0.05}
              />
              <p className="text-xs text-muted-foreground">
                Maior = mais consistente, Menor = mais expressivo
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Similaridade</Label>
                <span className="text-sm text-muted-foreground">
                  {Math.round(similarity[0] * 100)}%
                </span>
              </div>
              <Slider
                value={similarity}
                onValueChange={setSimilarity}
                min={0}
                max={1}
                step={0.05}
              />
              <p className="text-xs text-muted-foreground">
                Maior = mais próximo da voz original
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Estilo</Label>
                <span className="text-sm text-muted-foreground">
                  {Math.round(style[0] * 100)}%
                </span>
              </div>
              <Slider
                value={style}
                onValueChange={setStyle}
                min={0}
                max={1}
                step={0.05}
              />
              <p className="text-xs text-muted-foreground">
                Adiciona mais emoção e expressividade
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Speaker Boost</Label>
                <p className="text-xs text-muted-foreground">
                  Melhora a clareza da voz
                </p>
              </div>
              <Switch
                checked={speakerBoost}
                onCheckedChange={setSpeakerBoost}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Painel Lateral */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Gerar Áudio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Caracteres:</span>
                <span className="font-medium">{text.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Modelo:</span>
                <span className="font-medium">{selectedModel?.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Custo:</span>
                <span className="font-medium text-primary">
                  {creditCost} créditos
                </span>
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!text || isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando áudio...
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  Gerar Narração
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {lastAudio && (
          <Card>
            <CardHeader>
              <CardTitle>Áudio Gerado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePlayPause}
                  disabled={!lastAudio.audio_base64}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar MP3
                </Button>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Caracteres processados:</span>
                  <span>{lastAudio.characters}</span>
                </div>
                <div className="flex justify-between">
                  <span>Créditos utilizados:</span>
                  <span>{lastAudio.credits_charged}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
```

---

## 6. Utilitários de Storage

```typescript
// src/lib/storage/index.ts

import { supabase } from '@/lib/supabase/client';

export async function uploadToStorage(
  data: ArrayBuffer | Blob,
  path: string,
  contentType: string
): Promise<string> {
  const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'media';
  
  // Converter ArrayBuffer para Blob se necessário
  const blob = data instanceof ArrayBuffer 
    ? new Blob([data], { type: contentType })
    : data;

  const { data: uploadData, error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, {
      contentType,
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw new Error('Falha ao fazer upload do arquivo');
  }

  // Obter URL público
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
}

export async function deleteFromStorage(path: string): Promise<void> {
  const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET || 'media';
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('Storage delete error:', error);
    throw new Error('Falha ao deletar arquivo');
  }
}
```

Este código implementa um sistema completo de precificação com margem de 100% de lucro, incluindo todas as integrações com BFL.ai e ElevenLabs, componentes UI prontos e sistema de créditos robusto.