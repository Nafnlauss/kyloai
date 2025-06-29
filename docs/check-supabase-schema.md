# Verificando Schema no Supabase

## Opção 1: Interface Web do Supabase (RECOMENDADO)

1. Acesse: https://supabase.com/dashboard
2. Faça login e selecione seu projeto
3. No menu lateral, clique em **Table Editor**
4. Procure a tabela `User`
5. Verifique se estas colunas existem:
   - `emailVerificationToken`
   - `emailVerificationExpires`
   - `bio`

## Opção 2: SQL Editor no Supabase

1. No dashboard do Supabase, clique em **SQL Editor**
2. Execute esta query para ver a estrutura da tabela:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'User'
ORDER BY ordinal_position;
```

## Opção 3: Adicionar Colunas Manualmente

Se as colunas não existirem, execute no SQL Editor:

```sql
-- Adiciona colunas faltantes
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "emailVerificationToken" TEXT,
ADD COLUMN IF NOT EXISTS "emailVerificationExpires" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "bio" TEXT;
```

## Opção 4: Reset de Conexões

Para resolver o erro "prepared statement already exists":

1. No Supabase Dashboard
2. Vá em **Settings** > **Database**
3. Clique em **Restart Database**
4. Aguarde 1-2 minutos

Depois tente novamente o registro!