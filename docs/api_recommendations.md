# Recomendações de Integração de APIs

## Sumário Executivo

### 🎯 APIs Recomendadas para Integração

1. **BFL.ai (Black Forest Labs)** - Geração de Imagem AI
   - **Função inédita**: Geração de imagem de alta qualidade com FLUX
   - **Valor agregado**: Complementa perfeitamente nossos serviços de vídeo
   - **ROI esperado**: Alto - demanda crescente por imagens AI

2. **ElevenLabs** - Text-to-Speech Profissional
   - **Função inédita**: TTS ultra-realista com clonagem de voz
   - **Valor agregado**: Expande para mercado de áudio/narração
   - **ROI esperado**: Médio-Alto - múltiplos casos de uso

### ❌ APIs NÃO Recomendadas

1. **PiAPI** - Agregador redundante
   - Oferece Kling e Luma que já possuímos diretamente
   - Adiciona camada de custo sem benefício
   - Única exceção: Midjourney (se houver demanda futura)

2. **NewportAI** - API imatura
   - Documentação insuficiente
   - Avatares digitais interessantes, mas sem detalhes técnicos
   - Reavaliar em 6 meses

---

## Implementação Detalhada

### 1. BFL.ai - Geração de Imagem

#### Configuração de Ambiente
```env
# Adicionar ao .env
BFL_API_KEY=your_bfl_api_key_here
BFL_API_URL=https://api.bfl.ai/v1
```

#### Tipagens TypeScript
```typescript
// src/types/bfl.types.ts
import { z } from 'zod';

export const BFLGenerateImageSchema = z.object({
  prompt: z.string().min(1).max(1000),
  model: z.enum(['flux.1-kontext', 'flux1.1-pro', 'flux-ultra', 'flux-raw']).default('flux1.1-pro'),
  width: z.number().min(256).max(2048).default(1024),
  height: z.number().min(256).max(2048).default(1024),
  steps: z.number().min(1).max(50).default(20),
  guidance_scale: z.number().min(1).max(20).default(7.5),
  seed: z.number().optional(),
});

export type BFLGenerateImageInput = z.infer<typeof BFLGenerateImageSchema>;

export interface BFLGenerateImageResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: {
    url: string;
    width: number;
    height: number;
  };
  error?: string;
}
```

#### Implementação da Rota API
```typescript
// src/app/api/images/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { BFLGenerateImageSchema } from '@/types/bfl.types';
import { creditManager } from '@/lib/credits/credit-manager';

const BFL_CREDIT_COST = 1; // 1 crédito por imagem

export async function POST(req: NextRequest) {
  try {
    // Autenticação
    const session = await requireAuth(req);
    const userId = session.user.id;

    // Validação de input
    const body = await req.json();
    const input = BFLGenerateImageSchema.parse(body);

    // Verificar créditos
    const hasCredits = await creditManager.hasCredits(userId, BFL_CREDIT_COST);
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'Créditos insuficientes' },
        { status: 402 }
      );
    }

    // Chamar API BFL
    const response = await fetch(`${process.env.BFL_API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.BFL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: input.prompt,
        model: input.model,
        width: input.width,
        height: input.height,
        num_inference_steps: input.steps,
        guidance_scale: input.guidance_scale,
        seed: input.seed,
      }),
    });

    if (!response.ok) {
      throw new Error(`BFL API error: ${response.statusText}`);
    }

    const result = await response.json();

    // Debitar créditos
    await creditManager.deductCredits(userId, BFL_CREDIT_COST, {
      type: 'image_generation',
      provider: 'bfl',
      details: { imageId: result.id },
    });

    // Registrar no banco
    await prisma.image.create({
      data: {
        userId,
        provider: 'bfl',
        prompt: input.prompt,
        model: input.model,
        status: 'processing',
        externalId: result.id,
      },
    });

    return NextResponse.json({ 
      id: result.id,
      status: 'processing',
      pollUrl: `/api/images/status/${result.id}`,
    });

  } catch (error) {
    console.error('BFL generation error:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar imagem' },
      { status: 500 }
    );
  }
}
```

#### Hook React
```typescript
// src/hooks/use-bfl-generation.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { BFLGenerateImageInput } from '@/types/bfl.types';

