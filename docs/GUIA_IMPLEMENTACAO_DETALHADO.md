# Guia Detalhado de Implementação - Sistema de APIs de Vídeo

## 📁 ARQUIVOS CRIADOS

### 1. Arquivos SQL (Banco de Dados)
```
/mnt/f/site-ia/ai-video-hub/tests/supabase_video_api_schema.sql
/mnt/f/site-ia/ai-video-hub/tests/supabase_video_api_data.sql
/mnt/f/site-ia/ai-video-hub/tests/supabase_api_queries.sql
```

### 2. Arquivos TypeScript/React
```
/mnt/f/site-ia/ai-video-hub/src/lib/supabase/video-api-client.ts
/mnt/f/site-ia/ai-video-hub/src/components/video/video-generation-dynamic.tsx
```

### 3. Arquivos de Documentação
```
/mnt/f/site-ia/ai-video-hub/tests/api_pricing_strategy.md
/mnt/f/site-ia/ai-video-hub/tests/api_matrix.md
/mnt/f/site-ia/ai-video-hub/tests/api_recommendations.md
/mnt/f/site-ia/ai-video-hub/tests/api_implementation_code.md
/mnt/f/site-ia/ai-video-hub/tests/video_generation_dynamic_ui.tsx
/mnt/f/site-ia/ai-video-hub/tests/video_api_config.ts
/mnt/f/site-ia/ai-video-hub/tests/PROJECT_CONTEXT_SUMMARY.md
/mnt/f/site-ia/ai-video-hub/tests/IMPLEMENTACAO_COMPLETA.md
```

---

## 🚀 PASSO A PASSO COMPLETO

### PASSO 1: Configurar Variáveis de Ambiente

1. Navegue até a pasta do projeto:
```bash
cd /mnt/f/site-ia/ai-video-hub
```

2. Crie ou edite o arquivo `.env.local`:
```bash
cp .env-backup/.env.local .env.local
```

OU se não existir o backup, crie manualmente:
```bash
nano .env.local
```

3. Adicione estas variáveis (já encontradas no backup):
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://snfxczgjpnydysccigps.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZnhjemdqcG55ZHlzY2NpZ3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzY2NjksImV4cCI6MjA2NTk1MjY2OX0.OY-wNhs-K9HJks1mCbWYHDXvVIICHgCsaGnSk3Jx6Rw
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZnhjemdqcG55ZHlzY2NpZ3BzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDM3NjY2OSwiZXhwIjoyMDY1OTUyNjY5fQ.LTFYGslmETIOeaIzfR4NV9cWQyXfkvesLNEeJEdvsHw

# Database
DATABASE_URL=postgresql://postgres.snfxczgjpnydysccigps:Lk6289asqwa@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

### PASSO 2: Executar SQLs no Supabase

1. **Acesse o Supabase Dashboard**:
   - URL: https://supabase.com/dashboard
   - Faça login
   - Selecione o projeto: `snfxczgjpnydysccigps`

2. **Vá para o SQL Editor**:
   - Menu lateral → SQL Editor
   - Clique em "New Query"

3. **Execute o PRIMEIRO SQL (Schema)**:
   - Copie TODO o conteúdo de: `/mnt/f/site-ia/ai-video-hub/tests/supabase_video_api_schema.sql`
   - Cole no editor SQL
   - Clique em "Run"
   - Deve aparecer "Success" sem erros

4. **Execute o SEGUNDO SQL (Dados)**:
   - Clique em "New Query" novamente
   - Copie TODO o conteúdo de: `/mnt/f/site-ia/ai-video-hub/tests/supabase_video_api_data.sql`
   - Cole no editor SQL
   - Clique em "Run"
   - Deve aparecer "Success" sem erros

5. **OPCIONAL - Teste as queries**:
   - Use as queries de: `/mnt/f/site-ia/ai-video-hub/tests/supabase_api_queries.sql`
   - Execute uma por vez para verificar se os dados foram inseridos

---

### PASSO 3: Instalar Dependências (se necessário)

1. Navegue até a pasta do projeto:
```bash
cd /mnt/f/site-ia/ai-video-hub
```

2. Instale as dependências:
```bash
pnpm install
```

3. Se der erro com o Supabase client:
```bash
pnpm add @supabase/supabase-js
```

---

### PASSO 4: Implementar no Código

1. **Verifique se os arquivos foram copiados corretamente**:

