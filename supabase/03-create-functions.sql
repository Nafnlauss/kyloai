-- ============================================
-- FUNÇÕES ÚTEIS PARA O SISTEMA KYLO
-- Execute este arquivo após criar as tabelas e políticas
-- ============================================

-- 1. FUNÇÃO PARA DEDUZIR CRÉDITOS DO USUÁRIO
-- ============================================
CREATE OR REPLACE FUNCTION deduct_user_credits(
    p_user_id TEXT,
    p_amount INTEGER,
    p_description TEXT,
    p_metadata JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_credits INTEGER;
    v_new_balance INTEGER;
BEGIN
    -- Obter créditos atuais do usuário
    SELECT credits INTO v_current_credits
    FROM "User"
    WHERE id = p_user_id
    FOR UPDATE;
    
    -- Verificar se há créditos suficientes
    IF v_current_credits < p_amount THEN
        RETURN FALSE;
    END IF;
    
    -- Calcular novo saldo
    v_new_balance := v_current_credits - p_amount;
    
    -- Atualizar créditos do usuário
    UPDATE "User"
    SET credits = v_new_balance
    WHERE id = p_user_id;
    
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
        p_user_id,
        -p_amount,
        v_new_balance,
        'DEDUCT',
        p_description,
        p_metadata
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. FUNÇÃO PARA ADICIONAR CRÉDITOS
-- ============================================
CREATE OR REPLACE FUNCTION add_user_credits(
    p_user_id TEXT,
    p_amount INTEGER,
    p_description TEXT,
    p_metadata JSONB DEFAULT NULL,
    p_expires_at TIMESTAMP DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_credits INTEGER;
    v_new_balance INTEGER;
BEGIN
    -- Obter créditos atuais
    SELECT credits INTO v_current_credits
    FROM "User"
    WHERE id = p_user_id
    FOR UPDATE;
    
    -- Calcular novo saldo
    v_new_balance := v_current_credits + p_amount;
    
    -- Atualizar créditos do usuário
    UPDATE "User"
    SET credits = v_new_balance
    WHERE id = p_user_id;
    
    -- Registrar no histórico
    INSERT INTO "CreditHistory" (
        "userId", 
        "amount", 
        "balance", 
        "operation", 
        "description", 
        "metadata",
        "expiresAt"
    )
    VALUES (
        p_user_id,
        p_amount,
        v_new_balance,
        'ADD',
        p_description,
        p_metadata,
        p_expires_at
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. FUNÇÃO PARA RESETAR CRÉDITOS MENSAIS
-- ============================================
CREATE OR REPLACE FUNCTION reset_monthly_credits()
RETURNS void AS $$
DECLARE
    v_user RECORD;
    v_plan RECORD;
BEGIN
    -- Loop através de todos os usuários com assinatura ativa
    FOR v_user IN 
        SELECT DISTINCT u.id, u.credits, s."planId"
        FROM "User" u
        INNER JOIN "Subscription" s ON s."userId" = u.id
        WHERE s.status = 'ACTIVE'
        AND s."currentPeriodEnd" <= CURRENT_TIMESTAMP
    LOOP
        -- Obter informações do plano
        SELECT credits INTO v_plan
        FROM "Plan"
        WHERE id = v_user."planId";
        
        -- Resetar créditos para o valor do plano
        UPDATE "User"
        SET credits = v_plan.credits,
            "creditsLastReset" = CURRENT_TIMESTAMP
        WHERE id = v_user.id;
        
        -- Registrar no histórico
        INSERT INTO "CreditHistory" (
            "userId", 
            "amount", 
            "balance", 
            "operation", 
            "description"
        )
        VALUES (
            v_user.id,
            v_plan.credits - v_user.credits,
            v_plan.credits,
            'RESET',
            'Monthly credit reset'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. FUNÇÃO PARA OBTER ESTATÍSTICAS DO USUÁRIO
-- ============================================
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id TEXT)
RETURNS TABLE (
    total_videos INTEGER,
    total_credits_used INTEGER,
    total_spent NUMERIC,
    favorite_provider TEXT,
    last_video_date TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_videos,
        COALESCE(SUM("creditsUsed"), 0)::INTEGER as total_credits_used,
        COALESCE((
            SELECT SUM(amount)::NUMERIC 
            FROM "Transaction" 
            WHERE "userId" = p_user_id 
            AND status = 'COMPLETED'
        ), 0) as total_spent,
        (
            SELECT provider::TEXT
            FROM "Video"
            WHERE "userId" = p_user_id
            GROUP BY provider
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) as favorite_provider,
        MAX("createdAt") as last_video_date
    FROM "Video"
    WHERE "userId" = p_user_id
    AND status = 'COMPLETED';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. FUNÇÃO PARA LIMPAR VÍDEOS ANTIGOS
-- ============================================
CREATE OR REPLACE FUNCTION cleanup_old_videos(p_days INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    -- Deletar vídeos mais antigos que X dias
    WITH deleted AS (
        DELETE FROM "Video"
        WHERE "createdAt" < CURRENT_TIMESTAMP - INTERVAL '1 day' * p_days
        AND status IN ('COMPLETED', 'FAILED')
        RETURNING id
    )
    SELECT COUNT(*) INTO v_deleted FROM deleted;
    
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. FUNÇÃO PARA VERIFICAR LIMITE DE CRÉDITOS
-- ============================================
CREATE OR REPLACE FUNCTION check_credit_limit(
    p_user_id TEXT,
    p_required_credits INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_available_credits INTEGER;
BEGIN
    SELECT credits INTO v_available_credits
    FROM "User"
    WHERE id = p_user_id;
    
    RETURN v_available_credits >= p_required_credits;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. FUNÇÃO PARA REGISTRAR AÇÃO DE AUDITORIA
-- ============================================
CREATE OR REPLACE FUNCTION log_audit_action(
    p_user_id TEXT,
    p_action TEXT,
    p_resource TEXT,
    p_resource_id TEXT DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO "AuditLog" (
        "userId",
        "action",
        "resource",
        "resourceId",
        "ipAddress",
        "userAgent",
        "metadata"
    )
    VALUES (
        p_user_id,
        p_action,
        p_resource,
        p_resource_id,
        p_ip_address,
        p_user_agent,
        p_metadata
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. FUNÇÃO PARA CALCULAR USO DE CRÉDITOS POR PERÍODO
-- ============================================
CREATE OR REPLACE FUNCTION get_credit_usage_by_period(
    p_user_id TEXT,
    p_start_date TIMESTAMP,
    p_end_date TIMESTAMP
)
RETURNS TABLE (
    date DATE,
    credits_used INTEGER,
    videos_created INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        DATE("createdAt") as date,
        COALESCE(SUM("creditsUsed"), 0)::INTEGER as credits_used,
        COUNT(*)::INTEGER as videos_created
    FROM "Video"
    WHERE "userId" = p_user_id
    AND "createdAt" >= p_start_date
    AND "createdAt" <= p_end_date
    AND status = 'COMPLETED'
    GROUP BY DATE("createdAt")
    ORDER BY date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- FIM DO SCRIPT DE FUNÇÕES
-- ============================================