export function useBFLGeneration() {
  const generateMutation = useMutation({
    mutationFn: async (input: BFLGenerateImageInput) => {
      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao gerar imagem');
      }

      return response.json();
    },
  });

  const pollStatus = (imageId: string) => {
    return useQuery({
      queryKey: ['bfl-image', imageId],
      queryFn: async () => {
        const response = await fetch(`/api/images/status/${imageId}`);
        if (!response.ok) throw new Error('Erro ao verificar status');
        return response.json();
      },
      refetchInterval: (data) => {
        return data?.status === 'completed' || data?.status === 'failed' ? false : 2000;
      },
    });
  };

  return {
    generate: generateMutation.mutate,
    isGenerating: generateMutation.isPending,
    pollStatus,
  };
}
```

---

### 2. ElevenLabs - Text-to-Speech

#### Configuração de Ambiente
```env
# Adicionar ao .env
ELEVENLABS_API_KEY=your_xi_api_key_here
ELEVENLABS_API_URL=https://api.elevenlabs.io/v1
```

#### Tipagens TypeScript
```typescript
// src/types/elevenlabs.types.ts
import { z } from 'zod';

export const ElevenLabsTTSSchema = z.object({
  text: z.string().min(1).max(5000),
  voice_id: z.string().default('21m00Tcm4TlvDq8ikWAM'), // Rachel voice
  model_id: z.enum([
    'eleven_monolingual_v1',
    'eleven_multilingual_v2',
    'eleven_turbo_v2_5',
    'eleven_flash_v2_5',
  ]).default('eleven_multilingual_v2'),
  language_code: z.string().optional(), // pt-BR, en-US, etc
  voice_settings: z.object({
    stability: z.number().min(0).max(1).default(0.5),
    similarity_boost: z.number().min(0).max(1).default(0.5),
    style: z.number().min(0).max(1).default(0),
    use_speaker_boost: z.boolean().default(true),
  }).optional(),
});

export type ElevenLabsTTSInput = z.infer<typeof ElevenLabsTTSSchema>;

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  samples: string[];
  category: string;
  labels: Record<string, string>;
  preview_url: string;
}
```

#### Implementação da Rota API
```typescript
// src/app/api/audio/tts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { ElevenLabsTTSSchema } from '@/types/elevenlabs.types';
import { creditManager } from '@/lib/credits/credit-manager';

const TTS_CREDIT_COST = 0.5; // 0.5 crédito por 1000 caracteres

