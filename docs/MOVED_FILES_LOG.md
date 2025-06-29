# Log de Arquivos Movidos para tests/

Data: 2025-06-25

## Arquivos de API Routes movidos:

### De src/app/api/debug/
- `oauth-fix/route.ts` → `tests/api-routes/debug/oauth-fix-route.ts`

### De src/app/api/
- `check-db-url/route.ts` → `tests/api-routes/check-db-url-route.ts`
- `check-google-account/route.ts` → `tests/api-routes/check-google-account-route.ts`
- `check-session/route.ts` → `tests/api-routes/check-session-route.ts`
- `check-user/route.ts` → `tests/api-routes/check-user-route.ts`
- `fix-accounts/route.ts` → `tests/api-routes/fix-accounts-route.ts`
- `test-oauth/route.ts` → `tests/api-routes/test-oauth-route.ts`
- `test-prisma/route.ts` → `tests/api-routes/test-prisma-route.ts`
- `test-simple/route.ts` → `tests/api-routes/test-simple-route.ts`

## Páginas de teste movidas:

### De src/app/
- `test-oauth/page.tsx` → `tests/pages/test-oauth-page.tsx`

## Scripts SQL movidos:

### De supabase/
- `UPDATE_CREDITS.sql` → `tests/sql-scripts/UPDATE_CREDITS.sql`
- `UPDATE_PRECOS_E_CREDITOS.sql` → `tests/sql-scripts/UPDATE_PRECOS_E_CREDITOS.sql`

### De prisma/migrations/
- `set_admin_user.sql` → `tests/sql-scripts/set_admin_user.sql`
- `update_default_credits.sql` → `tests/sql-scripts/update_default_credits.sql`

## Diretórios vazios removidos:
- `src/app/api/debug/`
- `src/app/api/check-db-url/`
- `src/app/api/check-google-account/`
- `src/app/api/check-session/`
- `src/app/api/check-user/`
- `src/app/api/fix-accounts/`
- `src/app/api/test-db/`
- `src/app/api/test-oauth/`
- `src/app/api/test-prisma/`
- `src/app/api/test-simple/`
- `src/app/test-oauth/`

## Como usar os arquivos movidos:

### Para testar rotas de API:
```bash
# Copie o arquivo desejado de volta temporariamente para testar
cp tests/api-routes/check-db-url-route.ts src/app/api/check-db-url/route.ts
# Teste a rota
# Remova após o teste
```

### Para testar páginas:
```bash
# Copie a página temporariamente
cp tests/pages/test-oauth-page.tsx src/app/test-oauth/page.tsx
# Teste a página
# Remova após o teste
```

### Para executar scripts SQL:
```bash
# Use os scripts diretamente do diretório tests/sql-scripts/
psql $DATABASE_URL -f tests/sql-scripts/UPDATE_CREDITS.sql
```