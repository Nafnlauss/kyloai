# 🚨 CORREÇÃO GOOGLE OAUTH 401 EM PRODUÇÃO

## 📋 **DIAGNÓSTICO RÁPIDO**

### **1. Execute o teste automático:**
```bash
npm run test-oauth-prod
```

### **2. Ou use o endpoint de debug temporário:**
1. Copie `tests/oauth/debug-endpoint.ts` para `src/app/api/debug/oauth-temp/route.ts`
2. Acesse: `https://seu-dominio.com/api/debug/oauth-temp`
3. Use as informações mostradas para configurar
4. **REMOVA** o arquivo após resolver

## 🔧 **SOLUÇÕES POR PLATAFORMA**

### **🚂 RAILWAY**

1. **Acesse o Railway Dashboard**
2. **Vá em Variables do seu projeto**
3. **Configure estas variáveis EXATAMENTE:**

```env
NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=seu-secret-super-seguro-32-chars
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret
NODE_ENV=production
```

### **☁️ VERCEL**

1. **Acesse Vercel Dashboard**
2. **Vá em Settings > Environment Variables**
3. **Configure:**

```env
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=seu-secret-super-seguro-32-chars
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret
```

### **🐳 DOCKER/VPS**

No seu `.env` ou docker-compose:

```env
NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=seu-secret-super-seguro-32-chars
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret
NODE_ENV=production
```

## 🌐 **CONFIGURAÇÃO NO GOOGLE CONSOLE**

### **1. Acesse Google Cloud Console**
https://console.cloud.google.com/

### **2. Vá em APIs & Services > Credentials**

### **3. Edite seu OAuth 2.0 Client**

### **4. Configure EXATAMENTE estas URLs:**

#### **Authorized JavaScript origins:**
```
https://seu-dominio.com
https://www.seu-dominio.com
```

#### **Authorized redirect URIs:**
```
https://seu-dominio.com/api/auth/callback/google
https://www.seu-dominio.com/api/auth/callback/google
```

⚠️ **IMPORTANTE**: Substitua `seu-dominio.com` pela sua URL real!

## 🔍 **VERIFICAÇÕES ESPECÍFICAS**

### **Verificação 1: URLs Corretas**
```bash
npm run test-oauth-prod
```

### **Verificação 2: Variáveis de Ambiente**
No seu painel de hosting, confirme que:
- `NEXTAUTH_URL` está definido
- `GOOGLE_CLIENT_ID` está definido
- `GOOGLE_CLIENT_SECRET` está definido
- Não há espaços extras nas variáveis

### **Verificação 3: Google Console**
- URLs no Google Console correspondem EXATAMENTE à sua URL de produção
- App está em modo "Production" (não Testing)
- Domínio está autorizado no OAuth Consent Screen

## 🚨 **ERROS COMUNS E SOLUÇÕES**

### **Erro: "redirect_uri_mismatch"**
**Causa**: URL no Google Console não confere
**Solução**: Adicione a URL exata mostrada no erro

### **Erro: "invalid_client"**
**Causa**: GOOGLE_CLIENT_ID ou GOOGLE_CLIENT_SECRET incorretos
**Solução**: Verifique as credenciais no Google Console

### **Erro: "unauthorized_client"**
**Causa**: App não está publicado ou domínio não autorizado
**Solução**: Publique o app no Google Console

### **Erro: "access_denied"**
**Causa**: Usuário cancelou ou app não tem permissões
**Solução**: Verifique OAuth Consent Screen

## 🔄 **PROCESSO DE TESTE**

### **1. Após configurar tudo:**
1. Faça deploy/redeploy da aplicação
2. Limpe cookies do navegador
3. Teste em aba anônima

### **2. Teste o fluxo:**
1. Acesse `https://seu-dominio.com/login`
2. Clique em "Sign in with Google"
3. Deve redirecionar para Google
4. Após autorizar, deve voltar para seu site

### **3. Se ainda não funcionar:**
1. Verifique logs da aplicação
2. Execute `npm run test-oauth-prod`
3. Compare URLs mostradas com Google Console

## ✅ **CHECKLIST FINAL**

- [ ] `NEXTAUTH_URL` configurado corretamente
- [ ] `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` corretos
- [ ] URLs no Google Console conferem EXATAMENTE
- [ ] App publicado no Google Console
- [ ] Deploy feito após mudanças
- [ ] Cookies limpos para teste
- [ ] Testado em aba anônima

## 🎯 **EXEMPLO COMPLETO**

Para o domínio `kylo.video`:

### **Variáveis de Ambiente:**
```env
NEXTAUTH_URL=https://kylo.video
GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123def456
```

### **Google Console:**
- **Origins**: `https://kylo.video`
- **Redirects**: `https://kylo.video/api/auth/callback/google`

---

**🚨 LEMBRE-SE**: Após qualquer mudança, sempre faça redeploy e teste em aba anônima!
