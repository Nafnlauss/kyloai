# 🚨 URGENTE: Configurar Google OAuth

## O que está acontecendo:
O Google OAuth está bloqueando porque `http://localhost:3000` NÃO está configurado.

## SOLUÇÃO (faça AGORA):

### 1. Acesse o Google Cloud Console
Link direto: https://console.cloud.google.com/apis/credentials

### 2. Encontre seu OAuth Client
- Client ID: `591777452871-aefk8i1utkbk4k5eh35lr1i1rstrhaje.apps.googleusercontent.com`
- Clique para EDITAR

### 3. ADICIONE estas URLs:

**Em "Authorized JavaScript origins":**
```
http://localhost:3000
http://localhost:3001
```

**Em "Authorized redirect URIs":**
```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
```

### 4. IMPORTANTE:
- Clique em **SAVE**
- Aguarde 5-10 minutos
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Teste em janela anônima/privada

## Se ainda não funcionar:

### Opção 1: Criar NOVO OAuth Client
1. Em Credentials, clique **+ CREATE CREDENTIALS**
2. Escolha **OAuth client ID**
3. Application type: **Web application**
4. Name: **Kylo Dev Local**
5. Adicione as mesmas URLs acima
6. Copie o novo Client ID e Secret
7. Atualize no `.env` e `.env.local`

### Opção 2: Verificar OAuth Consent Screen
1. Vá em **OAuth consent screen**
2. Verifique se está em **Production** (não Testing)
3. Se estiver em Testing, clique **PUBLISH APP**

## Teste rápido:
Após configurar, acesse:
http://localhost:3000/login

E clique em "Continue with Google"