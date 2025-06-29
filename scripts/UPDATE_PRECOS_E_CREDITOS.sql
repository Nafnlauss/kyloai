-- ============================================
-- ATUALIZAR PREÇOS E SISTEMA DE CRÉDITOS
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. ATUALIZAR PREÇOS DOS PLANOS
-- ============================================
-- Plano LITE: $8/mês, $76,80/ano
UPDATE "Plan" 
SET "priceMonthly" = 8,
    "priceYearly" = 76.80,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE name = 'lite';

-- Plano CREATOR: $26/mês, $249,60/ano
UPDATE "Plan" 
SET "priceMonthly" = 26,
    "priceYearly" = 249.60,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE name = 'creator';

-- Plano PROFESSIONAL: $68/mês, $652,80/ano
UPDATE "Plan" 
SET "priceMonthly" = 68,
    "priceYearly" = 652.80,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE name = 'professional';

-- 2. ATUALIZAR PACOTES DE CRÉDITOS (apenas para assinantes)
-- ============================================
-- Limpar pacotes existentes
DELETE FROM "CreditPack";

-- Inserir novos pacotes com preços atualizados
INSERT INTO "CreditPack" ("name", "displayName", "credits", "price", "stripePriceId") VALUES
('credits_1000', '1,000 Credits', 1000, 8, 'price_1RcK7CRuScAuCzn2N1NJhAdA'),
('credits_2500', '2,500 Credits', 2500, 18, 'price_1RcK7YRuScAuCzn27Gpx7QWl'),
('credits_7000', '7,000 Credits', 7000, 45, 'price_1RcK7qRuScAuCzn2u8bgZWxv'),
('credits_16000', '16,000 Credits', 16000, 90, 'price_1RcK86RuScAuCzn2o4Zt0ipI');

-- 3. ADICIONAR CAMPO PARA CONTROLAR ACUMULAÇÃO NA TABELA SUBSCRIPTION
-- ============================================
-- Adicionar campo para indicar se créditos são acumulativos
ALTER TABLE "Subscription" 
ADD COLUMN IF NOT EXISTS "creditsAccumulative" BOOLEAN DEFAULT false;

-- Atualizar para true em assinaturas anuais
UPDATE "Subscription" 
SET "creditsAccumulative" = true 
WHERE interval = 'YEARLY';

-- 4. CRIAR FUNÇÃO PARA RENOVAÇÃO DE CRÉDITOS
-- ============================================
CREATE OR REPLACE FUNCTION renew_subscription_credits()
RETURNS TRIGGER AS $$
DECLARE
    v_plan_credits INTEGER;
    v_current_credits INTEGER;
