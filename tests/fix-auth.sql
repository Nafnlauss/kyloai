-- Script SQL para criar tabelas e usuário de teste no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Criar tabela User se não existir
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT UNIQUE NOT NULL,
  "emailVerified" TIMESTAMP,
  name TEXT,
  "passwordHash" TEXT,
  image TEXT,
  credits INTEGER DEFAULT 300,
  "creditsLastReset" TIMESTAMP DEFAULT NOW(),
  role TEXT DEFAULT 'USER',
  "isActive" BOOLEAN DEFAULT true,
  "twoFactorEnabled" BOOLEAN DEFAULT false,
  "twoFactorSecret" TEXT,
  "lastLoginAt" TIMESTAMP,
  "lastLoginIp" TEXT,
  "failedLoginAttempts" INTEGER DEFAULT 0,
  "lockedUntil" TIMESTAMP,
  "stripeCustomerId" TEXT UNIQUE,
  "asaasCustomerId" TEXT UNIQUE,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- 2. Criar tabela Account para OAuth
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

-- 3. Criar tabela Session
CREATE TABLE IF NOT EXISTS "Session" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sessionToken" TEXT UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL
);

-- 4. Criar índices
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);
CREATE INDEX IF NOT EXISTS idx_user_stripe ON "User"("stripeCustomerId");
CREATE INDEX IF NOT EXISTS idx_account_user ON "Account"("userId");
CREATE INDEX IF NOT EXISTS idx_session_user ON "Session"("userId");

-- 5. Criar usuário de teste
-- Senha: Test123!@# (hash bcrypt)
INSERT INTO "User" (email, name, "passwordHash", "emailVerified", credits, role)
VALUES (
  'test@example.com',
  'Test User',
  '$2a$12$YJR8kpN7PP7XL3t5kYrCYeFWG3KcqF4iv3BqWFqCVcXMzLdL6H/5K',
  NOW(),
  300,
  'USER'
) ON CONFLICT (email) DO NOTHING;

-- 6. Criar usuário admin
-- Senha: Admin123!@# (hash bcrypt)
INSERT INTO "User" (email, name, "passwordHash", "emailVerified", credits, role)
VALUES (
  'admin@example.com',
  'Admin User',
  '$2a$12$lDDN9cIe0dZ5e7UdYj/Kj.V2z3yM9sG8aV6H8rJ4NmR5YQ4nX.Khu',
  NOW(),
  9999,
  'ADMIN'
) ON CONFLICT (email) DO NOTHING;

-- 7. Verificar usuários criados
SELECT id, email, name, role, credits FROM "User";