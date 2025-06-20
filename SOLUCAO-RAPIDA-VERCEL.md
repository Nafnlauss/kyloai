# 🚀 SOLUÇÃO RÁPIDA - Erro de Variáveis Vercel

## ❌ Problema Identificado
```
Error: Environment Variable "NEXT_PUBLIC_APP_URL" references Secret "production_url", which does not exist.
```

## ✅ Solução Imediata

### Opção 1: Remover Referências (Mais Rápido)
Execute no PowerShell:
```powershell
cd F:\site-ia\ai-video-hub
.\setup-vercel-env.ps1
```

Ou no CMD:
```batch
fix-vercel-env.bat
```

### Opção 2: Configurar no Vercel Dashboard

1. Acesse: https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables

2. Adicione estas variáveis:

| Variável | Valor | Tipo |
|----------|-------|------|
| `NEXT_PUBLIC_APP_URL` | `https://$VERCEL_URL` | All Environments |
| `DATABASE_URL` | (sua string de conexão) | Production |
| `NEXTAUTH_URL` | `https://$VERCEL_URL` | Production |
| `NEXTAUTH_SECRET` | (gere com: `openssl rand -base64 32`) | Production |
| `GOOGLE_CLIENT_ID` | (do Google Console) | Production |
| `GOOGLE_CLIENT_SECRET` | (do Google Console) | Production |
| `STRIPE_SECRET_KEY` | (do Stripe Dashboard) | Production |
| `REDIS_URL` | (opcional) | Production |

### Opção 3: Deploy Sem Verificação
```bash
vercel --prod --yes --skip-domain
```

## 📋 Checklist Rápido

- [ ] Backup do vercel.json feito
- [ ] vercel.json simplificado criado
- [ ] Variáveis configuradas no Dashboard
- [ ] Deploy executado com sucesso

## 🆘 Se Ainda Houver Erro

1. **Limpe o cache do Vercel:**
   ```bash
   rm -rf .vercel
   vercel
   ```

2. **Force o deploy:**
   ```bash
   vercel --prod --force
   ```

3. **Use npx:**
   ```bash
   npx vercel --prod
   ```

## 🎯 Comando Final
Após configurar as variáveis:
```bash
git add .
git commit -m "Fix: vercel environment variables"
git push origin main
vercel --prod
```
