# Deploy no Railway

Este guia explica como fazer deploy do KyloAI no Railway.

## Por que Railway?

O Railway é ideal para este projeto porque:
- ✅ Suporta WebSockets nativamente
- ✅ Permite workers em background (BullMQ)
- ✅ Inclui Redis e PostgreSQL
- ✅ Deploy automático via GitHub
- ✅ Preços competitivos
- ✅ SSL automático

## Pré-requisitos

1. Conta no [Railway](https://railway.app)
2. GitHub conectado ao Railway
3. Variáveis de ambiente configuradas

## Passo a Passo

### 1. Criar Novo Projeto no Railway

1. Acesse [railway.app](https://railway.app)
2. Clique em "New Project"
3. Escolha "Deploy from GitHub repo"
4. Selecione o repositório `kyloai`

### 2. Adicionar Serviços

No Railway, adicione os seguintes serviços ao seu projeto:

#### PostgreSQL
1. Click em "New" → "Database" → "PostgreSQL"
2. O Railway criará automaticamente a variável `DATABASE_URL`

#### Redis
1. Click em "New" → "Database" → "Redis"
2. O Railway criará automaticamente a variável `REDIS_URL`

### 3. Configurar Variáveis de Ambiente

No serviço principal (sua aplicação), vá em "Variables" e adicione:

```env
# Obrigatórias
NEXTAUTH_SECRET=gere_com_openssl_rand_-base64_32
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_supabase

# OAuth (se usar)
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret

# Stripe (todos os preços)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_LITE_MONTHLY=price_xxx
# ... adicione todos os outros preços

# APIs de Vídeo
LUMA_API_KEY=sua_luma_key
KLING_API_KEY=sua_kling_key
```

### 4. Configurar Domínio Customizado

1. Vá em "Settings" → "Domains"
2. Adicione seu domínio: `kyloai.xyz`
3. Configure os DNS no seu provedor:
   - CNAME: `@` → `seu-app.up.railway.app`

### 5. Deploy Automático

O Railway fará deploy automático sempre que você fizer push para o branch main.

### 6. Configurar Webhook do Stripe

1. Após o deploy, copie a URL do seu app
2. No Stripe Dashboard, crie um webhook endpoint:
   - URL: `https://kyloai.xyz/api/stripe/webhook`
   - Eventos: `checkout.session.completed`, `invoice.payment_succeeded`, etc.
3. Copie o webhook secret e adicione como `STRIPE_WEBHOOK_SECRET`

## Comandos Úteis

### Ver Logs
```bash
railway logs
```

### Executar Comandos
```bash
railway run npm run prisma:migrate
railway run npm run prisma:studio
```

### Conectar ao Banco
```bash
railway connect postgres
```

## Monitoramento

1. **Logs**: Disponíveis no dashboard do Railway
2. **Métricas**: CPU, Memória, Network no dashboard
3. **Health Check**: Endpoint `/api/health` configurado

## Custos Estimados

- **Hobby Plan**: $5/mês (inclui $5 de créditos)
- **PostgreSQL**: ~$5-10/mês
- **Redis**: ~$5/mês
- **Total**: ~$15-20/mês para começar

## Troubleshooting

### Erro de Build
- Verifique os logs de build no Railway
- Certifique-se que todas as variáveis estão configuradas

### Erro de Conexão com Banco
- Verifique se o PostgreSQL está rodando
- Execute as migrations: `railway run npm run prisma:migrate`

### WebSockets não funcionam
- O Railway suporta WebSockets nativamente
- Verifique se está usando WSS em produção

## Vantagens sobre Vercel

1. **WebSockets**: Funciona sem configuração adicional
2. **Workers**: BullMQ roda nativamente
3. **Banco de Dados**: PostgreSQL e Redis incluídos
4. **Preço**: Mais barato para apps complexos
5. **Logs**: Melhor visualização e histórico

## Próximos Passos

1. Configure monitoring com Sentry
2. Configure backups automáticos do banco
3. Configure CI/CD com testes automatizados