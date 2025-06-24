# 🚨 CORREÇÃO URGENTE - Erro 401 Google OAuth

## 1️⃣ Primeiro, descubra qual URL está sendo usada:

Acesse no seu navegador:
```
https://kylo.video/api/debug/oauth
```
ou
```
https://kyloai-production.up.railway.app/api/debug/oauth
```

Anote a URL mostrada em "constructedUrl"

## 2️⃣ No Railway:

1. Acesse: https://railway.app/
2. Vá em **Variables**
3. Defina:
   ```
   NEXTAUTH_URL = [URL do passo 1]
   ```
   
   Exemplo:
   - Se usa domínio: `NEXTAUTH_URL=https://kylo.video`
   - Se não usa: `NEXTAUTH_URL=https://kyloai-production.up.railway.app`

## 3️⃣ No Google Console:

1. Acesse: https://console.cloud.google.com/apis/credentials

2. Clique no seu OAuth client

3. **REMOVA** todas as URLs antigas

4. **ADICIONE APENAS** estas (substitua YOUR_URL pela URL do passo 1):

   **Authorized JavaScript origins:**
   ```
   YOUR_URL
   http://localhost:3000
   ```

   **Authorized redirect URIs:**
   ```
   YOUR_URL/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```

5. Clique em **SAVE**

## 4️⃣ Teste:

1. Aguarde 5 minutos
2. Limpe cookies/cache
3. Acesse YOUR_URL/login
4. Clique em "Continue with Google"

## ⚠️ IMPORTANTE:

O erro 401 acontece quando:
- NEXTAUTH_URL não corresponde à URL real
- Google Console tem URLs diferentes
- Falta o protocolo https:// ou http://

## 🔍 Exemplo Correto:

Se seu site é `https://kylo.video`:

**Railway:**
```
NEXTAUTH_URL=https://kylo.video
```

**Google Console JavaScript origins:**
```
https://kylo.video
http://localhost:3000
```

**Google Console Redirect URIs:**
```
https://kylo.video/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```