-- Script SQL FINAL para corrigir autenticação no Supabase
-- Execute este script no SQL Editor do Supabase

-- 1. Adicionar colunas faltantes na tabela User (se não existirem)
DO $$ 
BEGIN
  -- Adicionar colunas uma por uma para evitar erros
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'passwordHash') THEN
    ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'stripeCustomerId') THEN
    ALTER TABLE "User" ADD COLUMN "stripeCustomerId" TEXT UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'asaasCustomerId') THEN
    ALTER TABLE "User" ADD COLUMN "asaasCustomerId" TEXT UNIQUE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'credits') THEN
    ALTER TABLE "User" ADD COLUMN credits INTEGER DEFAULT 300;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'creditsLastReset') THEN
    ALTER TABLE "User" ADD COLUMN "creditsLastReset" TIMESTAMP DEFAULT NOW();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'role') THEN
    ALTER TABLE "User" ADD COLUMN role TEXT DEFAULT 'USER';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'isActive') THEN
    ALTER TABLE "User" ADD COLUMN "isActive" BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'twoFactorEnabled') THEN
    ALTER TABLE "User" ADD COLUMN "twoFactorEnabled" BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'twoFactorSecret') THEN
    ALTER TABLE "User" ADD COLUMN "twoFactorSecret" TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'lastLoginAt') THEN
    ALTER TABLE "User" ADD COLUMN "lastLoginAt" TIMESTAMP;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'lastLoginIp') THEN
    ALTER TABLE "User" ADD COLUMN "lastLoginIp" TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'failedLoginAttempts') THEN
    ALTER TABLE "User" ADD COLUMN "failedLoginAttempts" INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'User' AND column_name = 'lockedUntil') THEN
    ALTER TABLE "User" ADD COLUMN "lockedUntil" TIMESTAMP;
  END IF;
END $$;

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

-- 5. Criar usuário de teste
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
  '$2a$12$83q.dk9aft9tJZQh1Hnyw.0RYJjKC.6goDmVP7mFxpjjD3XDNK7la',
  NOW(),
  300,
  'USER',
  NOW(),
  NOW()
);

-- 6. Criar usuário admin
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
  '$2a$12$eGzU2R3uSK5rkwmIOhqAf.frYkz6t8eAEKlEt/95vP1O9DX3v9Hhi',
  NOW(),
  9999,
  'ADMIN',
  NOW(),
  NOW()
);

-- 7. Verificar resultado
SELECT 
  id, 
  email, 
  name, 
  role, 
  credits,
  "emailVerified",
  CASE 
    WHEN "passwordHash" IS NOT NULL THEN '✅ Senha configurada' 
    ELSE '❌ Sem senha' 
  END as "Status da Senha",
  "createdAt"
FROM "User" 
WHERE email IN ('test@example.com', 'admin@example.com')
ORDER BY email;

-- Se tudo funcionou, você verá:
-- test@example.com  - Test User  - USER  - 300 créditos - ✅ Senha configurada
-- admin@example.com - Admin User - ADMIN - 9999 créditos - ✅ Senha configurada