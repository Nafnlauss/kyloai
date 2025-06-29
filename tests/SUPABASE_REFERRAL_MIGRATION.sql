-- ========================================
-- SISTEMA DE REFERRAL - KYLO AI VIDEO HUB
-- ========================================
-- Execute este SQL no Supabase SQL Editor
-- Data: 28/06/2025
-- ========================================

-- 1. ADICIONAR CAMPOS DE REFERRAL NA TABELA USER
-- ========================================
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "referralCode" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "referredById" TEXT REFERENCES "User"("id");

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS "User_referralCode_idx" ON "User"("referralCode");
CREATE INDEX IF NOT EXISTS "User_referredById_idx" ON "User"("referredById");

-- 2. ADICIONAR CAMPO METADATA EM USERPREFERENCES
-- ========================================
ALTER TABLE "UserPreferences"
ADD COLUMN IF NOT EXISTS "metadata" TEXT;

-- 3. CRIAR TABELA DE GANHOS DE REFERRAL
-- ========================================
CREATE TABLE IF NOT EXISTS "ReferralEarning" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL UNIQUE,
    "amount" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payoutId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    
    CONSTRAINT "ReferralEarning_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralEarning_referredUserId_fkey" 
        FOREIGN KEY ("referredUserId") REFERENCES "User"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReferralEarning_transactionId_fkey" 
        FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Índices para ReferralEarning
CREATE INDEX IF NOT EXISTS "ReferralEarning_userId_idx" ON "ReferralEarning"("userId");
CREATE INDEX IF NOT EXISTS "ReferralEarning_referredUserId_idx" ON "ReferralEarning"("referredUserId");
CREATE INDEX IF NOT EXISTS "ReferralEarning_status_idx" ON "ReferralEarning"("status");
CREATE INDEX IF NOT EXISTS "ReferralEarning_createdAt_idx" ON "ReferralEarning"("createdAt");

-- 4. CRIAR TABELA DE SAQUES DE REFERRAL
-- ========================================
CREATE TABLE IF NOT EXISTS "ReferralPayout" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "method" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "cryptoAddress" TEXT,
    "cryptoNetwork" TEXT,
    "transactionHash" TEXT,
    "bankAccount" TEXT,
    "metadata" TEXT,
    "processedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    
    CONSTRAINT "ReferralPayout_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Índices para ReferralPayout
CREATE INDEX IF NOT EXISTS "ReferralPayout_userId_idx" ON "ReferralPayout"("userId");
CREATE INDEX IF NOT EXISTS "ReferralPayout_status_idx" ON "ReferralPayout"("status");
CREATE INDEX IF NOT EXISTS "ReferralPayout_createdAt_idx" ON "ReferralPayout"("createdAt");

-- 5. CRIAR TABELA DE ESTATÍSTICAS DE REFERRAL
-- ========================================
CREATE TABLE IF NOT EXISTS "ReferralStats" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL UNIQUE,
    "totalReferrals" INTEGER NOT NULL DEFAULT 0,
    "activeReferrals" INTEGER NOT NULL DEFAULT 0,
    "totalEarnings" INTEGER NOT NULL DEFAULT 0,
    "pendingEarnings" INTEGER NOT NULL DEFAULT 0,
    "paidEarnings" INTEGER NOT NULL DEFAULT 0,
    "lastCalculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "ReferralStats_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") 
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Índice para ReferralStats
CREATE INDEX IF NOT EXISTS "ReferralStats_userId_idx" ON "ReferralStats"("userId");

-- 6. ADICIONAR CONSTRAINT DE FOREIGN KEY PARA PAYOUTID
-- ========================================
-- Primeiro verificar se a constraint já existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'ReferralEarning_payoutId_fkey'
    ) THEN
        ALTER TABLE "ReferralEarning" 
        ADD CONSTRAINT "ReferralEarning_payoutId_fkey" 
        FOREIGN KEY ("payoutId") REFERENCES "ReferralPayout"("id") 
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

-- 7. CRIAR FUNÇÃO PARA GERAR CÓDIGO DE REFERRAL ÚNICO
-- ========================================
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
    code_exists BOOLEAN := TRUE;
BEGIN
    WHILE code_exists LOOP
        result := '';
        FOR i IN 1..8 LOOP
            result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END LOOP;
        
        -- Verificar se o código já existe
        SELECT EXISTS(SELECT 1 FROM "User" WHERE "referralCode" = result) INTO code_exists;
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 8. CRIAR TRIGGER PARA GERAR CÓDIGO DE REFERRAL AUTOMATICAMENTE
-- ========================================
CREATE OR REPLACE FUNCTION assign_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."referralCode" IS NULL THEN
        NEW."referralCode" := generate_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar o trigger
DROP TRIGGER IF EXISTS auto_assign_referral_code ON "User";
CREATE TRIGGER auto_assign_referral_code
BEFORE INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION assign_referral_code();

-- 9. ATUALIZAR USUÁRIOS EXISTENTES COM CÓDIGOS DE REFERRAL
-- ========================================
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT "id" FROM "User" WHERE "referralCode" IS NULL
    LOOP
        UPDATE "User" 
        SET "referralCode" = generate_referral_code()
        WHERE "id" = user_record.id;
    END LOOP;
END $$;

-- 10. CRIAR VIEWS ÚTEIS PARA RELATÓRIOS
-- ========================================

-- View de resumo de referrals por usuário
CREATE OR REPLACE VIEW "referral_summary" AS
SELECT 
    u."id" as user_id,
    u."email",
    u."name",
    u."referralCode",
    COUNT(DISTINCT r."id") as total_referrals,
    COUNT(DISTINCT CASE WHEN rs."status" = 'ACTIVE' THEN r."id" END) as active_referrals,
    COALESCE(SUM(re."amount"), 0) as total_earnings,
    COALESCE(SUM(CASE WHEN re."status" = 'PENDING' THEN re."amount" END), 0) as pending_earnings,
    COALESCE(SUM(CASE WHEN re."status" = 'PAID' THEN re."amount" END), 0) as paid_earnings
FROM "User" u
LEFT JOIN "User" r ON r."referredById" = u."id"
LEFT JOIN "Subscription" rs ON rs."userId" = r."id"
LEFT JOIN "ReferralEarning" re ON re."userId" = u."id"
GROUP BY u."id", u."email", u."name", u."referralCode";

-- View de saques pendentes
CREATE OR REPLACE VIEW "pending_payouts" AS
SELECT 
    rp.*,
    u."email" as user_email,
    u."name" as user_name,
    rs."pendingEarnings" as available_balance
FROM "ReferralPayout" rp
JOIN "User" u ON u."id" = rp."userId"
LEFT JOIN "ReferralStats" rs ON rs."userId" = rp."userId"
WHERE rp."status" = 'PENDING'
ORDER BY rp."createdAt" ASC;

-- ========================================
-- FIM DA MIGRAÇÃO
-- ========================================

-- Verificar se todas as tabelas foram criadas
SELECT 
    'ReferralEarning' as table_name, 
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'ReferralEarning') as exists
UNION ALL
SELECT 
    'ReferralPayout', 
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'ReferralPayout')
UNION ALL
SELECT 
    'ReferralStats', 
    EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'ReferralStats');

-- Mensagem de sucesso
SELECT 'Sistema de Referral instalado com sucesso!' as message;