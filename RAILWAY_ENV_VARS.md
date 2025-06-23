# Variáveis de Ambiente Necessárias no Railway

## 🚨 CONFIGURAÇÃO URGENTE PARA KYLO.VIDEO

### Variáveis Essenciais para OAuth Funcionar:

```env
# URLs do Aplicativo (USE SEU DOMÍNIO!)
NEXTAUTH_URL=https://kylo.video
NEXT_PUBLIC_APP_URL=https://kylo.video

# IMPORTANTE: Adicione esta variável para resolver problemas de redirecionamento
AUTH_TRUST_HOST=true

# Google OAuth
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-secret

# Segurança
NEXTAUTH_SECRET=gere-uma-string-aleatoria-segura
```

### Por que AUTH_TRUST_HOST=true?

Esta variável diz ao NextAuth para confiar no host header enviado pelo proxy reverso (Railway). Sem ela, o NextAuth pode usar localhost como URL base, causando os redirecionamentos incorretos.

### Checklist de Configuração:

1. **No Railway:**
   - [ ] `NEXTAUTH_URL` = `https://kylo.video`
   - [ ] `NEXT_PUBLIC_APP_URL` = `https://kylo.video`
   - [ ] `AUTH_TRUST_HOST` = `true`
   - [ ] Todas as outras variáveis de ambiente necessárias

2. **No Google Console:**
   - [ ] Authorized JavaScript origins: `https://kylo.video`
   - [ ] Authorized redirect URIs: `https://kylo.video/api/auth/callback/google`

3. **Verificação:**
   ```bash
   # Teste se a API está respondendo
   curl https://kylo.video/api/health
   
   # Verifique os headers
   curl -I https://kylo.video
   ```

### Problema Comum: Redirecionamento para localhost

Se ainda estiver redirecionando para localhost após configurar tudo:

1. Limpe TODOS os cookies do domínio kylo.video
2. Teste em uma aba anônima
3. Verifique se o deploy foi concluído no Railway
4. Aguarde 2-3 minutos para as variáveis de ambiente serem aplicadas

### Variáveis Completas Recomendadas:

```env
# App
NEXTAUTH_URL=https://kylo.video
NEXT_PUBLIC_APP_URL=https://kylo.video
AUTH_TRUST_HOST=true
NODE_ENV=production

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=sua-chave-secreta
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Email
EMAIL_FROM=noreply@kylo.video
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASSWORD=...

# APIs
STRIPE_SECRET_KEY=...
LUMA_API_KEY=...
# etc...
```

## Ação Imediata:

1. Vá ao Railway
2. Adicione `AUTH_TRUST_HOST=true`
3. Verifique se `NEXTAUTH_URL=https://kylo.video`
4. Deploy
5. Teste em aba anônima!