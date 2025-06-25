-- Script SQL corrigido para adicionar colunas faltantes e criar usuários de teste

-- 1. Adicionar colunas faltantes na tabela User (se não existirem)
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "asaasCustomerId" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "passwordHash" TEXT,
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 300,
ADD COLUMN IF NOT EXISTS "creditsLastReset" TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'USER',
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "twoFactorSecret" TEXT,
ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "lastLoginIp" TEXT,
ADD COLUMN IF NOT EXISTS "failedLoginAttempts" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "lockedUntil" TIMESTAMP;

-- 2. Criar tabela Account se não existir (para OAuth)
CREATE TABLE IF NOT EXISTS "Account" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, "providerAccountId")
);

-- 3. Criar tabela Session se não existir
CREATE TABLE IF NOT EXISTS "Session" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL
);

-- 4. Deletar usuários de teste existentes (para recriar com senha correta)
DELETE FROM "User" WHERE email IN ('test@example.com', 'admin@example.com');

-- 5. Criar usuário de teste com senha hasheada
-- Email: test@example.com
-- Senha: Test123!@#
INSERT INTO "User" (
  id,
  email, 
  name, 
  "passwordHash", 
  "emailVerified", 
  credits, 
  role,
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid()::text,
  'test@example.com',
  'Test User',
  '$2a$12$YJR8kpN7PP7XL3t5kYrCYeFWG3KcqF4iv3BqWFqCVcXMzLdL6H/5K',
  NOW(),
  300,
  'USER',
  NOW(),
  NOW()
);

-- 6. Criar usuário admin com senha hasheada
-- Email: admin@example.com  
-- Senha: Admin123!@#
INSERT INTO "User" (
  id,
  email, 
  name, 
  "passwordHash", 
  "emailVerified", 
  credits, 
  role,
  "createdAt",
  "updatedAt"
)
VALUES (
  gen_random_uuid()::text,
  'admin@example.com',
  'Admin User',
  '$2a$12$lDDN9cIe0dZ5e7UdYj/Kj.V2z3yM9sG8aV6H8rJ4NmR5YQ4nX.Khu',
  NOW(),
  9999,
  'ADMIN',
  NOW(),
  NOW()
);

-- 7. Criar índices se não existirem
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_user_stripe ON "User"("stripeCustomerId") WHERE "stripeCustomerId" IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_account_user ON "Account"("userId");
CREATE INDEX IF NOT EXISTS idx_session_user ON "Session"("userId");

-- 8. Verificar usuários criados
SELECT 
  id, 
  email, 
  name, 
  role, 
  credits,
  "emailVerified",
  CASE 
    WHEN "passwordHash" IS NOT NULL THEN 'Sim' 
    ELSE 'Não' 
  END as "Senha Definida"
FROM "User" 
WHERE email IN ('test@example.com', 'admin@example.com');

-- 9. Verificar estrutura da tabela User
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'User'
ORDER BY ordinal_position;