# 🔧 Correção dos Problemas de Autenticação

## 1. Erro do Google OAuth: "invalid_client"

### Causa
O Google não reconhece o client ID ou as URLs não estão configuradas.

### Solução Passo a Passo:

1. **Acesse o Google Cloud Console**
   - URL: https://console.cloud.google.com/
   - Selecione seu projeto

2. **Vá para APIs & Services > Credentials**

3. **Clique no OAuth 2.0 Client ID existente**
   - Client ID: 591777452871-aefk8i1utkbk4k5eh35lr1i1rstrhaje.apps.googleusercontent.com

4. **Adicione estas Authorized JavaScript origins:**
   ```
   http://localhost:3000
   http://localhost:3001
   https://kylo.video
   https://www.kylo.video
   ```

5. **Adicione estes Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google
   https://kylo.video/api/auth/callback/google
   https://www.kylo.video/api/auth/callback/google
   ```

6. **Salve e aguarde 5-10 minutos**

## 2. Teste Local

### Passo 1: Instale as dependências
```powershell
cd F:\site-ia\ai-video-hub
npm install
```

### Passo 2: Configure o ambiente local
Crie ou edite `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
```

### Passo 3: Inicie o servidor
```powershell
npm run dev
```

### Passo 4: Teste usando o arquivo HTML
1. Abra no navegador: `file:///F:/site-ia/ai-video-hub/tests/test-auth-complete.html`
2. Teste cada funcionalidade:
   - Registro
   - Login
   - Google OAuth

## 3. Debugando Erros

### Se o registro falhar:
1. Verifique o console do servidor
2. Confirme que o banco de dados está acessível
3. Verifique se a senha atende aos requisitos

### Se o Google OAuth continuar falhando:
1. Verifique se o app está em modo "Production" no Google Console
2. Confirme que o domínio kylo.video está verificado
3. Tente em uma janela anônima do navegador

## 4. Comandos Úteis

```powershell
# Verificar variáveis de ambiente
node tests/debug-auth.js

# Limpar cache do navegador
# Chrome: Ctrl+Shift+Delete

# Reiniciar o servidor
# Ctrl+C para parar
npm run dev
```

## 5. Checklist Final

- [ ] Google Console configurado com localhost
- [ ] .env.local criado com NEXTAUTH_URL local
- [ ] Servidor rodando sem erros
- [ ] Banco de dados acessível
- [ ] Teste em navegador limpo/anônimo