export async function POST(req: NextRequest) {
  try {
    // Autenticação
    const session = await requireAuth(req);
    const userId = session.user.id;

    // Validação
    const body = await req.json();
    const input = ElevenLabsTTSSchema.parse(body);

    // Calcular custo baseado no tamanho do texto
    const charCount = input.text.length;
    const creditCost = Math.ceil(charCount / 1000) * TTS_CREDIT_COST;

    // Verificar créditos
    const hasCredits = await creditManager.hasCredits(userId, creditCost);
    if (!hasCredits) {
      return NextResponse.json(
        { error: 'Créditos insuficientes' },
        { status: 402 }
      );
    }

    // Chamar API ElevenLabs
    const response = await fetch(
      `${process.env.ELEVENLABS_API_URL}/text-to-speech/${input.voice_id}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: input.text,
          model_id: input.model_id,
          language_code: input.language_code,
          voice_settings: input.voice_settings,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    // Converter resposta para base64
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    // Debitar créditos
    await creditManager.deductCredits(userId, creditCost, {
      type: 'tts_generation',
      provider: 'elevenlabs',
      details: { 
        characters: charCount,
        voice_id: input.voice_id,
      },
    });

    // Registrar no banco
    await prisma.audio.create({
      data: {
        userId,
        provider: 'elevenlabs',
        text: input.text.substring(0, 100), // Salvar preview
        voiceId: input.voice_id,
        model: input.model_id,
        characters: charCount,
      },
    });

    return NextResponse.json({
      audio: `data:audio/mpeg;base64,${base64Audio}`,
      characters: charCount,
      credits_used: creditCost,
    });

  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar áudio' },
      { status: 500 }
    );
  }
}
```

#### Hook React
```typescript
// src/hooks/use-elevenlabs-tts.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { ElevenLabsTTSInput } from '@/types/elevenlabs.types';

export function useElevenLabsTTS() {
  // Buscar vozes disponíveis
  const { data: voices, isLoading: isLoadingVoices } = useQuery({
    queryKey: ['elevenlabs-voices'],
    queryFn: async () => {
      const response = await fetch('/api/audio/voices');
      if (!response.ok) throw new Error('Erro ao carregar vozes');
      return response.json();
    },
    staleTime: 1000 * 60 * 60, // Cache por 1 hora
  });

  // Gerar áudio
  const generateMutation = useMutation({
    mutationFn: async (input: ElevenLabsTTSInput) => {
      const response = await fetch('/api/audio/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao gerar áudio');
      }

      return response.json();
    },
  });

  // Helper para tocar áudio
  const playAudio = (base64Audio: string) => {
    const audio = new Audio(base64Audio);
    audio.play();
    return audio;
  };

  return {
    voices,
    isLoadingVoices,
    generate: generateMutation.mutate,
    isGenerating: generateMutation.isPending,
    playAudio,
  };
}
```

#### Componente de UI
```tsx
// src/components/audio/tts-generator.tsx
'use client';

import { useState } from 'react';
import { useElevenLabsTTS } from '@/hooks/use-elevenlabs-tts';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Volume2 } from 'lucide-react';

export function TTSGenerator() {
  const [text, setText] = useState('');
  const [voiceId, setVoiceId] = useState('21m00Tcm4TlvDq8ikWAM');
  const { voices, generate, isGenerating, playAudio } = useElevenLabsTTS();

  const handleGenerate = () => {
    generate(
      { text, voice_id: voiceId },
      {
        onSuccess: (data) => {
          playAudio(data.audio);
        },
      }
    );
  };

  const charCount = text.length;
  const creditCost = Math.ceil(charCount / 1000) * 0.5;

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Digite o texto para converter em áudio..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        maxLength={5000}
      />
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{charCount} / 5000 caracteres</span>
        <span>Custo: {creditCost} créditos</span>
      </div>

      <Select value={voiceId} onValueChange={setVoiceId}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione uma voz" />
        </SelectTrigger>
        <SelectContent>
          {voices?.map((voice) => (
            <SelectItem key={voice.voice_id} value={voice.voice_id}>
              {voice.name} - {voice.labels?.accent || 'Neutro'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        onClick={handleGenerate}
        disabled={!text || isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando áudio...
          </>
        ) : (
          <>
            <Volume2 className="mr-2 h-4 w-4" />
            Gerar Áudio
          </>
        )}
      </Button>
    </div>
  );
}
```

---

## Configuração do Prisma

```prisma
// Adicionar ao schema.prisma

model Image {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  provider   String   // bfl, dall-e, midjourney, etc
  prompt     String
  model      String?
  status     String   // pending, processing, completed, failed
  externalId String?
  imageUrl   String?
  width      Int?
  height     Int?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([userId])
  @@index([status])
}

model Audio {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  provider   String   // elevenlabs, azure-tts, etc
  text       String   // Preview do texto (primeiros 100 chars)
  voiceId    String?
  model      String?
  audioUrl   String?
  duration   Int?     // Duração em segundos
  characters Int      // Total de caracteres processados
  createdAt  DateTime @default(now())

  @@index([userId])
}
```

---

## Dependências NPM

```json
// Nenhuma dependência adicional necessária!
// Usamos apenas:
// - fetch nativo do Node.js
// - Zod (já instalado)
// - React Query (já instalado)
// - Prisma (já instalado)
```

---

## Próximos Passos

1. **Implementar BFL.ai primeiro** - Adiciona funcionalidade completamente nova
2. **Implementar ElevenLabs em seguida** - Expande para mercado de áudio
3. **Monitorar uso e feedback** - Ajustar limites e custos
4. **Considerar cache de resultados** - Economizar créditos em requisições repetidas
5. **Implementar webhook handlers** - Para atualizações assíncronas de status

## Considerações de Segurança

- Validar todos os inputs com Zod
- Rate limiting por usuário
- Sanitizar prompts antes de enviar às APIs
- Logs de auditoria para todas as gerações
- Watermark em imagens geradas (opcional)
- Verificação de conteúdo inadequado