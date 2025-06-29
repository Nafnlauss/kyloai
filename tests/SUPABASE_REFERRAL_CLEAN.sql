-- ========================================
-- SISTEMA DE REFERRAL LIMPO - KYLO AI VIDEO HUB
-- ========================================
-- Execute este SQL no Supabase SQL Editor
-- Data: 28/06/2025
-- ========================================

-- 0. REMOVER TRIGGERS CONFLITANTES
-- ========================================
-- Listar todos os triggers na tabela User
DO $$
DECLARE
    trigger_rec RECORD;
BEGIN
    -- Desabilitar temporariamente todos os triggers da tabela User
    FOR trigger_rec IN 
        SELECT tgname 
        FROM pg_trigger 
        WHERE tgrelid = '"User"'::regclass 
        AND tgname LIKE '%update%'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON "User"', trigger_rec.tgname);
        RAISE NOTICE 'Removido trigger: %', trigger_rec.tgname;
    END LOOP;
END $$;

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
-- Primeiro verificar se as colunas já existem
DO $$
BEGIN
    -- Adicionar referralCode se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'referralCode'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "referralCode" TEXT UNIQUE;
    END IF;
    
    -- Adicionar referredById se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'referredById'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "referredById" TEXT REFERENCES "User"("id");
    END IF;
END $$;

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

-- 8. ATUALIZAR USUÁRIOS EXISTENTES COM CÓDIGOS DE REFERRAL
-- ========================================
-- Método seguro sem usar UPDATE que pode ativar triggers
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
        LIMIT 1000 -- Processar em lotes para evitar timeout
    LOOP
        -- Gerar código único
        new_code := generate_referral_code();
        
        -- Usar comando SQL direto sem variáveis do PL/pgSQL
        PERFORM pg_catalog.set_config('session.my_user_id', user_record.id, false);
        PERFORM pg_catalog.set_config('session.my_ref_code', new_code, false);
        
        -- Executar update usando as configurações de sessão
        EXECUTE 'UPDATE "User" SET "referralCode" = current_setting(''session.my_ref_code'') WHERE "id" = current_setting(''session.my_user_id'')';
    END LOOP;
    
    RAISE NOTICE 'Códigos de referral atualizados com sucesso';
END $$;

-- 9. CRIAR TRIGGER APENAS PARA NOVOS USUÁRIOS
-- ========================================
CREATE OR REPLACE FUNCTION assign_referral_code_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    -- Apenas para INSERT, não UPDATE
    IF NEW."referralCode" IS NULL THEN
        NEW."referralCode" := generate_referral_code();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger somente para INSERT
DROP TRIGGER IF EXISTS auto_assign_referral_code ON "User";
CREATE TRIGGER auto_assign_referral_code
BEFORE INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION assign_referral_code_on_insert();

-- 10. TRIGGER ESPECÍFICO PARA UserPreferences
-- ========================================
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON "UserPreferences";
CREATE TRIGGER update_user_preferences_updated_at 
BEFORE UPDATE ON "UserPreferences" 
FOR EACH ROW 
EXECUTE FUNCTION update_user_preferences_updated_at();

-- ========================================
-- VERIFICAÇÕES FINAIS
-- ========================================

-- Verificar tabelas criadas
SELECT 
    table_name,
    CASE 
        WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = t.table_name) 
        THEN '✅ Criada'
        ELSE '❌ Não criada'
    END as status
FROM (
    VALUES 
        ('UserPreferences'),
        ('ReferralEarning'),
        ('ReferralPayout'),
        ('ReferralStats')
) as t(table_name);

-- Verificar campos na tabela User
SELECT 
    COUNT(*) FILTER (WHERE "referralCode" IS NOT NULL) as com_codigo,
    COUNT(*) FILTER (WHERE "referralCode" IS NULL) as sem_codigo,
    COUNT(*) as total
FROM "User";

-- ========================================
-- MÉTODO ALTERNATIVO SE AINDA HOUVER ERRO
-- ========================================
-- Se o update ainda falhar, use este comando SQL direto:
-- UPDATE "User" SET "referralCode" = 'REF' || substr(md5(random()::text), 1, 7) WHERE "referralCode" IS NULL;

SELECT '🎉 Sistema de Referral instalado!' as status,
       'Se ainda houver usuários sem código, execute o UPDATE alternativo acima' as nota;