# 🚨 CORREÇÃO URGENTE - Google OAuth Redirecionamento

## Problema Identificado

Com base nas imagens que você enviou, o problema está claro:
- O Google OAuth está configurado corretamente no console
- Mas a aplicação ainda redireciona para `localhost:3000`

## Solução Imediata - COM DOMÍNIO PERSONALIZADO

### 1. No Railway - Configure estas variáveis:

```env
NEXTAUTH_URL=https://kylo.video
NEXT_PUBLIC_APP_URL=https://kylo.video
```

⚠️ **IMPORTANTE**: Use seu domínio personalizado, NÃO localhost!

### 2. No Google Console - Adicione estas URIs:

**Authorized JavaScript origins:**
```
https://kylo.video
https://www.kylo.video
```

**Authorized redirect URIs:**
```
https://kylo.video/api/auth/callback/google
https://www.kylo.video/api/auth/callback/google
```

### 3. Passos no Railway:

1. Vá ao seu projeto no Railway
2. Clique em "Variables"
3. Adicione ou atualize:
   - `NEXTAUTH_URL` = `https://kylo.video`
   - `NEXT_PUBLIC_APP_URL` = `https://kylo.video`

4. Clique em "Deploy" para aplicar as mudanças

### 4. Verificação Rápida

Execute este comando localmente para testar:
```bash
curl https://kylo.video/api/health
```

### 5. Debug - Se ainda não funcionar:

No Railway, adicione temporariamente esta variável para debug:
```env
NODE_ENV=production
```

## Checklist de Verificação

- [ ] `NEXTAUTH_URL` está configurado no Railway (NÃO localhost)
- [ ] URLs no Google Console correspondem EXATAMENTE à URL do Railway
- [ ] Fez deploy após alterar variáveis
- [ ] Limpou cookies/cache do navegador
- [ ] Testou em aba anônima

## Erro Comum

❌ **ERRADO**: 
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL=https://kylo-production.up.railway.app
```

✅ **CORRETO**: 
```
NEXTAUTH_URL=https://kylo.video
```

## Teste Final

1. Abra uma aba anônima
2. Acesse: https://kylo.video/login
3. Clique em "Sign in with Google"
4. Deve redirecionar para kylo.video, não localhost!

## Resumo das Configurações

### Railway Variables:
```
NEXTAUTH_URL=https://kylo.video
NEXT_PUBLIC_APP_URL=https://kylo.video
```

### Google Console OAuth:
- **Origins**: `https://kylo.video` e `https://www.kylo.video`
- **Redirect URIs**: `https://kylo.video/api/auth/callback/google`

---

**AÇÃO IMEDIATA**: Vá ao Railway agora e atualize `NEXTAUTH_URL` para `https://kylo.video`!