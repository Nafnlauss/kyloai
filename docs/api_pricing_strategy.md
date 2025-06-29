# Estratégia de Precificação - AI Video Hub

## 📊 ANÁLISE: Estrutura de Preços das APIs

### ✅ Luma Labs - Diferentes Modelos com Preços Fixos
A Luma oferece diferentes modelos/APIs, cada um com seu preço específico:

#### Modelos Disponíveis:
- **Ray2-Flash**: Modelo mais econômico e rápido
  - 540p·5s: $0,14 (fixo)
  - Ideal para previews e testes
  
- **Ray2**: Modelo padrão de alta qualidade
  - 720p·5s: $0,71 (fixo)
  - 1080p·9s: $1,54 (fixo)
  - 4K·9s: $1,72 (fixo)
  
- **Ray 1.6**: Modelo anterior (legacy)
  - Preços diferentes baseados em pixels

#### Outros Custos Fixos:
- Modify API: $0,01582/milhão pixels
- Upscaling: $0,02-$0,11/seg
- Áudio: $0,02/seg

### ✅ KlingAI - Preços Fixos por Qualidade
- Standard 5s: $0,14 (fixo)
- Professional 5s: $0,35 (fixo)
- Standard 10s: $0,28 (fixo)
- Professional 10s: $0,70 (fixo)

### 📊 ESTRATÉGIA: Oferecer Opções por Modelo
1. Deixar o usuário escolher qualidade/modelo
2. Cobrar de acordo com o modelo selecionado
3. Manter margem de 100% em cada opção

---

## 1. Sistema de Créditos Base

### Análise do Plano Mais Econômico
O plano com **menor custo por crédito** é:
- **Créditos Avulsos 16.000**: $90 ÷ 16.000 = **$0,005625 por crédito**

### Cálculo da Margem Mínima
Para garantir 100% de margem neste plano:
- Custo máximo permitido por crédito: $0,005625 ÷ 2 = **$0,0028125**
- Ou seja: **1 crédito deve custar no máximo $0,0028 para nós**

### Planos Mensais
| Plano | Preço/mês | Créditos | $/Crédito | Margem Real* |
|-------|-----------|----------|-----------|--------------|
| Básico | $8 | 1.000 | $0,008 | 184% |
| Popular | $26 | 4.000 | $0,0065 | 131% |
| Pro | $68 | 12.000 | $0,00567 | 101% |

### Créditos Avulsos (para assinantes)
| Pacote | Preço | Créditos | $/Crédito | Margem Real* |
|--------|-------|----------|-----------|--------------|
| Pequeno | $8 | 1.000 | $0,008 | 184% |
| Médio | $18 | 2.500 | $0,0072 | 156% |
| Grande | $45 | 7.000 | $0,00643 | 128% |
| Mega | $90 | 16.000 | $0,005625 | **100%** |

*Margem calculada com base no custo máximo de $0,0028125/crédito

---

## 2. Nova Tabela de Precificação com Margem 100% Garantida

### 🎬 Geração de Vídeo - PREÇOS RECALCULADOS

#### Luma Labs (Preços Fixos por Modelo)
| Modelo/Qualidade | Custo API | Créditos (margem 100%) | Uso Ideal |
|------------------|-----------|------------------------|-----------|
| **Ray2-Flash** | | | |
| 540p·5s | $0,14 | 50 | Preview rápido |
| **Ray2** | | | |
| 720p·5s | $0,71 | 253 | Qualidade padrão |
| 1080p·5s | $0,77* | 275 | Alta definição |
| 1080p·9s | $1,54 | 549 | HD estendido |
| 4K·9s | $1,72 | 613 | Ultra HD |
| **Extras** | | | |
| Áudio/seg | $0,02 | 8 por seg | Narração |
| Upscaling | $0,02-0,11 | 8-40 | Melhorar qualidade |

*Estimado com base no padrão de preços

