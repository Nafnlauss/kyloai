# ✅ Checklist Rápido - Corrigir OAuth em Produção

## 1️⃣ Google Cloud Console
- [ ] Acesse: https://console.cloud.google.com/apis/credentials
- [ ] Selecione seu projeto
- [ ] Clique nas credenciais OAuth 2.0

### Origens JavaScript autorizadas (EXATAMENTE):
```
https://kylo.video
https://www.kylo.video
```

### URIs de redirecionamento (EXATAMENTE):
```
https://kylo.video/api/auth/callback/google
https://www.kylo.video/api/auth/callback/google
```

## 2️⃣ Variáveis de Ambiente (Vercel/Railway)

```env
NEXTAUTH_URL=https://kylo.video
GOOGLE_CLIENT_ID=seu-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-secret
NEXTAUTH_SECRET=gere-com-openssl-rand-base64-32
```

⚠️ **IMPORTANTE**: NEXTAUTH_URL sem barra final!

## 3️⃣ Teste Rápido

1. Execute o script de teste:
```bash
cd ai-video-hub/tests/oauth
node test-oauth-production.js
```

2. Verifique o resultado no navegador:
```
https://kylo.video/api/debug/oauth-temp
```

## 4️⃣ Verificação Final

- [ ] Limpe TODOS os cookies do site
- [ ] Abra aba anônima/privada
- [ ] Acesse https://kylo.video/login
- [ ] Clique em "Sign in with Google"
- [ ] Deve redirecionar para Google
- [ ] Após autorizar, deve voltar logado

## 5️⃣ Após Funcionar

**REMOVA IMEDIATAMENTE** o arquivo de debug:
```bash
rm src/app/api/debug/oauth-temp/route.ts
git add -A
git commit -m "fix: OAuth working, remove debug endpoint"
git push
```

## 🚨 Erros Comuns

### "redirect_uri_mismatch"
- URL no Google Console está diferente
- Verifique espaços extras ou barras finais

### "Access blocked"
- App ainda em modo teste no Google
- Publique o app no Google Console

### Não redireciona após login
- NEXTAUTH_URL incorreta
- Cookies não sendo salvos (HTTPS obrigatório)

### Loop infinito
- Limpe cookies
- Verifique NEXTAUTH_URL (sem barra final!)

## 📞 Suporte

Se continuar com problemas após seguir todos os passos:
1. Execute o script de teste e salve o output
2. Verifique os logs do servidor em produção
3. Teste com outro navegador/dispositivo