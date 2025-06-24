# 🔐 Configuração do Google OAuth para Kylo.video

## ⚠️ URGENTE: Correção do Erro "invalid_client"

### Problema Identificado
- **Erro 1**: "The OAuth client was not found" (Error 401: invalid_client)
- **Causa**: O Google OAuth não está configurado para o domínio kylo.video

## 📝 Passos para Corrigir

### 1. Acesse o Google Cloud Console
1. Vá para: https://console.cloud.google.com/
2. Selecione seu projeto ou crie um novo

### 2. Configure as Credenciais OAuth
1. Navegue para **APIs & Services** > **Credentials**
2. Clique em sua credencial OAuth existente ou crie uma nova
3. Configure os seguintes campos:

#### Authorized JavaScript origins (Origens JavaScript autorizadas)
✅ Você já tem configurado:
- https://kylo.video
- https://www.kylo.video
- https://kyloai-production.up.railway.app

⚠️ **ADICIONE ESTAS PARA DESENVOLVIMENTO LOCAL**:
```
http://localhost:3000
http://localhost:3001
```

#### Authorized redirect URIs (URIs de redirecionamento autorizados)
✅ Você já tem configurado:
- https://kylo.video/api/auth/callback/google
- https://kylo.video/auth/callback/google
- https://www.kylo.video/api/auth/callback/google
- https://www.kylo.video/auth/callback/google
- https://kyloai-production.up.railway.app/api/auth/callback/google
- https://kyloai-production.up.railway.app/auth/callback/google

⚠️ **ADICIONE ESTAS PARA DESENVOLVIMENTO LOCAL**:
```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

### 3. Configure o OAuth Consent Screen
1. Vá para **OAuth consent screen**
2. Configure:
   - **App name**: Kylo
   - **User support email**: leonardo@kylo.video
   - **App domain**: kylo.video
   - **Authorized domains**: kylo.video
   - **Developer contact**: leonardo@kylo.video

### 4. Verifique as Credenciais
As credenciais atuais no .env estão corretas:
- **Client ID**: 591777452871-aefk8i1utkbk4k5eh35lr1i1rstrhaje.apps.googleusercontent.com
- **Client Secret**: [MANTENHA SEGURO]

### 5. Status de Publicação
Certifique-se de que o app está em modo **Production** (não Testing) para permitir logins de qualquer usuário.

## 🔄 Teste após Configuração

1. Limpe o cache do navegador
2. Acesse https://kylo.video/login
3. Clique em "Continue with Google"
4. O login deve funcionar sem erros

## 📋 Checklist
- [ ] Origens JavaScript incluem kylo.video
- [ ] URIs de redirecionamento incluem /api/auth/callback/google
- [ ] OAuth consent screen configurado
- [ ] App em modo Production
- [ ] Domínio kylo.video autorizado

## 🆘 Se Continuar com Erro

1. **Verifique o Console do Google** para mensagens de erro específicas
2. **Aguarde 5-10 minutos** - mudanças podem levar tempo para propagar
3. **Verifique o domínio** - certifique-se de que kylo.video está apontando corretamente

## 📞 Suporte
Se precisar de ajuda adicional, entre em contato com o suporte do Google Cloud.