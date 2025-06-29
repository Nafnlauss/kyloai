# Atualizando o Banco Rapidamente

Se a migração está demorando, você pode:

## Opção 1: Usar db push (Recomendado para desenvolvimento)
```bash
pnpm prisma db push
```
Isso aplica as mudanças do schema diretamente sem criar arquivos de migração.

## Opção 2: SQL Manual no Supabase
1. Acesse o dashboard do Supabase
2. Vá para SQL Editor
3. Execute o arquivo `add-referral-system.sql`

## Opção 3: Verificar se a migração anterior terminou
```bash
# Ver status das migrações
pnpm prisma migrate status

# Se necessário, marcar como aplicada
pnpm prisma migrate resolve --applied "add-referral-system"
```

## Após aplicar as mudanças:
```bash
# Gerar o cliente Prisma (pode dar erro de permissão no Windows)
pnpm prisma generate

# Se der erro, tente:
rm -rf node_modules/.prisma
pnpm prisma generate
```