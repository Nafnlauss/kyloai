# Resumo do Contexto do Projeto AI Video Hub

## 📍 Localização dos Arquivos Principais

### Estratégia de Precificação
- **Documento principal**: `/mnt/f/site-ia/ai-video-hub/tests/api_pricing_strategy.md`
- **Análise de APIs**: `/mnt/f/site-ia/ai-video-hub/tests/api_matrix.md`
- **Recomendações**: `/mnt/f/site-ia/ai-video-hub/tests/api_recommendations.md`
- **Código completo**: `/mnt/f/site-ia/ai-video-hub/tests/api_implementation_code.md`

### Sistema de Geração de Vídeo
- **UI Dinâmica**: `/mnt/f/site-ia/ai-video-hub/tests/video_generation_dynamic_ui.tsx`
- **Configuração**: `/mnt/f/site-ia/ai-video-hub/tests/video_api_config.ts`

## 💰 Sistema de Créditos - Resumo

### Planos e Preços
**Planos Mensais:**
- Básico: $8 = 1.000 créditos
- Popular: $26 = 4.000 créditos  
- Pro: $68 = 12.000 créditos

**Créditos Avulsos:**
- $8 = 1.000 créditos
- $18 = 2.500 créditos
- $45 = 7.000 créditos
- $90 = 16.000 créditos (BASE para cálculo de margem 100%)

### Margem Mínima
- **Custo máximo por crédito**: $0.0028125 (para garantir 100% no plano de $90)
- **Valor do crédito**: $0.005625 a $0.008 dependendo do plano

## 🎬 Preços de Vídeo (com margem 100%)

### Luma Labs
**Ray2-Flash (econômico)**
- 540p/5s: 50 créditos ($0.14 API)

**Ray2 (premium)**
- 720p/5s: 253 créditos ($0.71 API)
- 1080p/5s: 275 créditos ($0.77 API)
- 1080p/9s: 549 créditos ($1.54 API)
- 4K/9s: 613 créditos ($1.72 API)

### KlingAI
**Standard**
- 5s: 50 créditos ($0.14 API)
- 10s: 100 créditos ($0.28 API)

**Professional**
- 5s: 125 créditos ($0.35 API)
- 10s: 250 créditos ($0.70 API)
- 30s: 750 créditos ($2.10 API)
- 60s: 1.500 créditos ($4.20 API)
- 120s: 3.000 créditos ($8.40 API)

## 🖼️ Preços de Imagem (BFL.ai)
- FLUX Schnell (grátis): 5 créditos
- FLUX Dev: 9 créditos ($0.025 API)
- FLUX Pro 1.1: 15 créditos ($0.04 API)
- FLUX Pro 1.0: 18 créditos ($0.05 API)

## 🎵 Preços de TTS (ElevenLabs)
- Multilingual v2: 65 créditos/1k chars ($0.18 API)
- Turbo/Flash v2.5: 33 créditos/1k chars ($0.09 API)

## 🔧 Interface Dinâmica de Vídeo

### Fluxo do Usuário:
1. **Escolhe API/Modelo** → Luma Ray2-Flash, Ray2, Kling Standard, Professional
2. **Escolhe Formato** → Apenas formatos disponíveis para aquela API aparecem
3. **Escolhe Duração** → Apenas durações válidas para aquela combinação aparecem
4. **Vê preço final** → Sistema calcula automaticamente os créditos

### Exemplos de Restrições:
- Ray2-Flash: APENAS 540p e 5 segundos
- Ray2 4K: APENAS disponível em 9 segundos
- Kling Professional: Pode fazer vídeos até 120 segundos!

## ⚠️ Pontos Importantes

1. **Luma NÃO tem flutuação**: São modelos diferentes com preços fixos
2. **Margem 100% garantida**: Mesmo no plano mais barato
3. **Validação automática**: Sistema valida margem antes de processar
4. **Buffer de segurança**: 20% extra em cálculos sensíveis

## 📝 Para Continuar o Projeto

1. **Implementar o CreditSystem** do arquivo `api_implementation_code.md`
2. **Usar a UI dinâmica** do arquivo `video_generation_dynamic_ui.tsx`
3. **Seguir configurações** do arquivo `video_api_config.ts`
4. **Aplicar preços** conforme `api_pricing_strategy.md`

Todos os arquivos estão em: `/mnt/f/site-ia/ai-video-hub/tests/`