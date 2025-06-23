# Configuração do Google OAuth para Produção

## O Problema

Você está sendo redirecionado para `localhost` após fazer login com Google porque as configurações de OAuth ainda estão apontando para o ambiente de desenvolvimento.

## Solução Passo a Passo

### 1. Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Selecione seu projeto ou crie um novo
3. Vá para "APIs & Services" → "Credentials"
4. Encontre seu OAuth 2.0 Client ID

### 2. Atualize as URIs Autorizadas

No seu OAuth 2.0 Client, você precisa configurar:

**Authorized JavaScript origins:**
```
https://seu-dominio.railway.app
https://seu-dominio.com (se tiver domínio customizado)
```

**Authorized redirect URIs:**
```
https://seu-dominio.railway.app/api/auth/callback/google
https://seu-dominio.com/api/auth/callback/google (se tiver domínio customizado)
```

### 3. Variáveis de Ambiente no Railway

No painel do Railway, configure:

```env
# URL do seu app em produção
NEXTAUTH_URL=https://seu-dominio.railway.app
NEXT_PUBLIC_APP_URL=https://seu-dominio.railway.app

# Credenciais do Google OAuth (as mesmas do console)
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret
```

### 4. Verifique o Arquivo de Configuração

Certifique-se de que não há URLs hardcoded no código. O sistema deve usar `process.env.NEXTAUTH_URL` dinamicamente.

### 5. URLs Importantes

- **Callback do Google**: `/api/auth/callback/google`
- **Página de Login**: `/login`
- **Página após Login**: `/studio`

### 6. Teste de Configuração

1. Limpe os cookies do navegador
2. Acesse sua aplicação em produção
3. Clique em "Sign in with Google"
4. Verifique se a URL de redirecionamento está correta

## Variáveis de Ambiente Completas

```env
# Produção (Railway)
NEXTAUTH_URL=https://seu-app.railway.app
NEXT_PUBLIC_APP_URL=https://seu-app.railway.app

# Se tiver domínio customizado
NEXTAUTH_URL=https://kyloai.com
NEXT_PUBLIC_APP_URL=https://kyloai.com
```

## Troubleshooting

### Erro: "redirect_uri_mismatch"
- Verifique se as URIs no Google Console correspondem exatamente às suas URLs
- Certifique-se de incluir `/api/auth/callback/google` no final
- Aguarde 5-10 minutos após fazer alterações no Google Console

### Ainda redirecionando para localhost
1. Verifique se `NEXTAUTH_URL` está configurado no Railway
2. Faça um novo deploy após alterar variáveis de ambiente
3. Limpe o cache do navegador

### Login funciona mas volta para página errada
- Configure a variável `NEXTAUTH_URL` corretamente
- Verifique se não há redirecionamentos hardcoded no código

## Exemplo de Configuração Correta

**Google Console:**
![OAuth Config](oauth-config-example.png)
- Origin: `https://kylo-production.railway.app`
- Redirect URI: `https://kylo-production.railway.app/api/auth/callback/google`

**Railway Environment:**
```
NEXTAUTH_URL=https://kylo-production.railway.app
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxx
```

## Checklist Final

- [ ] URIs autorizadas configuradas no Google Console
- [ ] Variáveis de ambiente configuradas no Railway
- [ ] NEXTAUTH_URL aponta para produção, não localhost
- [ ] Deploy realizado após mudanças
- [ ] Cache do navegador limpo
- [ ] Teste em aba anônima/privada

Após seguir estes passos, o login com Google deve funcionar corretamente em produção!