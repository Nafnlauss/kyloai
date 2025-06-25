# 🔧 Correção OAuth Google em Produção - Kylo.video

## 🔍 Diagnóstico do Problema

O OAuth funciona em localhost mas falha em produção. Isso geralmente ocorre por:

1. **URLs de callback incorretas** no Google Console
2. **Variável NEXTAUTH_URL** incorreta em produção
3. **Cookies seguros** não funcionando corretamente
4. **Domínio com/sem www** não configurado

## ✅ Checklist de Correção

### 1. Google Cloud Console

Acesse: https://console.cloud.google.com/apis/credentials

Configure EXATAMENTE estas URLs:

**Origens JavaScript autorizadas:**
```
https://kylo.video
https://www.kylo.video
http://localhost:3000
```

**URIs de redirecionamento autorizados:**
```
https://kylo.video/api/auth/callback/google
https://www.kylo.video/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

### 2. Variáveis de Ambiente em Produção

Na Vercel/Railway, configure:

```env
# CRUCIAL: Sem barra final!
NEXTAUTH_URL=https://kylo.video

# Suas credenciais do Google
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret

# Secret do NextAuth (gere um novo)
NEXTAUTH_SECRET=gere-com-openssl-rand-base64-32
```

### 3. Verificação Rápida

Acesse: https://kylo.video/api/debug/oauth-temp

Verifique se todas as variáveis estão "SET".

### 4. Configuração do auth-options.ts

O arquivo já está configurado corretamente com:
- `trustHost: true` ✅
- `useSecureCookies` em produção ✅
- `allowDangerousEmailAccountLinking: false` ✅

## 🛠️ Script de Verificação

Crie um arquivo `test-oauth-prod.js`:

```javascript
const https = require('https');

async function testOAuth() {
  console.log('🔍 Testando OAuth em produção...\n');
  
  // Test 1: Provider check
  const providers = await fetch('https://kylo.video/api/auth/providers')
    .then(r => r.json())
    .catch(e => ({ error: e.message }));
    
  console.log('✅ Providers:', providers);
  
  // Test 2: Callback URL
  const callback = await fetch('https://kylo.video/api/auth/callback/google')
    .then(r => ({ status: r.status, url: r.url }))
    .catch(e => ({ error: e.message }));
    
  console.log('✅ Callback response:', callback);
  
  // Test 3: Debug endpoint
  const debug = await fetch('https://kylo.video/api/debug/oauth-temp')
    .then(r => r.json())
    .catch(e => ({ error: e.message }));
    
  console.log('✅ Debug info:', JSON.stringify(debug, null, 2));
}

testOAuth();
```

## 🔐 Possíveis Erros e Soluções

### Erro: "redirect_uri_mismatch"
**Solução**: A URL de callback DEVE ser exatamente igual no Google Console e na aplicação.

### Erro: "Access blocked: This app's request is invalid"
**Solução**: 
1. Verifique se o app está publicado (não em modo teste)
2. Adicione o domínio verificado no Google Console

### Erro: "Cookies not being set"
**Solução**: 
1. Certifique-se que está usando HTTPS
2. Verifique se `trustHost: true` está configurado

### Erro: Redirecionamento infinito
**Solução**:
1. Limpe cookies do navegador
2. Teste em aba anônima
3. Verifique se NEXTAUTH_URL não tem barra final

## 🚀 Passos para Aplicar a Correção

1. **No Google Console:**
   - Remova TODAS as URLs antigas
   - Adicione APENAS as URLs listadas acima
   - Salve e aguarde 5 minutos

2. **Na Vercel/Railway:**
   - Atualize NEXTAUTH_URL para `https://kylo.video` (sem barra final)
   - Verifique se GOOGLE_CLIENT_ID e SECRET estão corretos
   - Faça redeploy

3. **Teste:**
   - Limpe todos os cookies do site
   - Abra uma aba anônima
   - Acesse https://kylo.video/login
   - Clique em "Sign in with Google"

4. **Após funcionar:**
   - REMOVA o endpoint de debug: `src/app/api/debug/oauth-temp/route.ts`
   - Faça commit e deploy

## 📝 Código de Teste Manual

```bash
# Teste as URLs diretamente
curl https://kylo.video/api/auth/providers
curl -I https://kylo.video/api/auth/callback/google
curl https://kylo.video/api/debug/oauth-temp
```

## ⚠️ IMPORTANTE

Após resolver o problema:
1. Delete o arquivo `/api/debug/oauth-temp/route.ts`
2. Este endpoint expõe informações sensíveis!

---

**Última atualização:** Use este guia imediatamente para corrigir o OAuth em produção.