-- ============================================
-- TRIGGERS ADICIONAIS PARA O SISTEMA
-- Execute este arquivo após criar as tabelas e funções
-- ============================================

-- 1. TRIGGER PARA VALIDAR CRÉDITOS ANTES DE CRIAR VÍDEO
-- ============================================
CREATE OR REPLACE FUNCTION validate_credits_before_video()
RETURNS TRIGGER AS $$
DECLARE
    v_user_credits INTEGER;
    v_required_credits INTEGER;
BEGIN
    -- Definir créditos necessários baseado no provider
    CASE NEW.provider
        WHEN 'LUMA' THEN v_required_credits := 30;
        WHEN 'KLING' THEN v_required_credits := 50;
        ELSE v_required_credits := 30;
    END CASE;
    
    -- Obter créditos do usuário
    SELECT credits INTO v_user_credits
    FROM "User"
    WHERE id = NEW."userId";
    
    -- Verificar se tem créditos suficientes
    IF v_user_credits < v_required_credits THEN
        RAISE EXCEPTION 'Insufficient credits. Required: %, Available: %', 
            v_required_credits, v_user_credits;
    END IF;
    
    -- Definir créditos usados
    NEW."creditsUsed" := v_required_credits;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_credits_before_video
    BEFORE INSERT ON "Video"
    FOR EACH ROW
    EXECUTE FUNCTION validate_credits_before_video();

