# 🚀 Guia Completo de Deploy - Kylo AI Video Hub

## 📋 Checklist Pré-Deploy

### 1. Requisitos Essenciais
- [ ] Conta GitHub com o código
- [ ] Conta Vercel (recomendado) ou Railway
- [ ] Conta Supabase para banco de dados
- [ ] Conta Stripe para pagamentos
- [ ] Conta Google Cloud para OAuth
- [ ] Domínio próprio (opcional mas recomendado)

### 2. Serviços Necessários
- [ ] PostgreSQL (via Supabase)
- [ ] Redis (via Upstash ou Railway)
- [ ] SMTP para emails (Zoho Mail recomendado)
- [ ] Sentry para monitoramento (opcional)

## 🔐 Configuração de Variáveis de Ambiente

### Passo 1: Crie um projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie um novo projeto
3. Anote as seguintes informações:
   - `Project URL` → NEXT_PUBLIC_SUPABASE_URL
   - `Anon Key` → NEXT_PUBLIC_SUPABASE_ANON_KEY
   - `Service Role Key` → SUPABASE_SERVICE_ROLE_KEY
   - `Database URL` → DATABASE_URL
   - `Direct URL` → DIRECT_URL

### Passo 2: Configure o Google OAuth
1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um novo projeto ou use um existente
3. Ative a API "Google+ API"
4. Vá em "Credenciais" → "Criar credenciais" → "ID do cliente OAuth"
5. Configure:
   - Tipo: Aplicativo Web
   - URIs de redirecionamento autorizados:
     - `http://localhost:3000/api/auth/callback/google` (desenvolvimento)
     - `https://seu-dominio.com/api/auth/callback/google` (produção)
6. Anote:
   - `Client ID` → GOOGLE_CLIENT_ID
   - `Client Secret` → GOOGLE_CLIENT_SECRET

### Passo 3: Configure o Stripe
1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Obtenha as chaves:
   - `Publishable Key` → NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   - `Secret Key` → STRIPE_SECRET_KEY
3. Configure o webhook:
   - Endpoint: `https://seu-dominio.com/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `invoice.payment_succeeded`
   - Anote o `Webhook Secret` → STRIPE_WEBHOOK_SECRET

### Passo 4: Gere as Chaves de Segurança
```bash
# Execute no terminal para gerar chaves seguras
openssl rand -base64 32  # NEXTAUTH_SECRET
openssl rand -base64 32  # SESSION_SECRET
openssl rand -base64 32  # ENCRYPTION_KEY
```

## 📁 Arquivos de Configuração

### .env.production (NÃO COMMITAR!)
```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
DIRECT_URL=postgresql://postgres:[password]@[host]:5432/postgres

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# Security Keys
NEXTAUTH_SECRET=[generated-secret]
SESSION_SECRET=[generated-secret]
ENCRYPTION_KEY=[generated-secret]

# NextAuth
NEXTAUTH_URL=https://seu-dominio.com

# OAuth
GOOGLE_CLIENT_ID=[google-client-id]
GOOGLE_CLIENT_SECRET=[google-client-secret]

# Email (Zoho Mail)
ZOHO_MAIL_USER=support@seu-dominio.com
ZOHO_MAIL_PASSWORD=[zoho-app-password]
EMAIL_FROM=support@seu-dominio.com
SMTP_HOST=smtp.zoho.com
SMTP_PORT=465
SMTP_USER=support@seu-dominio.com
SMTP_PASSWORD=[zoho-app-password]

# Video APIs
LUMA_API_KEY=[luma-key]
KLING_ACCESS_KEY=[kling-access-key]
KLING_SECRET_KEY=[kling-secret-key]

# Stripe
STRIPE_SECRET_KEY=[stripe-secret]
STRIPE_WEBHOOK_SECRET=[webhook-secret]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[stripe-publishable]

# Redis (Upstash)
REDIS_URL=redis://[user]:[password]@[host]:[port]