#### KlingAI (Preços Fixos)
| Tipo | Custo API | Créditos (com margem 100%) | 
|------|-----------|---------------------------|
| 5s Standard | $0,14 | 50 |
| 10s Standard | $0,28 | 100 |
| 5s Professional | $0,35 | 125 |
| 10s Professional | $0,70 | 250 |

### 🖼️ Geração de Imagem

#### BFL.ai (FLUX) - Preços Fixos
| Modelo | Custo API | Créditos (com margem 100%) |
|--------|-----------|---------------------------|
| FLUX Schnell | Grátis | 5 (taxa de serviço) |
| FLUX Dev | $0,025 | 9 |
| FLUX 1.1 Pro | $0,04 | 15 |
| FLUX 1.0 Pro | $0,05 | 18 |

### 🎵 Text-to-Speech

#### ElevenLabs - Preços por 1000 caracteres
| Modelo | Custo API | Créditos (com margem 100%) |
|--------|-----------|---------------------------|
| Multilingual v2 | $0,18 | 65 |
| Turbo v2.5 | $0,09 | 33 |
| Flash v2.5 | $0,09 | 33 |



**Exemplos práticos TTS com novos preços:**
- Texto curto (100 chars): 4-7 créditos
- Texto médio (500 chars): 17-33 créditos  
- Texto longo (2000 chars): 66-130 créditos

---

## 3. Funcionalidades Compostas - NOVOS PREÇOS

### 🎞️ Vídeo com Áudio (Lip Sync)
Processo: Gerar vídeo → Gerar áudio → Sincronizar

| Componente | Custo Real | Créditos c/ Margem 100% |
|------------|------------|-------------------------|
| Vídeo Kling 5s Standard | $0,14 | 50 |
| Áudio ElevenLabs (500 chars) | $0,09 | 33 |
| Processamento Lip Sync | $0,10 | 36 |
| **Total** | **$0,33** | **119** |

### 🎨 Imagem Animada
Processo: Gerar imagem → Animar com vídeo

| Componente | Custo Real | Créditos c/ Margem 100% |
|------------|------------|-------------------------|
| Imagem FLUX 1.1 Pro | $0,04 | 15 |
| Animação Luma 720p·5s | $0,71 | 304 |
| **Total** | **$0,75** | **319** |

---

## 4. Tabela de Referência Rápida - PREÇOS FINAIS

### Menu Simplificado para Usuários
| Conteúdo | Créditos | Valor em $ |
|----------|----------|------------|
| **🖼️ Imagens** | | |
| Imagem rápida (Schnell) | 5 | $0,03-0,05* |
| Imagem padrão (Dev) | 9 | $0,05-0,08* |
| Imagem HD (Pro 1.1) | 15 | $0,08-0,13* |
| Imagem premium (Pro 1.0) | 18 | $0,10-0,16* |
| **🎬 Vídeos** | | |
| Vídeo 5s básico (Kling Std) | 50 | $0,28-0,45* |
| Vídeo 5s profissional (Kling Pro) | 125 | $0,70-1,12* |
| Vídeo 5s HD (Luma 720p) | 304 | $1,71-2,74* |
| Vídeo 9s Full HD (Luma 1080p) | 659 | $3,71-5,94* |
| Vídeo 9s 4K (Luma) | 736 | $4,14-6,62* |
| **🎵 Áudio** | | |
| Narração econômica/1k chars | 33 | $0,19-0,30* |
| Narração premium/1k chars | 65 | $0,37-0,59* |
| **💎 Combos** | | |
| Vídeo + Áudio básico | 119 | $0,67-1,07* |
| Imagem animada HD | 319 | $1,79-2,87* |

*Preço varia conforme o plano de créditos escolhido

---

## 5. Implementação Técnica

