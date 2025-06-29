# 📋 GUIA DE CONFIGURAÇÃO DAS CHAVES DE API

## 🔑 APIs JÁ CONFIGURADAS

### 1. Luma Labs ✅
- **Chave**: `LUMA_API_KEY`
- **Status**: Já configurada no .env
- **Documentação**: https://docs.lumalabs.ai/docs/welcome

### 2. Kling AI ✅
- **Chaves**: 
  - `KLING_ACCESS_KEY`
  - `KLING_SECRET_KEY`
  - `KLING_API_KEY`
- **Status**: Já configuradas no .env
- **Documentação**: https://app.klingai.com/global/dev/document-api/apiReference

## 🆕 NOVAS APIs PARA CONFIGURAR

### 3. Black Forest Labs (BFL) - FLUX
- **Chave**: `BFL_API_KEY`
- **Como obter**:
  1. Acesse: https://docs.bfl.ai/quick_start/introduction
  2. Crie uma conta em: https://api.bfl.ai/
  3. Vá para Dashboard → API Keys
  4. Gere uma nova API key
  5. Copie e cole no .env e .env.local

### 4. ElevenLabs
- **Chave**: `ELEVENLABS_API_KEY`
- **Como obter**:
  1. Acesse: https://elevenlabs.io/
  2. Faça login ou crie uma conta
  3. Vá para: https://elevenlabs.io/app/settings/api-keys
  4. Clique em "Create API Key"
  5. Copie e cole no .env e .env.local

### 5. PiAPI
- **Chave**: `PIAPI_API_KEY`
- **Como obter**:
  1. Acesse: https://piapi.ai/
  2. Crie uma conta
  3. Vá para: https://piapi.ai/dashboard/api-keys
  4. Gere uma nova API key
  5. Copie e cole no .env e .env.local
- **Nota**: PiAPI pode requerer tokens adicionais para alguns serviços:
  - `PIAPI_MIDJOURNEY_TOKEN` (opcional)
  - `PIAPI_SUNO_TOKEN` (opcional)

### 6. Newport AI
- **Chaves**:
  - `NEWPORT_API_KEY` (principal)
  - `NEWPORT_CLIENT_ID` (opcional)
  - `NEWPORT_SECRET_KEY` (opcional)
- **Como obter**:
  1. Acesse: https://api.newportai.com/
  2. Crie uma conta
  3. Vá para: https://api.newportai.com/dashboard
  4. Gere suas credenciais de API
  5. Copie e cole no .env e .env.local

## 📁 ONDE ADICIONAR AS CHAVES

### 1. `/mnt/f/site-ia/ai-video-hub/.env`
```env
# New AI APIs
# Black Forest Labs (BFL) - FLUX Image Generation
# Get your API key at: https://docs.bfl.ai/quick_start/introduction
BFL_API_KEY=sua_chave_aqui

# ElevenLabs - Text to Speech
# Get your API key at: https://elevenlabs.io/app/settings/api-keys
ELEVENLABS_API_KEY=sua_chave_aqui

# PiAPI - Multiple AI Services
# Get your API key at: https://piapi.ai/dashboard/api-keys
PIAPI_API_KEY=sua_chave_aqui

# Newport AI - AI Models
# Get your API key at: https://api.newportai.com/dashboard
NEWPORT_API_KEY=sua_chave_aqui
# Optional: Some NewportAI endpoints may require additional auth
NEWPORT_CLIENT_ID=
NEWPORT_SECRET_KEY=
```

### 2. `/mnt/f/site-ia/ai-video-hub/.env.local`
- Copie exatamente as mesmas chaves do .env

### 3. Outros arquivos que podem precisar de atualização:

#### `/mnt/f/site-ia/ai-video-hub/src/lib/video-providers/index.ts`
- Pode precisar importar as novas chaves de ambiente
- Adicionar configurações para as novas APIs

#### `/mnt/f/site-ia/ai-video-hub/src/types/api.ts`
- Pode precisar adicionar tipos TypeScript para as novas APIs

## 🚀 PRÓXIMOS PASSOS APÓS CONFIGURAR AS CHAVES

1. **Testar conexão com cada API**:
   ```bash
   cd /mnt/f/site-ia/ai-video-hub
   pnpm dev
   ```

2. **Implementar providers para cada API**:
   - BFL Provider em `src/lib/video-providers/bfl-provider.ts`
   - ElevenLabs Provider em `src/lib/video-providers/elevenlabs-provider.ts`
   - PiAPI Provider em `src/lib/video-providers/piapi-provider.ts`
   - NewportAI Provider em `src/lib/video-providers/newportai-provider.ts`

3. **Atualizar rota de geração**:
   - `/src/app/api/videos/generate/route.ts`

## ⚠️ IMPORTANTE

1. **Nunca commite as chaves no Git**
   - .env e .env.local devem estar no .gitignore

2. **Para produção (Vercel)**:
   - Adicione as mesmas variáveis em: https://vercel.com/[seu-projeto]/settings/environment-variables

3. **Limites de Rate**:
   - BFL: Verifique limites em sua conta
   - ElevenLabs: 10,000 caracteres/mês (free tier)
   - PiAPI: Depende do plano
   - NewportAI: Depende do plano

## 📚 DOCUMENTAÇÃO OFICIAL DAS APIs

1. **Luma Labs**: https://docs.lumalabs.ai/docs/api
2. **Kling AI**: https://app.klingai.com/global/dev/document-api/apiReference
3. **BFL (FLUX)**: https://docs.bfl.ai/api_reference/flux_1_1_pro
4. **ElevenLabs**: https://elevenlabs.io/docs/api-reference/text-to-speech
5. **PiAPI**: https://piapi.ai/docs/api-reference
6. **Newport AI**: https://api.newportai.com/api-reference

---

**Arquivo criado em**: Dezembro 2024
**Última atualização**: Para configuração dos 85 modelos de IA