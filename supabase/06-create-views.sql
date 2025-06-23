-- ============================================
-- VIEWS ÚTEIS PARA O SISTEMA
-- Execute este arquivo após criar todas as tabelas
-- ============================================

-- 1. VIEW DE USUÁRIOS ATIVOS COM INFORMAÇÕES DE ASSINATURA
-- ============================================
CREATE OR REPLACE VIEW user_subscription_info AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.credits,
    u.role,
    u."createdAt" as user_created_at,
    s.id as subscription_id,
    p.name as plan_name,
    p."displayName" as plan_display_name,
    p.credits as plan_credits,
    s.status as subscription_status,
    s.interval as billing_interval,
    s."currentPeriodEnd" as period_end,
    s."cancelAtPeriodEnd" as will_cancel,
    CASE 
        WHEN s.interval = 'MONTHLY' THEN p."priceMonthly"
        ELSE p."priceYearly"
    END as current_price
FROM "User" u
LEFT JOIN "Subscription" s ON s."userId" = u.id AND s.status = 'ACTIVE'
LEFT JOIN "Plan" p ON p.id = s."planId"
WHERE u."isActive" = true
AND u."deletedAt" IS NULL;

-- 2. VIEW DE ESTATÍSTICAS DE VÍDEOS POR USUÁRIO
-- ============================================
CREATE OR REPLACE VIEW user_video_stats AS
SELECT 
    u.id as user_id,
    u.email,
    COUNT(v.id) as total_videos,
    COUNT(CASE WHEN v.status = 'COMPLETED' THEN 1 END) as completed_videos,
    COUNT(CASE WHEN v.status = 'FAILED' THEN 1 END) as failed_videos,
    COUNT(CASE WHEN v.status IN ('QUEUED', 'PROCESSING') THEN 1 END) as pending_videos,
    COALESCE(SUM(v."creditsUsed"), 0) as total_credits_used,
    COUNT(DISTINCT v.provider) as providers_used,
    MAX(v."createdAt") as last_video_date,
    ROUND(AVG(
        CASE 
            WHEN v.status = 'COMPLETED' AND v."updatedAt" > v."createdAt"
            THEN EXTRACT(EPOCH FROM (v."updatedAt" - v."createdAt"))
        END
    )::numeric, 2) as avg_processing_time_seconds
FROM "User" u
LEFT JOIN "Video" v ON v."userId" = u.id
GROUP BY u.id, u.email;

-- 3. VIEW DE TRANSAÇÕES RESUMIDAS
-- ============================================
CREATE OR REPLACE VIEW transaction_summary AS
SELECT 
    DATE_TRUNC('month', t."createdAt") as month,
    t.type,
    t.status,
    COUNT(*) as transaction_count,
    SUM(t.amount) as total_amount,
    AVG(t.amount) as avg_amount,
    SUM(COALESCE(t.credits, 0)) as total_credits_sold
FROM "Transaction" t
GROUP BY DATE_TRUNC('month', t."createdAt"), t.type, t.status;

-- 4. VIEW DE ATIVIDADE DIÁRIA
-- ============================================
CREATE OR REPLACE VIEW daily_activity AS
SELECT 
    DATE(created_at) as activity_date,
    source_table,
    COUNT(*) as activity_count
FROM (
    SELECT "createdAt" as created_at, 'videos' as source_table FROM "Video"
    UNION ALL
    SELECT "createdAt" as created_at, 'transactions' as source_table FROM "Transaction"
    UNION ALL
    SELECT "createdAt" as created_at, 'users' as source_table FROM "User"
) combined
GROUP BY DATE(created_at), source_table
ORDER BY activity_date DESC, source_table;

-- 5. VIEW DE CRÉDITOS DISPONÍVEIS POR USUÁRIO
-- ============================================
CREATE OR REPLACE VIEW user_available_credits AS
SELECT 
    u.id as user_id,
    u.email,
    u.credits as current_balance,
    COALESCE(
        (SELECT SUM(amount) 
         FROM "CreditHistory" 
         WHERE "userId" = u.id 
         AND ("expiresAt" IS NULL OR "expiresAt" > CURRENT_TIMESTAMP)
        ), 0
    ) as non_expired_credits,
    COALESCE(
        (SELECT SUM(amount) 
         FROM "CreditHistory" 
         WHERE "userId" = u.id 
         AND "expiresAt" <= CURRENT_TIMESTAMP
        ), 0
    ) as expired_credits
FROM "User" u
WHERE u."isActive" = true;

