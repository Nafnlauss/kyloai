# 🚨 VARIÁVEIS DE AMBIENTE PARA O VERCEL

## Copie estas variáveis do seu .env para o Vercel Dashboard

Acesse: https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables

### 1. DATABASE (Obrigatório)
```
DATABASE_URL=postgresql://postgres:m3b1%23D%5E7%26W9%2AypgzGhCv@db.snfxczgjpnydysccigps.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:m3b1%23D%5E7%26W9%2AypgzGhCv@db.snfxczgjpnydysccigps.supabase.co:5432/postgres
```

### 2. NEXTAUTH (Obrigatório)
```
NEXTAUTH_SECRET=xPq3Rt7Uv9WcYa2Bd4FgHj6Km8NpQs0TvXz1Ac3Ef5Gi=
NEXTAUTH_URL=https://kyloai.vercel.app
```

### 3. GOOGLE OAUTH (Para login)
```
GOOGLE_CLIENT_ID=591777452871-aefk8i1utkbk4k5eh35lr1i1rstrhaje.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

### 4. SUPABASE (Opcionais mas recomendados)
```
NEXT_PUBLIC_SUPABASE_URL=https://snfxczgjpnydysccigps.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZnhjemdqcG55ZHlzY2NpZ3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNzY2NjksImV4cCI6MjA2NTk1MjY2OX0.OY-wNhs-K9HJks1mCbWYHDXvVIICHgCsaGnSk3Jx6Rw
```

### 5. APP CONFIG
```
NEXT_PUBLIC_APP_URL=https://kyloai.vercel.app
```

### 6. STRIPE (Se usar pagamentos)
```
STRIPE_SECRET_KEY=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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51RbuLqRuScAuCzn2gjzqJrDxpCHbbzeuqSYmTH8cHMS3lxhjarpYM2qSrVJQTzEFC4GedlpiGUmSb0KoOFdlF6U200Xfl15uwk
```

## ⚡ Deploy Rápido

Depois de adicionar as variáveis:

```bash
vercel --prod
```

## 🔥 Se ainda der erro

Execute:
```bash
.\deploy-sem-prisma.bat
```

Isso vai fazer o deploy sem o Prisma generate, que pode ser o problema.