BEGIN
    -- Se a assinatura está sendo renovada (período mudou)
    IF NEW."currentPeriodStart" != OLD."currentPeriodStart" 
    AND NEW.status = 'ACTIVE' THEN
        
        -- Obter créditos do plano
        SELECT credits INTO v_plan_credits
        FROM "Plan"
        WHERE id = NEW."planId";
        
        -- Obter créditos atuais do usuário
        SELECT credits INTO v_current_credits
        FROM "User"
        WHERE id = NEW."userId";
        
        -- Se é plano MENSAL (não acumulativo)
        IF NEW.interval = 'MONTHLY' THEN
            -- Resetar para os créditos do plano (não acumula)
            UPDATE "User"
            SET credits = v_plan_credits,
                "creditsLastReset" = CURRENT_TIMESTAMP
            WHERE id = NEW."userId";
            
            -- Registrar no histórico
            INSERT INTO "CreditHistory" (
                "userId",
                "amount",
                "balance",
                "operation",
                "description",
                "metadata"
            )
            VALUES (
                NEW."userId",
                v_plan_credits - v_current_credits,
                v_plan_credits,
                'SUBSCRIPTION_RENEWAL',
                'Monthly subscription renewal - credits reset',
                jsonb_build_object(
                    'subscriptionId', NEW.id,
                    'planId', NEW."planId",
                    'previousBalance', v_current_credits,
                    'accumulative', false
                )
            );
            
        -- Se é plano ANUAL (acumulativo)
        ELSIF NEW.interval = 'YEARLY' THEN
            -- Adicionar créditos aos existentes (acumula)
            UPDATE "User"
            SET credits = credits + v_plan_credits,
                "creditsLastReset" = CURRENT_TIMESTAMP
            WHERE id = NEW."userId";
            
            -- Registrar no histórico
            INSERT INTO "CreditHistory" (
                "userId",
                "amount",
                "balance",
                "operation",
                "description",
                "metadata"
            )
            VALUES (
                NEW."userId",
                v_plan_credits,
                v_current_credits + v_plan_credits,
                'SUBSCRIPTION_RENEWAL',
                'Yearly subscription renewal - credits accumulated',
                jsonb_build_object(
                    'subscriptionId', NEW.id,
                    'planId', NEW."planId",
                    'previousBalance', v_current_credits,
                    'accumulative', true
                )
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger antigo se existir
DROP TRIGGER IF EXISTS handle_subscription_renewal ON "Subscription";

-- Criar novo trigger
CREATE TRIGGER handle_subscription_renewal
    AFTER UPDATE ON "Subscription"
    FOR EACH ROW
    EXECUTE FUNCTION renew_subscription_credits();

-- 5. CRIAR FUNÇÃO PARA VALIDAR COMPRA DE CRÉDITOS
-- ============================================
CREATE OR REPLACE FUNCTION validate_credit_purchase()
RETURNS TRIGGER AS $$
DECLARE
    v_has_subscription BOOLEAN;
BEGIN
    -- Verificar se o usuário tem assinatura ativa
    SELECT EXISTS(
        SELECT 1 
        FROM "Subscription" 
        WHERE "userId" = NEW."userId" 
        AND status = 'ACTIVE'
    ) INTO v_has_subscription;
    
    -- Se está comprando créditos mas não tem assinatura
    IF NEW.type = 'CREDIT_PURCHASE' AND NOT v_has_subscription THEN
        RAISE EXCEPTION 'Only subscribers can purchase credit packs';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para validar compra de créditos
CREATE TRIGGER check_credit_purchase
    BEFORE INSERT ON "Transaction"
    FOR EACH ROW
    EXECUTE FUNCTION validate_credit_purchase();

-- 6. VERIFICAR RESULTADOS
-- ============================================
SELECT 
    name,
    "displayName",
    credits,
    "priceMonthly" as "Mensal ($)",
    "priceYearly" as "Anual ($)",
    ROUND("priceYearly"::numeric / 12, 2) as "Anual/Mês ($)"
FROM "Plan"
ORDER BY 
    CASE name
        WHEN 'free' THEN 1
        WHEN 'lite' THEN 2
        WHEN 'creator' THEN 3
        WHEN 'professional' THEN 4
    END;

-- Verificar pacotes de créditos
SELECT 
    "displayName",
    credits,
    price as "Preço ($)",
    ROUND(price::numeric / credits * 1000, 2) as "$/1000 créditos"
FROM "CreditPack"
ORDER BY credits;

-- ============================================
-- RESULTADO ESPERADO DOS PLANOS:
-- free         | Free         | 300    | 0  | 0      | 0.00
-- lite         | Lite         | 1000   | 8  | 76.80  | 6.40
-- creator      | Creator      | 4000   | 26 | 249.60 | 20.80
-- professional | Professional | 12000  | 68 | 652.80 | 54.40
--
-- RESULTADO ESPERADO DOS PACOTES:
-- 1,000 Credits  | 1000  | 8  | 8.00
-- 2,500 Credits  | 2500  | 18 | 7.20
-- 7,000 Credits  | 7000  | 45 | 6.43
-- 16,000 Credits | 16000 | 90 | 5.63
-- ============================================