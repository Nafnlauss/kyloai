-- ========================================
-- SISTEMA DE REFERRAL CORRIGIDO - KYLO AI VIDEO HUB
-- ========================================
-- Execute este SQL no Supabase SQL Editor
-- Data: 28/06/2025
-- ========================================

-- 1. CRIAR TABELA UserPreferences SE NÃO EXISTIR
-- ========================================
CREATE TABLE IF NOT EXISTS "UserPreferences" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL UNIQUE,
    
    -- Theme and Display
    "theme" TEXT NOT NULL DEFAULT 'light',
    "language" TEXT NOT NULL DEFAULT 'pt-BR',
    "videoQuality" TEXT NOT NULL DEFAULT 'auto',
    "autoPlay" BOOLEAN NOT NULL DEFAULT true,
    
    -- Email Notifications
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT false,
    "notifyOnVideoComplete" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnCreditLow" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnNewFeatures" BOOLEAN NOT NULL DEFAULT true,
    "notifyOnPromotions" BOOLEAN NOT NULL DEFAULT true,
    
    -- Additional settings
    "metadata" TEXT,
    
    -- Timestamps
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "UserPreferences_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Criar índice para UserPreferences
CREATE INDEX IF NOT EXISTS "UserPreferences_userId_idx" ON "UserPreferences"("userId");

-- 2. ADICIONAR CAMPOS DE REFERRAL NA TABELA USER
-- ========================================
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "referralCode" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "referredById" TEXT REFERENCES "User"("id");

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS "User_referralCode_idx" ON "User"("referralCode");
CREATE INDEX IF NOT EXISTS "User_referredById_idx" ON "User"("referredById");

-- 3. CRIAR TABELA DE GANHOS DE REFERRAL
-- ========================================
CREATE TABLE IF NOT EXISTS "ReferralEarning" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL UNIQUE,
    "amount" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "status" TEXT NOT NULL DEFAULT 'PENDING' CHECK ("status" IN ('PENDING', 'CONFIRMED', 'PAID', 'CANCELLED')),
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
    "method" TEXT NOT NULL CHECK ("method" IN ('USDT_ERC20', 'USDT_SOL', 'USDT_POLYGON', 'BANK_TRANSFER', 'PAYPAL')),
    "status" TEXT NOT NULL DEFAULT 'PENDING' CHECK ("status" IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')),
    "cryptoAddress" TEXT,
    "cryptoNetwork" TEXT CHECK ("cryptoNetwork" IN ('ERC20', 'SOL', 'POLYGON', NULL)),
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

-- Criar o trigger para novos usuários
DROP TRIGGER IF EXISTS auto_assign_referral_code ON "User";
CREATE TRIGGER auto_assign_referral_code
BEFORE INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION assign_referral_code();

-- 9. ATUALIZAR USUÁRIOS EXISTENTES COM CÓDIGOS DE REFERRAL (SEM TRIGGER)
-- ========================================
-- Desabilitar temporariamente qualquer trigger de update
DO $$
DECLARE
    user_record RECORD;
    new_code TEXT;
BEGIN
    -- Processar cada usuário sem código
    FOR user_record IN 
        SELECT "id" 
        FROM "User" 
        WHERE "referralCode" IS NULL
    LOOP
        -- Gerar código único
        new_code := generate_referral_code();
        
        -- Atualizar diretamente sem triggers
        EXECUTE 'UPDATE "User" SET "referralCode" = $1 WHERE "id" = $2' 
        USING new_code, user_record.id;
    END LOOP;
END $$;

-- 10. CRIAR TRIGGER ESPECÍFICO PARA UserPreferences
-- ========================================
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON "UserPreferences";

-- Criar novo trigger
CREATE TRIGGER update_user_preferences_updated_at 
BEFORE UPDATE ON "UserPreferences" 
FOR EACH ROW 
EXECUTE FUNCTION update_user_preferences_updated_at();

-- 11. CRIAR VIEWS ÚTEIS PARA RELATÓRIOS
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
-- VERIFICAÇÕES FINAIS
-- ========================================

-- Verificar se todas as tabelas foram criadas
SELECT 
    table_name,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = t.table_name) 
        THEN '✅ Criada com sucesso'
        ELSE '❌ Erro ao criar'
    END as status
FROM (
    VALUES 
        ('UserPreferences'),
        ('ReferralEarning'),
        ('ReferralPayout'),
        ('ReferralStats')
) as t(table_name);

-- Verificar campos de referral na tabela User
SELECT 
    column_name,
    CASE 
        WHEN EXISTS(
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'User' AND column_name = c.column_name
        ) 
        THEN '✅ Campo adicionado'
        ELSE '❌ Campo não encontrado'
    END as status
FROM (
    VALUES 
        ('referralCode'),
        ('referredById')
) as c(column_name);

-- Contar usuários com código de referral
SELECT 
    COUNT(*) FILTER (WHERE "referralCode" IS NOT NULL) as users_with_code,
    COUNT(*) FILTER (WHERE "referralCode" IS NULL) as users_without_code,
    COUNT(*) as total_users
FROM "User";

-- Mensagem de sucesso
SELECT '🎉 Sistema de Referral instalado com sucesso!' as message,
       'Próximos passos: Teste o sistema acessando /referrals no seu app' as next_steps;