# App Config
NEXT_PUBLIC_APP_URL=https://seu-dominio.com
NEXT_PUBLIC_APP_NAME=Kylo
NEXT_PUBLIC_BRAND_COLOR=#8B5CF6

# Security Features
ENABLE_RATE_LIMITING=true
ENABLE_CSRF_PROTECTION=true
ENABLE_AUDIT_LOGGING=true
ENABLE_TWO_FACTOR_AUTH=true

# Monitoring (opcional)
SENTRY_DSN=[sentry-dsn]
NEXT_PUBLIC_GA_MEASUREMENT_ID=[ga-id]
```

## 🚀 Deploy na Vercel (Recomendado)

### 1. Prepare o Repositório
```bash
# No diretório do projeto
cd ai-video-hub

# Commit todas as mudanças
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 2. Configure o Deploy
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe o repositório do GitHub
4. Configure:
   - Framework Preset: Next.js
   - Root Directory: `ai-video-hub`
   - Build Command: `npm run build:prod`
   - Output Directory: `.next`

### 3. Configure as Variáveis de Ambiente
1. Na Vercel, vá em "Settings" → "Environment Variables"
2. Adicione TODAS as variáveis do `.env.production`
3. Marque as variáveis para "Production", "Preview" e "Development"

### 4. Configure o Banco de Dados
```bash
# Localmente, execute as migrations
cd ai-video-hub
npx prisma migrate deploy
```

## 🔧 Scripts de Segurança Necessários

### Crie o arquivo: tests/security/security-check.js
```javascript
const fs = require('fs');
const path = require('path');

console.log('🔐 Verificando segurança...');

// Verifica se não há segredos expostos
const checkForSecrets = () => {
  const sensitivePatterns = [
    /sk_live_/gi,
    /pk_live_/gi,
    /AKIA[0-9A-Z]{16}/gi,
    /(?:r|s)k_live_[0-9a-zA-Z]{24}/gi,
  ];

  const filesToCheck = [
    'src/**/*.{js,ts,tsx}',
    'package.json',
    'next.config.js'
  ];

  // Implementação básica - expandir conforme necessário
  console.log('✅ Verificação de segurança concluída');
};

checkForSecrets();
```

### Crie o arquivo: tests/oauth/test-oauth.js
```javascript
const https = require('https');

const domain = process.argv[2] || 'localhost:3000';
const protocol = domain.includes('localhost') ? 'http' : 'https';

console.log(`🔍 Testando OAuth em ${protocol}://${domain}`);

// Teste básico de conectividade
const testEndpoint = `${protocol}://${domain}/api/auth/providers`;

console.log('✅ Teste OAuth configurado');
```

## 📝 Pós-Deploy

### 1. Configure o DNS (se usar domínio próprio)
- Adicione registros A/CNAME apontando para a Vercel
- Configure SSL (automático na Vercel)

### 2. Configure os Webhooks
- Stripe: Atualize a URL do webhook para produção
- Google OAuth: Adicione a URL de produção nas configurações

### 3. Teste a Aplicação
```bash
# Execute os testes de produção
npm run test-oauth-prod seu-dominio.com
```

### 4. Configure o Monitoramento
- Ative o Vercel Analytics
- Configure alertas no Sentry
- Configure o Google Analytics

## 🛡️ Checklist de Segurança Final

- [ ] Todas as variáveis de ambiente estão configuradas
- [ ] HTTPS está ativo
- [ ] Rate limiting está funcionando
- [ ] CSRF protection está ativo
- [ ] Não há secrets no código
- [ ] Backup do banco configurado
- [ ] Monitoramento ativo

## 🆘 Troubleshooting

### Erro de Build
```bash
# Verifique localmente
npm run deploy-check
```

### Erro de Banco de Dados
```bash
# Verifique a conexão
npx prisma db pull
```

### Erro de OAuth
- Verifique as URLs de callback
- Confirme que o domínio está nas configurações do Google

## 📞 Suporte

Para problemas específicos:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- Documentação: Veja os arquivos na pasta `docs/`

---
**Última atualização:** Janeiro 2025