### Sistema de Cobrança de Créditos ATUALIZADO
```typescript
// src/lib/pricing/credit-calculator.ts

export const CREDIT_COSTS = {
  // Vídeo - Luma (por modelo e resolução)
  // Ray2-Flash (econômico)
  LUMA_FLASH_540P_5S: 50,
  
  // Ray2 (qualidade padrão/alta)
  LUMA_RAY2_720P_5S: 253,
  LUMA_RAY2_1080P_5S: 275,
  LUMA_RAY2_1080P_9S: 549,
  LUMA_RAY2_4K_9S: 613,
  
  // Extras
  LUMA_AUDIO_PER_SEC: 8,
  
  // Vídeo - Kling (fixo)
  KLING_5S_STANDARD: 50,
  KLING_10S_STANDARD: 100,
  KLING_5S_PRO: 125,
  KLING_10S_PRO: 250,
  
  // Imagem - BFL
  FLUX_SCHNELL: 5,
  FLUX_DEV: 9,
  FLUX_PRO_1_1: 15,
  FLUX_PRO_1_0: 18,
  
  // Áudio - ElevenLabs (por 1000 caracteres)
  ELEVENLABS_MULTILINGUAL: 65,
  ELEVENLABS_TURBO: 33,
  ELEVENLABS_FLASH: 33,
  
  // Processamentos adicionais
  LIP_SYNC: 36,
  VIDEO_ENHANCE: 72,
  AUDIO_ENHANCE: 18,
} as const;

export function calculateTTSCredits(text: string, model: string): number {
  const charCount = text.length;
  const blocks = Math.ceil(charCount / 1000);
  
  switch(model) {
    case 'eleven_multilingual_v2':
      return blocks * CREDIT_COSTS.ELEVENLABS_MULTILINGUAL;
    case 'eleven_turbo_v2_5':
    case 'eleven_flash_v2_5':
      return blocks * CREDIT_COSTS.ELEVENLABS_TURBO;
    default:
      return blocks * CREDIT_COSTS.ELEVENLABS_MULTILINGUAL;
  }
}

export function calculateLumaVideoCredits(
  model: 'ray2-flash' | 'ray2',
  resolution: string, 
  duration: number,
  includeAudio: boolean = false
): number {
  let baseCredits = 0;
  
  // Ray2-Flash (modelo econômico)
  if (model === 'ray2-flash') {
    if (resolution === '540p' && duration <= 5) {
      baseCredits = CREDIT_COSTS.LUMA_FLASH_540P_5S;
    } else {
      // Flash só suporta 540p 5s
      throw new Error('Ray2-Flash apenas suporta 540p até 5 segundos');
    }
  }
  
  // Ray2 (modelo padrão/premium)
  else if (model === 'ray2') {
    if (resolution === '720p' && duration <= 5) {
      baseCredits = CREDIT_COSTS.LUMA_RAY2_720P_5S;
    } else if (resolution === '1080p') {
      baseCredits = duration <= 5 ? CREDIT_COSTS.LUMA_RAY2_1080P_5S : CREDIT_COSTS.LUMA_RAY2_1080P_9S;
    } else if (resolution === '4k' && duration <= 9) {
      baseCredits = CREDIT_COSTS.LUMA_RAY2_4K_9S;
    } else {
      throw new Error(`Configuração não suportada: ${resolution} ${duration}s`);
    }
  }
  
  // Adicionar custo do áudio se necessário
  if (includeAudio) {
    baseCredits += CREDIT_COSTS.LUMA_AUDIO_PER_SEC * duration;
  }
  
  return baseCredits;
}

export function calculateKlingVideoCredits(
  duration: number, 
  quality: 'standard' | 'professional'
): number {
  const isStandard = quality === 'standard';
  
  if (duration <= 5) {
    return isStandard ? CREDIT_COSTS.KLING_5S_STANDARD : CREDIT_COSTS.KLING_5S_PRO;
  } else if (duration <= 10) {
    return isStandard ? CREDIT_COSTS.KLING_10S_STANDARD : CREDIT_COSTS.KLING_10S_PRO;
  }
  
  // Para durações maiores, calcular proporcionalmente
  const baseRate = isStandard ? 10 : 25; // créditos por segundo
  return Math.ceil(duration * baseRate);
}
```