-- 2. TRIGGER PARA DEDUZIR CRÉDITOS QUANDO VÍDEO É PROCESSADO
-- ============================================
CREATE OR REPLACE FUNCTION deduct_credits_on_video_complete()
RETURNS TRIGGER AS $$
BEGIN
    -- Só deduzir quando mudar de PROCESSING para COMPLETED
    IF OLD.status = 'PROCESSING' AND NEW.status = 'COMPLETED' THEN
        -- Deduzir créditos do usuário
        UPDATE "User"
        SET credits = credits - NEW."creditsUsed"
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
            -NEW."creditsUsed",
            (SELECT credits FROM "User" WHERE id = NEW."userId"),
            'VIDEO_GENERATION',
            'Video generation completed',
            jsonb_build_object(
                'videoId', NEW.id,
                'provider', NEW.provider,
                'prompt', NEW.prompt
            )
        );
    END IF;
    
    -- Reembolsar créditos se falhou
    IF OLD.status = 'PROCESSING' AND NEW.status = 'FAILED' THEN
        UPDATE "User"
        SET credits = credits + NEW."creditsUsed"
        WHERE id = NEW."userId";
        
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
            NEW."creditsUsed",
            (SELECT credits FROM "User" WHERE id = NEW."userId"),
            'VIDEO_REFUND',
            'Video generation failed - credits refunded',
            jsonb_build_object(
                'videoId', NEW.id,
                'error', NEW.error
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_video_completion
    AFTER UPDATE OF status ON "Video"
    FOR EACH ROW
    EXECUTE FUNCTION deduct_credits_on_video_complete();

-- 3. TRIGGER PARA ATUALIZAR CRÉDITOS NA RENOVAÇÃO DE ASSINATURA
-- ============================================
CREATE OR REPLACE FUNCTION update_credits_on_subscription_renewal()
RETURNS TRIGGER AS $$
DECLARE
    v_plan_credits INTEGER;
BEGIN
    -- Só processar quando período muda (renovação)
    IF NEW."currentPeriodStart" != OLD."currentPeriodStart" 
    AND NEW.status = 'ACTIVE' THEN
        -- Obter créditos do plano
        SELECT credits INTO v_plan_credits
        FROM "Plan"
        WHERE id = NEW."planId";
        
        -- Atualizar créditos do usuário
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
            v_plan_credits,
            v_plan_credits,
            'SUBSCRIPTION_RENEWAL',
            'Monthly subscription renewal',
            jsonb_build_object(
                'subscriptionId', NEW.id,
                'planId', NEW."planId"
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_subscription_renewal
    AFTER UPDATE ON "Subscription"
    FOR EACH ROW
    EXECUTE FUNCTION update_credits_on_subscription_renewal();

-- 4. TRIGGER PARA LIMPAR DADOS PESSOAIS APÓS SOFT DELETE
-- ============================================
CREATE OR REPLACE FUNCTION anonymize_deleted_user()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."deletedAt" IS NOT NULL AND OLD."deletedAt" IS NULL THEN
        -- Anonimizar dados pessoais
        NEW.email := 'deleted_' || NEW.id || '@deleted.com';
        NEW.name := 'Deleted User';
        NEW."passwordHash" := NULL;
        NEW.image := NULL;
        NEW."twoFactorSecret" := NULL;
        NEW."lastLoginIp" := NULL;
        
        -- Registrar ação
        INSERT INTO "AuditLog" (
            "userId",
            "action",
            "resource",
            "resourceId",
            "metadata"
        )
        VALUES (
            NEW.id,
            'USER_DELETED',
            'User',
            NEW.id,
            jsonb_build_object(
                'deletedAt', NEW."deletedAt"
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER anonymize_on_soft_delete
    BEFORE UPDATE OF "deletedAt" ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION anonymize_deleted_user();

-- 5. TRIGGER PARA PREVENIR MÚLTIPLAS ASSINATURAS ATIVAS
-- ============================================
CREATE OR REPLACE FUNCTION prevent_multiple_active_subscriptions()
RETURNS TRIGGER AS $$
DECLARE
    v_active_count INTEGER;
BEGIN
    IF NEW.status = 'ACTIVE' THEN
        -- Contar assinaturas ativas do usuário
        SELECT COUNT(*) INTO v_active_count
        FROM "Subscription"
        WHERE "userId" = NEW."userId"
        AND status = 'ACTIVE'
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000');
        
        IF v_active_count > 0 THEN
            RAISE EXCEPTION 'User already has an active subscription';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_single_active_subscription
    BEFORE INSERT OR UPDATE OF status ON "Subscription"
    FOR EACH ROW
    EXECUTE FUNCTION prevent_multiple_active_subscriptions();

-- 6. TRIGGER PARA REGISTRAR MUDANÇAS DE SEGURANÇA
-- ============================================
CREATE OR REPLACE FUNCTION log_security_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Registrar mudança de senha
    IF TG_OP = 'UPDATE' AND OLD."passwordHash" IS DISTINCT FROM NEW."passwordHash" THEN
        INSERT INTO "AuditLog" (
            "userId",
            "action",
            "resource",
            "resourceId",
            "metadata"
        )
        VALUES (
            NEW.id,
            'PASSWORD_CHANGED',
            'User',
            NEW.id,
            jsonb_build_object(
                'timestamp', CURRENT_TIMESTAMP
            )
        );
    END IF;
    
    -- Registrar mudança de 2FA
    IF TG_OP = 'UPDATE' AND OLD."twoFactorEnabled" IS DISTINCT FROM NEW."twoFactorEnabled" THEN
        INSERT INTO "AuditLog" (
            "userId",
            "action",
            "resource",
            "resourceId",
            "metadata"
        )
        VALUES (
            NEW.id,
            CASE 
                WHEN NEW."twoFactorEnabled" THEN '2FA_ENABLED'
                ELSE '2FA_DISABLED'
            END,
            'User',
            NEW.id,
            jsonb_build_object(
                'timestamp', CURRENT_TIMESTAMP
            )
        );
    END IF;
    
    -- Registrar mudança de role
    IF TG_OP = 'UPDATE' AND OLD.role IS DISTINCT FROM NEW.role THEN
        INSERT INTO "AuditLog" (
            "userId",
            "action",
            "resource",
            "resourceId",
            "metadata"
        )
        VALUES (
            NEW.id,
            'ROLE_CHANGED',
            'User',
            NEW.id,
            jsonb_build_object(
                'oldRole', OLD.role,
                'newRole', NEW.role,
                'timestamp', CURRENT_TIMESTAMP
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_security_changes
    AFTER UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION log_security_changes();

-- FIM DO SCRIPT DE TRIGGERS
-- ============================================