# CONTEXTO COMPLETO DA SESSÃO - AI VIDEO HUB

## 🎯 OBJETIVO PRINCIPAL
Implementar sistema de geração de mídia (vídeo, imagem, áudio) com interface dinâmica estilo dropdown expansível, integrando TODAS as APIs disponíveis (Luma, Kling, BFL, ElevenLabs) com TODOS os seus modelos.

## 📋 REQUISITOS ESPECÍFICOS DO USUÁRIO

### Interface Visual (baseada em Screenshot_3.png):
1. **Design dark mode** com fundo #0a0a0a
2. **Dropdowns expansíveis** com ícone de seta (ChevronDown)
3. **Seleção em 5 etapas**:
   - API → Modelo → Aspect Ratio → Resolução → Duração
4. **Custo total em créditos** exibido no final
5. **Contador de créditos** no canto inferior esquerdo (◐ 300)
6. **Avatar do usuário** no canto inferior direito

### Estrutura de Seleção:
```
1. Selecionar API (Luma, Kling, BFL, ElevenLabs)
2. Selecionar Modelo específico daquela API
3. Selecionar Aspect Ratio (16:9, 1:1, 9:16, etc)
4. Selecionar Resolução/Formato
5. Selecionar Duração (vídeos) ou Voz (áudio)
```

## 📊 DADOS COMPLETOS DAS APIS

### LUMA LABS
- **Ray2-Flash**: 540p apenas, 5s, 50 créditos
- **Ray2**: 720p/1080p/4K, 5-9s, 253-613 créditos
- **Ray 1.6**: Legacy, pixel-based pricing

### KLING AI (6 modelos)
- **1.0**: Original, até 1080p, 5-10s
- **1.1**: Better motion, até 1080p, 5-10s
- **1.2**: Latest stable, até 1080p, 5-15s
- **2.0**: Next gen, até 4K, 5-30s
- **2.1**: Latest AI, até 4K, 5-30s
- **Professional**: Cinema quality, até 4K, 5-120s

### BFL.AI (Imagens)
- **FLUX Schnell**: Grátis, 5 créditos (taxa serviço)
- **FLUX Dev**: 9 créditos
- **FLUX 1.1 Pro**: 15 créditos
- **FLUX 1.0 Pro**: 18 créditos
- **FLUX Ultra**: 36-43 créditos
- **FLUX Raw**: 25 créditos

### ELEVENLABS (Áudio/TTS)
- **Multilingual V2**: 65 créd/1000 chars, 29 idiomas
- **Turbo V2.5**: 33 créd/1000 chars, fast
- **Flash V2.5**: 33 créd/1000 chars, ultra-fast

## 💰 SISTEMA DE PRECIFICAÇÃO

### Base de Cálculo:
- **Margem mínima**: 100% sobre o plano mais barato
- **Plano base**: $90/16000 créditos = $0.005625/crédito
- **Custo máximo permitido**: $0.0028125 por crédito

### Planos de Créditos:
```
Mensais: 
- Básico: $8/1000 créditos
- Popular: $26/4000 créditos  
- Pro: $68/12000 créditos

Avulsos:
- $8/1000, $18/2500, $45/7000, $90/16000
```

## 🗄️ ESTRUTURA DO BANCO DE DADOS

### Tabelas Criadas (Supabase):
```sql
- media_apis (todas APIs: vídeo, imagem, áudio)
- media_formats (formatos suportados)
- media_pricing (preços com margem garantida)
- media_aspect_ratios (proporções)
- media_features (features extras)
```

### Campos Importantes:
- `duration`: segundos (vídeo), 0 (imagem), 1000 (áudio/chars)
- `credits`: calculado com margem 100%
- `api_cost`: custo real em USD

## 📁 ARQUIVOS CRIADOS NA SESSÃO

### 1. SQLs Principais:
```
/mnt/f/site-ia/ai-video-hub/tests/supabase_video_api_schema.sql
/mnt/f/site-ia/ai-video-hub/tests/supabase_video_api_data.sql
/mnt/f/site-ia/ai-video-hub/tests/supabase_video_api_data_v2.sql
/mnt/f/site-ia/ai-video-hub/tests/supabase_complete_api_data.sql ← MAIS RECENTE
/mnt/f/site-ia/ai-video-hub/tests/supabase_api_queries.sql
```

