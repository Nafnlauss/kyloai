# 🔒 Sistema de Proteção de Rotas - Kylo.video

## Configuração Atual

### ✅ Rotas PÚBLICAS (Acessíveis sem login):
- `/` - Landing page
- `/login` - Página de login
- `/register` - Página de cadastro
- `/reset` - Recuperação de senha
- `/privacy` - Política de privacidade
- `/terms` - Termos de serviço
- `/about` - Sobre nós
- `/contact` - Contato
- `/api/auth/*` - APIs de autenticação
- `/api/health` - Health check
- `/api/contact` - Formulário de contato
- `/api/stripe/webhook` - Webhooks do Stripe

### 🔒 Rotas PROTEGIDAS (Requerem login):

#### Studio & Criação
- `/studio/*` - TODAS as páginas do studio
- `/studio/video` - Criação de vídeos
- `/studio/image` - Criação de imagens
- `/studio/audio` - Criação de áudio
- `/studio/history` - Histórico

#### Usuário & Conta
- `/dashboard/*` - Dashboard do usuário
- `/settings` - Configurações da conta
- `/gallery` - Galeria de criações
- `/generate` - Página de geração
- `/billing` - Faturamento
- `/credits/*` - Gerenciamento de créditos
- `/membership` - Planos e assinatura

#### Páginas de Teste/Debug (PROTEGIDAS!)
- `/diagnostics` - Diagnósticos
- `/health` - Página de saúde
- `/hello` - Página de teste
- `/landing-complete` - Landing alternativa
- `/landing` - Landing alternativa
- `/pricing` - Preços
- `/pricing-new` - Novos preços
- `/test-buttons` - Botões de teste

#### Administração
- `/admin/*` - TODAS as páginas admin
- `/admin/overview` - Visão geral
- `/admin/users` - Gerenciar usuários
- `/admin/videos` - Gerenciar vídeos
- `/admin/payments` - Pagamentos
- `/admin/plans` - Planos
- `/admin/logs` - Logs

#### APIs Protegidas
- `/api/user/*` - Todas as APIs do usuário
- `/api/videos/*` - APIs de vídeos
- `/api/admin/*` - APIs administrativas
- `/api/stripe/*` (exceto webhook)
- `/api/payments/*`

## Como Funciona

1. **Usuário tenta acessar qualquer rota não listada como pública**
2. **Middleware verifica se há token de autenticação**
3. **Se não há token → Redireciona para `/login`**
4. **Se há token → Permite acesso**

## Exemplos de Proteção

❌ **Sem login:**
- `/studio/video` → Redireciona para `/login?callbackUrl=/studio/video`
- `/membership` → Redireciona para `/login?callbackUrl=/membership`
- `/pricing` → Redireciona para `/login?callbackUrl=/pricing`

✅ **Sem login (permitido):**
- `/` → Mostra landing page
- `/login` → Mostra página de login
- `/about` → Mostra sobre nós

## Teste de Segurança

Para testar se está funcionando:

1. Abra uma aba anônima
2. Tente acessar:
   - `https://kylo.video/studio/video` ❌
   - `https://kylo.video/membership` ❌
   - `https://kylo.video/pricing` ❌
   - `https://kylo.video/` ✅

Todas devem redirecionar para login, exceto a landing page!

## ⚠️ IMPORTANTE

- NUNCA adicione rotas sensíveis à lista de `publicPaths`
- Sempre teste em aba anônima após mudanças
- O middleware protege TUDO por padrão, exceto o que está explicitamente público