-- 6. VIEW DE PERFORMANCE POR PROVIDER
-- ============================================
CREATE OR REPLACE VIEW provider_performance AS
SELECT 
    provider,
    COUNT(*) as total_requests,
    COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as successful_videos,
    COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_videos,
    ROUND(
        COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END)::numeric / 
        NULLIF(COUNT(*), 0) * 100, 
        2
    ) as success_rate,
    AVG("creditsUsed") as avg_credits_per_video,
    ROUND(AVG(
        CASE 
            WHEN status = 'COMPLETED' AND "updatedAt" > "createdAt"
            THEN EXTRACT(EPOCH FROM ("updatedAt" - "createdAt"))
        END
    )::numeric, 2) as avg_processing_seconds
FROM "Video"
GROUP BY provider;

-- 7. VIEW DE PLANOS COM ESTATÍSTICAS DE USO
-- ============================================
CREATE OR REPLACE VIEW plan_usage_stats AS
SELECT 
    p.id as plan_id,
    p.name as plan_name,
    p."displayName",
    p.credits as monthly_credits,
    p."priceMonthly",
    p."priceYearly",
    COUNT(DISTINCT s."userId") as active_subscribers,
    COUNT(DISTINCT CASE WHEN s.interval = 'MONTHLY' THEN s."userId" END) as monthly_subscribers,
    COUNT(DISTINCT CASE WHEN s.interval = 'YEARLY' THEN s."userId" END) as yearly_subscribers,
    SUM(CASE WHEN s.interval = 'MONTHLY' THEN p."priceMonthly" ELSE p."priceYearly"/12 END) as monthly_revenue
FROM "Plan" p
LEFT JOIN "Subscription" s ON s."planId" = p.id AND s.status = 'ACTIVE'
WHERE p."isActive" = true
GROUP BY p.id, p.name, p."displayName", p.credits, p."priceMonthly", p."priceYearly";

-- 8. VIEW DE AUDITORIA RESUMIDA
-- ============================================
CREATE OR REPLACE VIEW audit_summary AS
SELECT 
    DATE_TRUNC('day', "createdAt") as audit_date,
    action,
    resource,
    COUNT(*) as event_count,
    COUNT(DISTINCT "userId") as unique_users,
    COUNT(DISTINCT "ipAddress") as unique_ips
FROM "AuditLog"
GROUP BY DATE_TRUNC('day', "createdAt"), action, resource
ORDER BY audit_date DESC, event_count DESC;

-- 9. VIEW DE USUÁRIOS COM RISCO DE CHURN
-- ============================================
CREATE OR REPLACE VIEW users_at_risk AS
SELECT 
    u.id,
    u.email,
    u.credits,
    u."lastLoginAt",
    CURRENT_DATE - DATE(u."lastLoginAt") as days_since_login,
    s.status as subscription_status,
    s."cancelAtPeriodEnd",
    s."currentPeriodEnd",
    (
        SELECT COUNT(*) 
        FROM "Video" v 
        WHERE v."userId" = u.id 
        AND v."createdAt" > CURRENT_DATE - INTERVAL '30 days'
    ) as videos_last_30_days
FROM "User" u
LEFT JOIN "Subscription" s ON s."userId" = u.id
WHERE u."isActive" = true
AND (
    -- Não fez login há mais de 30 dias
    u."lastLoginAt" < CURRENT_DATE - INTERVAL '30 days'
    OR 
    -- Tem assinatura cancelando
    s."cancelAtPeriodEnd" = true
    OR
    -- Não criou vídeos nos últimos 30 dias
    NOT EXISTS (
        SELECT 1 FROM "Video" v 
        WHERE v."userId" = u.id 
        AND v."createdAt" > CURRENT_DATE - INTERVAL '30 days'
    )
);

-- 10. VIEW DE MÉTRICAS GERAIS DO SISTEMA
-- ============================================
CREATE OR REPLACE VIEW system_metrics AS
SELECT 
    (SELECT COUNT(*) FROM "User" WHERE "isActive" = true) as total_active_users,
    (SELECT COUNT(*) FROM "User" WHERE "createdAt" > CURRENT_DATE - INTERVAL '30 days') as new_users_30d,
    (SELECT COUNT(*) FROM "Subscription" WHERE status = 'ACTIVE') as active_subscriptions,
    (SELECT COUNT(*) FROM "Video" WHERE status = 'COMPLETED') as total_videos_generated,
    (SELECT COUNT(*) FROM "Video" WHERE "createdAt" > CURRENT_DATE - INTERVAL '24 hours') as videos_last_24h,
    (SELECT SUM(amount) FROM "Transaction" WHERE status = 'COMPLETED' AND "createdAt" > CURRENT_DATE - INTERVAL '30 days') as revenue_last_30d,
    (SELECT AVG(credits) FROM "User" WHERE "isActive" = true) as avg_user_credits,
    (SELECT COUNT(*) FROM "Video" WHERE status IN ('QUEUED', 'PROCESSING')) as videos_in_queue;

-- FIM DO SCRIPT DE VIEWS
-- ============================================