-- ============================================
-- SCRIPT PARA VERIFICAR O QUE JÁ EXISTE NO BANCO
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. VERIFICAR TABELAS EXISTENTES
-- ============================================
SELECT 
    'TABELAS EXISTENTES:' as info;

SELECT 
    tablename as tabela,
    CASE 
        WHEN tablename IN ('User', 'Plan', 'Subscription', 'Video', 'Transaction', 'AuditLog', 'CreditHistory', 'CreditPack', 'Account', 'Session', 'ApiKey') 
        THEN '✅ Existe' 
        ELSE '❌ Não encontrada' 
    END as status
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('User', 'Plan', 'Subscription', 'Video', 'Transaction', 'AuditLog', 'CreditHistory', 'CreditPack', 'Account', 'Session', 'ApiKey')
ORDER BY tablename;

-- 2. VERIFICAR TIPOS ENUM
-- ============================================
SELECT 
    '---' as separator,
    'TIPOS ENUM EXISTENTES:' as info;

SELECT 
    typname as tipo_enum,
    array_to_string(enum_range(NULL::regtype)::text[], ', ') as valores
FROM pg_type 
WHERE typcategory = 'E' 
AND typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY typname;

-- 3. VERIFICAR COLUNAS DA TABELA USER
-- ============================================
SELECT 
    '---' as separator,
    'COLUNAS DA TABELA USER:' as info;

SELECT 
    column_name as coluna,
    data_type as tipo,
    is_nullable as permite_nulo,
    column_default as valor_padrao
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'User'
ORDER BY ordinal_position;

-- 4. VERIFICAR ÍNDICES
-- ============================================
SELECT 
    '---' as separator,
    'ÍNDICES EXISTENTES:' as info;

SELECT 
    tablename as tabela,
    indexname as indice
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('User', 'Plan', 'Subscription', 'Video', 'Transaction', 'AuditLog', 'CreditHistory')
ORDER BY tablename, indexname;

-- 5. VERIFICAR CONSTRAINTS
-- ============================================
SELECT 
    '---' as separator,
    'FOREIGN KEYS EXISTENTES:' as info;

SELECT 
    conname as constraint_name,
    conrelid::regclass as tabela,
    confrelid::regclass as tabela_referenciada
FROM pg_constraint
WHERE contype = 'f'
AND connamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY conrelid::regclass::text;

-- 6. VERIFICAR RLS (ROW LEVEL SECURITY)
-- ============================================
SELECT 
    '---' as separator,
    'STATUS DO RLS:' as info;

SELECT 
    tablename as tabela,
    CASE rowsecurity 
        WHEN true THEN '✅ RLS Habilitado'
        ELSE '❌ RLS Desabilitado'
    END as status_rls
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('User', 'Plan', 'Subscription', 'Video', 'Transaction', 'AuditLog', 'CreditHistory')
ORDER BY tablename;

-- 7. VERIFICAR POLÍTICAS RLS
-- ============================================
SELECT 
    '---' as separator,
    'POLÍTICAS RLS EXISTENTES:' as info;

SELECT 
    tablename as tabela,
    policyname as politica,
    permissive as permissiva,
    cmd as comando
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 8. VERIFICAR FUNÇÕES CRIADAS
-- ============================================
SELECT 
    '---' as separator,
    'FUNÇÕES EXISTENTES:' as info;

SELECT 
    proname as funcao,
    pronargs as num_argumentos
FROM pg_proc
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
AND proname IN (
    'deduct_user_credits',
    'add_user_credits',
    'reset_monthly_credits',
    'get_user_stats',
    'cleanup_old_videos',
    'check_credit_limit',
    'log_audit_action',
    'get_credit_usage_by_period',
    'update_updated_at_column',
    'get_user_available_credits'
)
ORDER BY proname;

-- 9. VERIFICAR TRIGGERS
-- ============================================
SELECT 
    '---' as separator,
    'TRIGGERS EXISTENTES:' as info;

SELECT 
    trigger_name as trigger,
    event_object_table as tabela,
    event_manipulation as evento
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 10. VERIFICAR VIEWS
-- ============================================
SELECT 
    '---' as separator,
    'VIEWS EXISTENTES:' as info;

SELECT 
    viewname as view
FROM pg_views
WHERE schemaname = 'public'
ORDER BY viewname;

-- 11. VERIFICAR DADOS NAS TABELAS PRINCIPAIS
-- ============================================
SELECT 
    '---' as separator,
    'CONTAGEM DE REGISTROS:' as info;

SELECT 'User' as tabela, COUNT(*) as registros FROM "User"
UNION ALL
SELECT 'Plan' as tabela, COUNT(*) as registros FROM "Plan"
UNION ALL
SELECT 'Subscription' as tabela, COUNT(*) as registros FROM "Subscription"
UNION ALL
SELECT 'Video' as tabela, COUNT(*) as registros FROM "Video"
UNION ALL
SELECT 'Transaction' as tabela, COUNT(*) as registros FROM "Transaction"
UNION ALL
SELECT 'CreditHistory' as tabela, COUNT(*) as registros FROM "CreditHistory"
ORDER BY tabela;

-- 12. VERIFICAR PLANOS EXISTENTES
-- ============================================
SELECT 
    '---' as separator,
    'PLANOS CADASTRADOS:' as info;

SELECT 
    name as nome,
    "displayName" as nome_exibicao,
    credits as creditos,
    "priceMonthly" as preco_mensal,
    "priceYearly" as preco_anual,
    "isActive" as ativo
FROM "Plan"
ORDER BY name;

-- FIM DO SCRIPT DE VERIFICAÇÃO
-- ============================================