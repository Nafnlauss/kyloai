-- ============================================
-- SCRIPT COMPLETO PARA CRIAR BANCO DO KYLO
-- Execute este arquivo no Supabase SQL Editor
-- ============================================

-- 1. HABILITAR EXTENSÕES NECESSÁRIAS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CRIAR TIPOS ENUM
-- ============================================
DO $$ BEGIN
    CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "Provider" AS ENUM ('LUMA', 'KLING');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "VideoStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'PAUSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "SubscriptionInterval" AS ENUM ('MONTHLY', 'YEARLY');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TransactionType" AS ENUM ('CREDIT_PURCHASE', 'SUBSCRIPTION_PAYMENT', 'REFUND');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. CRIAR TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "passwordHash" TEXT,
    "image" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 300,
    "creditsLastReset" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_createdAt_idx" ON "User"("createdAt");

-- 4. CRIAR TABELA DE PLANOS
-- ============================================
CREATE TABLE IF NOT EXISTS "Plan" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "priceMonthly" DOUBLE PRECISION NOT NULL,
    "priceYearly" DOUBLE PRECISION NOT NULL,
    "features" JSONB NOT NULL DEFAULT '[]',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Plan_name_key" ON "Plan"("name");

-- 5. CRIAR TABELA DE ASSINATURAS
-- ============================================
CREATE TABLE IF NOT EXISTS "Subscription" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL,
    "interval" "SubscriptionInterval" NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS "Subscription_userId_idx" ON "Subscription"("userId");
CREATE INDEX IF NOT EXISTS "Subscription_status_idx" ON "Subscription"("status");

-- 6. CRIAR TABELA DE VÍDEOS
-- ============================================
CREATE TABLE IF NOT EXISTS "Video" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "provider" "Provider" NOT NULL,
    "providerId" TEXT,
    "status" "VideoStatus" NOT NULL DEFAULT 'QUEUED',
    "videoUrl" TEXT,
    "thumbnailUrl" TEXT,
    "duration" INTEGER,
    "aspectRatio" TEXT,
    "metadata" JSONB,
    "error" TEXT,
    "creditsUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Video_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Video_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Video_userId_idx" ON "Video"("userId");
CREATE INDEX IF NOT EXISTS "Video_status_idx" ON "Video"("status");
CREATE INDEX IF NOT EXISTS "Video_createdAt_idx" ON "Video"("createdAt");

-- 7. CRIAR TABELA DE TRANSAÇÕES
-- ============================================
CREATE TABLE IF NOT EXISTS "Transaction" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "credits" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "stripePaymentIntentId" TEXT,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "Transaction_userId_idx" ON "Transaction"("userId");
CREATE INDEX IF NOT EXISTS "Transaction_status_idx" ON "Transaction"("status");
CREATE INDEX IF NOT EXISTS "Transaction_createdAt_idx" ON "Transaction"("createdAt");

-- 8. CRIAR TABELA DE AUDITORIA
-- ============================================
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "resourceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- 9. CRIAR TABELA DE HISTÓRICO DE CRÉDITOS
-- ============================================
CREATE TABLE IF NOT EXISTS "CreditHistory" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "operation" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditHistory_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CreditHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "CreditHistory_userId_idx" ON "CreditHistory"("userId");
CREATE INDEX IF NOT EXISTS "CreditHistory_createdAt_idx" ON "CreditHistory"("createdAt");

-- 10. CRIAR TABELA DE CRÉDITO DE PACOTES
-- ============================================
CREATE TABLE IF NOT EXISTS "CreditPack" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::TEXT,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stripePriceId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditPack_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CreditPack_name_key" ON "CreditPack"("name");

-- 11. INSERIR PLANOS PADRÃO
-- ============================================
INSERT INTO "Plan" ("name", "displayName", "credits", "priceMonthly", "priceYearly", "features") VALUES
('free', 'Free', 300, 0, 0, '["300 credits per month", "Access to all AI models", "Basic support"]'),
('lite', 'Lite', 1000, 8, 76.80, '["1,000 credits per month", "Access to all AI models", "Priority support", "HD exports", "20% savings on yearly"]'),
('creator', 'Creator', 4000, 26, 249.60, '["4,000 credits per month", "Access to all AI models", "Priority support", "HD exports", "Custom branding", "20% savings on yearly"]'),
('professional', 'Professional', 12000, 68, 652.80, '["12,000 credits per month", "Access to all AI models", "Priority support", "4K exports", "Custom branding", "API access", "20% savings on yearly"]')
ON CONFLICT (name) DO NOTHING;

-- 12. INSERIR PACOTES DE CRÉDITO PADRÃO
-- ============================================
INSERT INTO "CreditPack" ("name", "displayName", "credits", "price", "stripePriceId") VALUES
('credits_1000', '1,000 Credits', 1000, 8, 'price_1RcK7CRuScAuCzn2N1NJhAdA'),
('credits_2500', '2,500 Credits', 2500, 18, 'price_1RcK7YRuScAuCzn27Gpx7QWl'),
('credits_7000', '7,000 Credits', 7000, 45, 'price_1RcK7qRuScAuCzn2u8bgZWxv'),
('credits_16000', '16,000 Credits', 16000, 90, 'price_1RcK86RuScAuCzn2o4Zt0ipI')
ON CONFLICT (name) DO NOTHING;

-- 13. CRIAR TRIGGERS PARA UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plan_updated_at BEFORE UPDATE ON "Plan"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_updated_at BEFORE UPDATE ON "Subscription"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_updated_at BEFORE UPDATE ON "Video"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaction_updated_at BEFORE UPDATE ON "Transaction"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creditpack_updated_at BEFORE UPDATE ON "CreditPack"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 14. CRIAR FUNÇÃO PARA CALCULAR CRÉDITOS DISPONÍVEIS
-- ============================================
CREATE OR REPLACE FUNCTION get_user_available_credits(user_id TEXT)
RETURNS INTEGER AS $$
DECLARE
    total_credits INTEGER;
BEGIN
    SELECT COALESCE(SUM(
        CASE 
            WHEN "expiresAt" IS NULL OR "expiresAt" > CURRENT_TIMESTAMP 
            THEN "amount" 
            ELSE 0 
        END
    ), 0)
    INTO total_credits
    FROM "CreditHistory"
    WHERE "userId" = user_id;
    
    RETURN total_credits;
END;
$$ LANGUAGE plpgsql;

-- FIM DO SCRIPT
-- ============================================