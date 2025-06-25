# Instruções para Configurar o Banco de Dados Supabase

Como as portas do PostgreSQL estão bloqueadas no WSL, você precisa executar o SQL diretamente no Supabase Dashboard.

## Passos:

1. **Acesse o Supabase Dashboard**
   - Vá para: https://app.supabase.com
   - Faça login e selecione o projeto `snfxczgjpnydysccigps`

2. **Execute o SQL**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New Query**
   - Copie todo o conteúdo do arquivo `create-tables.sql`
   - Cole no editor SQL
   - Clique em **Run** (ou pressione Ctrl+Enter)

3. **Verifique as tabelas**
   - Vá para **Table Editor** no menu lateral
   - Você deve ver as seguintes tabelas:
     - User
     - Plan
     - Subscription
     - Video
     - Transaction
     - AuditLog

4. **Configure Row Level Security (RLS)**
   Execute este SQL adicional para segurança:

```sql
-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Plan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Video" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own data
CREATE POLICY "Users can view own profile" ON "User"
FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can view own videos" ON "Video"
FOR SELECT USING (auth.uid()::text = userId);

CREATE POLICY "Users can view own subscriptions" ON "Subscription"
FOR SELECT USING (auth.uid()::text = userId);

CREATE POLICY "Users can view own transactions" ON "Transaction"
FOR SELECT USING (auth.uid()::text = userId);

-- Allow public to view plans
CREATE POLICY "Anyone can view plans" ON "Plan"
FOR SELECT USING (true);
```

## Alternativa: Usando Túnel SSH

Se preferir usar o Prisma localmente, você pode criar um túnel SSH:

```bash
# No PowerShell do Windows
ssh -L 5432:db.snfxczgjpnydysccigps.supabase.co:5432 user@seu-servidor-com-acesso
```

Depois mude o DATABASE_URL para:
```
DATABASE_URL=postgresql://postgres:m3b1%23D%5E7%26W9%2AypgzGhCv@localhost:5432/postgres
```