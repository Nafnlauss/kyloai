# 🚨 IMPORTANTE: Variáveis de Ambiente para Railway

## Para o Google OAuth funcionar em produção, adicione estas variáveis no Railway:

### 1. Acesse o Railway Dashboard
https://railway.app/

### 2. Vá em Variables do seu projeto

### 3. Adicione/Atualize estas variáveis:

```env
# CRÍTICO PARA OAUTH
NEXTAUTH_URL=https://kyloai-production.up.railway.app

# Google OAuth
GOOGLE_CLIENT_ID=591777452871-aefk8i1utkbk4k5eh35lr1i1rstrhaje.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=(use o secret do seu .env local)

# Se você tem domínio customizado
# NEXTAUTH_URL=https://kylo.video
```

### 4. No Google Console, adicione TODAS estas URLs:

#### Authorized JavaScript origins:
```
https://kylo.video
https://www.kylo.video
https://kyloai-production.up.railway.app
http://localhost:3000
http://localhost:3001
```

#### Authorized redirect URIs:
```
https://kylo.video/api/auth/callback/google
https://www.kylo.video/api/auth/callback/google
https://kyloai-production.up.railway.app/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

### 5. Após adicionar as variáveis:
- Clique em "Deploy" no Railway
- Aguarde o deploy concluir
- Teste o login com Google

## ⚠️ Possíveis Problemas:

1. **Se usar domínio customizado (kylo.video)**:
   - NEXTAUTH_URL deve ser https://kylo.video
   - Certifique-se que o domínio está configurado corretamente no Railway

2. **Se NÃO usar domínio customizado**:
   - NEXTAUTH_URL deve ser https://kyloai-production.up.railway.app

3. **Erro 401 invalid_client**:
   - Verifique se TODAS as URLs estão no Google Console
   - Aguarde 5-10 minutos após adicionar URLs
   - Limpe cache do navegador