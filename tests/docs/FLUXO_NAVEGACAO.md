# Fluxo de Navegação - Kylo

## Estrutura de Páginas

### 1. Página Principal (`/`)
- **Arquivo**: `/src/app/page.tsx` + `/src/app/page-original.tsx`
- **Comportamento**:
  - **Usuário não logado**: Mostra landing page completa (KyloAI)
  - **Usuário logado**: Redireciona automaticamente para `/studio/video`

### 2. Página de Login (`/login`)
- **Arquivo**: `/src/app/(auth)/login/page.tsx`
- **Após login bem-sucedido**: Redireciona para `/studio/video`
- **Métodos de login**:
  - Email/senha
  - Google OAuth

### 3. Página de Registro (`/register`)
- **Arquivo**: `/src/app/(auth)/register/page.tsx`
- **Após registro**: 
  - Cria conta com 300 créditos
  - Envia email de boas-vindas
  - Redireciona para `/studio/video`

### 4. Studio - Dashboard Novo (`/studio/video`)
- **Arquivo**: `/src/app/studio/video/page.tsx`
- **Layout**: `/src/app/studio/layout.tsx`
- **Características**:
  - Interface minimalista estilo Hedra
  - Sidebar apenas com ícones
  - Créditos no canto inferior esquerdo
  - Área central para criação de vídeos

## Fluxo de Redirecionamento

```
Usuário não logado:
/ (landing page) → /login → /studio/video

Usuário logado:
/ → /studio/video (redirecionamento automático)
/login → /studio/video (após login)
/register → /studio/video (após criar conta)
```

## URLs Importantes

- **Página Principal**: http://localhost:3000/
- **Login**: http://localhost:3000/login
- **Registro**: http://localhost:3000/register
- **Studio (Dashboard)**: http://localhost:3000/studio/video
- **Configurações**: http://localhost:3000/settings
- **Histórico**: http://localhost:3000/dashboard

## Verificação Rápida

1. **Teste sem login**:
   - Acesse http://localhost:3000/
   - Deve ver a landing page completa

2. **Teste com login**:
   - Faça login em http://localhost:3000/login
   - Deve ser redirecionado para http://localhost:3000/studio/video
   - Ao acessar http://localhost:3000/ novamente, deve redirecionar automaticamente para /studio/video

3. **Teste de logout**:
   - Faça logout
   - Deve voltar a ver a landing page em http://localhost:3000/