# Variáveis de Ambiente para Railway

## Google OAuth (IMPORTANTE - Configure no Railway)
```
GOOGLE_CLIENT_ID=(seu client ID do Google Console)
GOOGLE_CLIENT_SECRET=(seu client secret do Google Console)
```
**Nota**: As credenciais devem terminar com `.apps.googleusercontent.com` e começar com `GOCSPX-` respectivamente.

## NextAuth
```
NEXTAUTH_URL=https://kylo.video
NEXTAUTH_SECRET=Lk6289asqwa202515
AUTH_SECRET=Lk6289asqwa202515
```

## Database
```
DATABASE_URL=postgresql://postgres.snfxczgjpnydysccigps:Lk6289asqwa@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Supabase
```
NEXT_PUBLIC_SUPABASE_URL=https://snfxczgjpnydysccigps.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZnhjemRqcG55ZHlzY2NpZ3BzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1OTk1MDIsImV4cCI6MjA0OTE3NTUwMn0.7pOiLm_ilQCQ_77uKvK2ISdAa8zzPANZ0gr31Dk9DEE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuZnhjemRqcG55ZHlzY2NpZ3BzIiwicm9sZSI6InNlcnZpY2VX8cm9sZSIsImlhdCI6MTczMzU5OTUwMiwiZXhwIjoyMDQ5MTc1NTAyfQ.ZCpYOcIE6Q8WbKKxqzkeX0B70h_3EJ_Gh8aRjNdNBBo
```

## IMPORTANTE:
1. No Railway, certifique-se de que o DATABASE_URL não tenha espaços ou quebras de linha
2. As credenciais do Google OAuth acima são as corretas e devem ser usadas exatamente como estão
3. Verifique no Google Console que https://kylo.video/api/auth/callback/google está configurado como URI de redirecionamento autorizado