### Validação de Margem com Base no Plano Mais Barato
```typescript
// src/lib/pricing/margin-validator.ts

interface CostValidation {
  apiCost: number;
  creditsCost: number;
  worstCaseRevenue: number; // Receita no plano mais barato
  worstCaseMargin: number;
  isValid: boolean;
}

const WORST_CASE_CREDIT_VALUE = 0.005625; // $90 ÷ 16.000 créditos

export function validateMargin(apiCost: number, credits: number): CostValidation {
  // Calcular receita no pior cenário (plano mais barato)
  const worstCaseRevenue = credits * WORST_CASE_CREDIT_VALUE;
  const worstCaseMargin = ((worstCaseRevenue - apiCost) / apiCost) * 100;
  
  return {
    apiCost,
    creditsCost: credits,
    worstCaseRevenue,
    worstCaseMargin,
    isValid: worstCaseMargin >= 100, // DEVE ter 100% mesmo no pior caso
  };
}

// Validação para Luma
export function validateLumaMargin(resolution: string, duration: number): CostValidation {
  const apiCosts = {
    '540p-5s': 0.14,
    '720p-5s': 0.71,
    '1080p-5s': 0.77,
    '1080p-9s': 1.54,
    '4k-9s': 1.72,
  };
  
  const key = `${resolution}-${duration}s`;
  const apiCost = apiCosts[key] || 1.72; // Usar máximo como fallback
  const credits = calculateLumaVideoCredits(resolution, duration);
  
  return validateMargin(apiCost * 1.2, credits); // +20% buffer
}
```

---

## 6. Pacotes e Features Premium

### 🎯 Pacotes Promocionais (Exemplos)
| Pacote | Conteúdo | Créditos | Preço |
|--------|----------|----------|-------|
| Starter Pack | 5 vídeos Kling + 10 imagens | 400 | $3,20* |
| Creator Bundle | 10 vídeos + 20 imagens + 5 áudios | 1.200 | $9,60* |
| Pro Studio | 20 vídeos HD + 50 imagens + narração | 8.000 | $64,00* |

*Baseado no plano de $8/1000 créditos

### 💎 Features Premium (Multiplicadores)
| Feature | Multiplicador | Exemplo |
|---------|---------------|---------|
| Prioridade na fila | 1.5x | Vídeo 50 créd → 75 créd |
| Resolução máxima (4K) | 2.0x | Vídeo 304 créd → 608 créd |
| Sem marca d'água | 1.3x | Qualquer geração +30% |
| Múltiplas variações | 0.8x cada | 3 variações = 2.4x total |
| Download em lote | 1.1x | Download 10 itens +10% |

---

## 7. Análise de Rentabilidade Real

### Cenário 1: Usuário no Plano Mais Caro ($8/1000)
| Uso | Créditos | Receita | Custo API | Lucro | Margem |
|-----|----------|---------|-----------|-------|---------|
| 5 vídeos Kling Std | 250 | $2,00 | $0,70 | $1,30 | 186% |
| 10 imagens FLUX Pro | 150 | $1,20 | $0,40 | $0,80 | 200% |
| 2000 chars narração | 130 | $1,04 | $0,36 | $0,68 | 189% |
| **Total** | **530** | **$4,24** | **$1,46** | **$2,78** | **190%** |

### Cenário 2: Usuário no Plano Mais Barato ($90/16000)
| Uso | Créditos | Receita | Custo API | Lucro | Margem |
|-----|----------|---------|-----------|-------|---------|
| 1 vídeo Luma HD | 659 | $3,71 | $1,85* | $1,86 | 100% |
| 5 imagens premium | 90 | $0,51 | $0,25 | $0,26 | 104% |
| 5000 chars TTS | 325 | $1,83 | $0,90 | $0,93 | 103% |
| **Total** | **1074** | **$6,05** | **$3,00** | **$3,05** | **102%** |