### 2. Componentes React:
```
/mnt/f/site-ia/ai-video-hub/src/components/video/video-generation-dynamic.tsx
/mnt/f/site-ia/ai-video-hub/src/components/video/video-generation-advanced.tsx
/mnt/f/site-ia/ai-video-hub/src/components/video/video-generation-studio.tsx
/mnt/f/site-ia/ai-video-hub/src/components/video/media-generation-studio.tsx ← MAIS RECENTE
```

### 3. Cliente Supabase:
```
/mnt/f/site-ia/ai-video-hub/src/lib/supabase/video-api-client.ts (server)
/mnt/f/site-ia/ai-video-hub/src/lib/supabase/video-api-client-browser.ts (browser)
```

### 4. Páginas:
```
/mnt/f/site-ia/ai-video-hub/src/app/videos/page.tsx
/mnt/f/site-ia/ai-video-hub/src/app/test-video/page.tsx
/mnt/f/site-ia/ai-video-hub/src/app/(dashboard)/generate/page.tsx
/mnt/f/site-ia/ai-video-hub/src/app/studio/video/generate/page.tsx
/mnt/f/site-ia/ai-video-hub/src/app/studio/create/page.tsx ← MAIS RECENTE
```

### 5. Documentação:
```
/mnt/f/site-ia/ai-video-hub/tests/api_matrix.md
/mnt/f/site-ia/ai-video-hub/tests/api_pricing_strategy.md
/mnt/f/site-ia/ai-video-hub/tests/api_recommendations.md
/mnt/f/site-ia/ai-video-hub/tests/GUIA_IMPLEMENTACAO_DETALHADO.md
/mnt/f/site-ia/ai-video-hub/tests/IMPLEMENTACAO_COMPLETA.md
```

## 🔧 CONFIGURAÇÕES APLICADAS

### Variáveis de Ambiente (.env.local):
```env
NEXT_PUBLIC_SUPABASE_URL=https://snfxczgjpnydysccigps.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Middleware Temporário:
- Simplificado para permitir testes
- Rota `/videos` temporariamente pública
- Backup original em: `src/middleware.ts.bak2`

## ⚠️ PROBLEMAS ENCONTRADOS E SOLUÇÕES

1. **Erro de hidratação React**
   - Causa: Variáveis de ambiente no cliente
   - Solução: Criado `video-api-client-browser.ts`

2. **Middleware bloqueando rotas**
   - Solução temporária: Simplificado para testes
   - IMPORTANTE: Restaurar antes da produção

3. **Estrutura do Kylo Studio**
   - Localização correta: `/studio/video` (após login)
   - Salvos detalhes no MCP Memory

## 📌 ESTADO ATUAL

### ✅ Implementado:
1. Interface com dropdowns expansíveis idêntica ao screenshot
2. Todas as APIs com todos os modelos
3. Cálculo dinâmico de créditos
4. Suporte para vídeo, imagem e áudio
5. SQLs com margem 100% garantida

### ⏳ Pendente:
1. Executar SQLs no Supabase Dashboard
2. Conectar componente com dados reais do Supabase
3. Implementar rota `/api/videos/generate`
4. Adicionar campo de prompt acima dos dropdowns
5. Conectar com APIs reais (Luma, Kling, etc)

## 🎯 PRÓXIMOS PASSOS IMEDIATOS

1. **Executar no Supabase**:
   ```
   https://supabase.com/dashboard/project/snfxczgjpnydysccigps/sql
   Execute: supabase_complete_api_data.sql
   ```

2. **Testar interface**:
   ```
   http://localhost:3000/studio/create
   ```

3. **Conectar com Supabase real**:
   - Modificar `media-generation-studio.tsx`
   - Remover dados mockados
   - Usar `VideoAPIClient`

## 💡 NOTAS IMPORTANTES

1. **MCP Memory** contém:
   - Proteção de rotas (restaurar antes de produção)
   - Estrutura do Kylo Studio
   - Estratégia de precificação

2. **Diretório de trabalho**: `/mnt/f/site-ia/ai-video-hub`

3. **Servidor rodando em**: http://localhost:3000

4. **Screenshot referência**: `/mnt/c/Users/leona/OneDrive/Área de Trabalho/Screenshot_3.png`

---

## 🔄 PARA CONTINUAR NO PRÓXIMO CONTEXTO

Este arquivo contém TUDO que foi feito na sessão. Para continuar:

1. Mostre este arquivo: `/mnt/f/site-ia/ai-video-hub/tests/CONTEXTO_COMPLETO_SESSAO.md`
2. Mencione: "Continuando implementação do AI Video Hub"
3. Indique o próximo passo desejado

O arquivo está pronto para ser usado como referência completa!