Cliente TypeScript deve estar em:
```
/mnt/f/site-ia/ai-video-hub/src/lib/supabase/video-api-client.ts
```

Componente React deve estar em:
```
/mnt/f/site-ia/ai-video-hub/src/components/video/video-generation-dynamic.tsx
```

2. **Adicione o componente em uma página**:

Edite ou crie: `/mnt/f/site-ia/ai-video-hub/src/app/(dashboard)/videos/generate/page.tsx`

```typescript
import { VideoGenerationDynamic } from '@/components/video/video-generation-dynamic';

export default function GenerateVideoPage() {
  return (
    <div className="container max-w-4xl py-6">
      <h1 className="text-3xl font-bold mb-6">Gerar Novo Vídeo</h1>
      <VideoGenerationDynamic />
    </div>
  );
}
```

---

### PASSO 5: Criar a Rota da API

Crie o arquivo: `/mnt/f/site-ia/ai-video-hub/src/app/api/videos/generate/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/utils';
import { VideoAPIClient } from '@/lib/supabase/video-api-client';

export async function POST(req: NextRequest) {
  try {
    // Autenticação
    const session = await requireAuth(req);
    const userId = session.user.id;

    // Pegar dados da requisição
    const body = await req.json();
    const { api_id, provider, model, format, duration, credits } = body;

    // Validar se a combinação é válida
    const isValid = await VideoAPIClient.isValidCombination(api_id, format, duration);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Combinação inválida' },
        { status: 400 }
      );
    }

    // TODO: Implementar chamada real para as APIs
    // TODO: Verificar créditos do usuário
    // TODO: Deduzir créditos
    // TODO: Criar job no banco

    return NextResponse.json({
      id: 'video_' + Date.now(),
      status: 'processing',
      message: 'Vídeo sendo processado'
    });

  } catch (error) {
    console.error('Erro:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
```

---

### PASSO 6: Testar a Implementação

1. **Inicie o servidor de desenvolvimento**:
```bash
cd /mnt/f/site-ia/ai-video-hub
pnpm dev
```

2. **Acesse no navegador**:
```
http://localhost:3000/videos/generate
```

3. **O que deve aparecer**:
   - Interface com 4 etapas
   - Dropdown com as APIs (Luma Ray2-Flash, Ray2, Kling Standard, Professional)
   - Ao selecionar uma API, aparecem as opções de proporção
   - Ao selecionar proporção, aparecem as resoluções
   - Ao selecionar resolução, aparecem as durações com preços

---

### PASSO 7: Verificar no Banco de Dados

1. **No Supabase Dashboard**:
   - Menu lateral → Table Editor
   - Verifique as tabelas:
     - `video_apis` (4 registros)
     - `video_formats` (8 registros)
     - `video_pricing` (19 registros)
     - `video_aspect_ratios` (8 registros)

2. **Teste uma query**:
```sql
SELECT * FROM video_apis WHERE is_active = true;
```

---

## 🔧 TROUBLESHOOTING

### Erro: "Cannot find module '@supabase/supabase-js'"
```bash
pnpm add @supabase/supabase-js
```

### Erro: "Missing SUPABASE_SERVICE_ROLE_KEY"
- Verifique se o `.env.local` foi criado corretamente
- Reinicie o servidor: `Ctrl+C` e `pnpm dev`

### Erro ao executar SQL
- Verifique se está executando na ordem correta (schema primeiro, dados depois)
- Se der erro de "table already exists", ignore e continue

### Interface não carrega dados
- Verifique no console do navegador (F12)
- Confirme que as variáveis de ambiente estão corretas
- Teste a conexão com o Supabase

---

## ✅ CHECKLIST FINAL

- [ ] Variáveis de ambiente configuradas
- [ ] SQLs executados no Supabase (schema + data)
- [ ] Arquivos TypeScript no lugar correto
- [ ] Componente adicionado em uma página
- [ ] Servidor rodando sem erros
- [ ] Interface carregando dados do banco
- [ ] Seleção em cascata funcionando
- [ ] Preços aparecendo corretamente

---

## 📝 PRÓXIMOS PASSOS

1. **Adicionar campo de prompt** no componente
2. **Implementar validação de créditos** do usuário
3. **Conectar com APIs reais** (Luma e Kling)
4. **Adicionar sistema de filas** para processar vídeos
5. **Implementar webhook** para atualizar status