*Incluindo buffer de 20% sobre o custo real

---

## 8. Gestão de Riscos - Flutuações de Preço

### ✅ Todas as APIs têm Preços Fixos!

#### Estrutura de Preços:
- **Luma Labs**: Preço fixo por modelo (Ray2-Flash, Ray2) + resolução
- **KlingAI**: Preço fixo por duração/qualidade  
- **BFL**: Preço fixo por modelo
- **ElevenLabs**: Preço fixo por caracteres

#### Vantagem Estratégica:
- Previsibilidade total de custos
- Margem garantida em cada operação
- Sem surpresas ou flutuações
- Permite oferecer diferentes níveis de qualidade/preço

### 📊 Monitoramento Necessário
```typescript
// src/lib/monitoring/price-alerts.ts

export const API_PRICE_LIMITS = {
  LUMA: {
    'ray2-flash-540p': { expected: 0.14, alert: 0.17 },
    'ray2-720p': { expected: 0.71, alert: 0.85 },
    'ray2-1080p': { expected: 1.54, alert: 1.85 },
    'ray2-4k': { expected: 1.72, alert: 2.06 },
  },
  KLING: {
    'standard-5s': { expected: 0.14, alert: 0.17 },
    'pro-5s': { expected: 0.35, alert: 0.42 },
  },
  BFL: {
    'flux-1.1-pro': { expected: 0.04, alert: 0.05 },
    'flux-dev': { expected: 0.025, alert: 0.03 },
  },
  ELEVENLABS: {
    'multilingual': { expected: 0.18, alert: 0.22 },
    'turbo': { expected: 0.09, alert: 0.11 },
  },
};

// Alertar se o preço real ultrapassar o limite
export async function checkPriceIncreases() {
  // Implementar verificação diária dos preços das APIs
  // Enviar alerta se houver aumento além do esperado
}
```

### 🛡️ Estratégias de Proteção
1. **Revisão Semanal**: Verificar mudanças nas APIs
2. **Preços Dinâmicos**: Ajustar automaticamente se detectar aumento
3. **Reserva de Margem**: Manter 20% extra para absorver flutuações
4. **Comunicação Transparente**: Avisar usuários sobre ajustes necessários

### 💰 Conclusão da Margem
- **Margem mínima garantida**: 100% no plano mais barato
- **Margem média esperada**: 150-200% 
- **APIs mais rentáveis**: Imagens (200%+) e TTS econômico (180%+)
- **APIs menos rentáveis**: Vídeos Luma HD/4K (100-110%)

### 🎯 Estratégia de Oferta por Qualidade
```typescript
// Exemplo de interface para o usuário escolher
export const VIDEO_QUALITY_OPTIONS = {
  LUMA: [
    { 
      id: 'flash-preview',
      name: 'Preview Rápido',
      model: 'ray2-flash',
      resolution: '540p',
      duration: 5,
      credits: 50,
      description: 'Ideal para testar ideias'
    },
    {
      id: 'standard-hd',
      name: 'HD Padrão',
      model: 'ray2',
      resolution: '720p', 
      duration: 5,
      credits: 253,
      description: 'Qualidade profissional'
    },
    {
      id: 'premium-4k',
      name: '4K Premium',
      model: 'ray2',
      resolution: '4k',
      duration: 9,
      credits: 613,
      description: 'Máxima qualidade'
    }
  ],
  KLING: [
    {
      id: 'kling-standard',
      name: 'Standard',
      quality: 'standard',
      duration: 5,
      credits: 50,
      description: 'Ótimo custo-benefício'
    },
    {
      id: 'kling-pro',
      name: 'Professional',
      quality: 'professional',
      duration: 5,
      credits: 125,
      description: 'Qualidade cinematográfica'
    }
  ]
};
```