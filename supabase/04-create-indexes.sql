-- ============================================
-- ÍNDICES PARA OTIMIZAÇÃO DE PERFORMANCE
-- Execute este arquivo após criar todas as tabelas
-- ============================================

-- 1. ÍNDICES PARA TABELA USER
-- ============================================
-- Índice para busca por email (já existe como UNIQUE)
-- CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Índice para filtrar por status ativo
CREATE INDEX IF NOT EXISTS "User_isActive_idx" ON "User"("isActive") WHERE "isActive" = true;

-- Índice para buscar admins
CREATE INDEX IF NOT EXISTS "User_role_admin_idx" ON "User"("role") WHERE "role" = 'ADMIN';

-- Índice para buscar usuários deletados
CREATE INDEX IF NOT EXISTS "User_deletedAt_idx" ON "User"("deletedAt") WHERE "deletedAt" IS NOT NULL;

-- 2. ÍNDICES PARA TABELA SUBSCRIPTION
-- ============================================
-- Índice composto para buscar assinaturas ativas por usuário
CREATE INDEX IF NOT EXISTS "Subscription_userId_status_idx" 
ON "Subscription"("userId", "status") 
WHERE "status" = 'ACTIVE';

-- Índice para assinaturas que precisam renovação
CREATE INDEX IF NOT EXISTS "Subscription_currentPeriodEnd_idx" 
ON "Subscription"("currentPeriodEnd") 
WHERE "status" = 'ACTIVE';

-- Índice para buscar por Stripe ID
CREATE INDEX IF NOT EXISTS "Subscription_stripeSubscriptionId_idx" 
ON "Subscription"("stripeSubscriptionId") 
WHERE "stripeSubscriptionId" IS NOT NULL;

-- 3. ÍNDICES PARA TABELA VIDEO
-- ============================================
-- Índice composto para listagem de vídeos do usuário
CREATE INDEX IF NOT EXISTS "Video_userId_createdAt_idx" 
ON "Video"("userId", "createdAt" DESC);

-- Índice para buscar vídeos por status
CREATE INDEX IF NOT EXISTS "Video_status_createdAt_idx" 
ON "Video"("status", "createdAt" DESC);

-- Índice para buscar vídeos processando
CREATE INDEX IF NOT EXISTS "Video_status_processing_idx" 
ON "Video"("status") 
WHERE "status" IN ('QUEUED', 'PROCESSING');

-- Índice para buscar por provider ID
CREATE INDEX IF NOT EXISTS "Video_providerId_idx" 
ON "Video"("providerId") 
WHERE "providerId" IS NOT NULL;

-- Índice para buscar vídeos por provider
CREATE INDEX IF NOT EXISTS "Video_provider_idx" 
ON "Video"("provider");

-- 4. ÍNDICES PARA TABELA TRANSACTION
-- ============================================
-- Índice composto para histórico de transações
CREATE INDEX IF NOT EXISTS "Transaction_userId_createdAt_idx" 
ON "Transaction"("userId", "createdAt" DESC);

-- Índice para transações pendentes
CREATE INDEX IF NOT EXISTS "Transaction_status_pending_idx" 
ON "Transaction"("status") 
WHERE "status" = 'PENDING';

-- Índice para buscar por Stripe Payment Intent
CREATE INDEX IF NOT EXISTS "Transaction_stripePaymentIntentId_idx" 
ON "Transaction"("stripePaymentIntentId") 
WHERE "stripePaymentIntentId" IS NOT NULL;

-- Índice para relatórios financeiros
CREATE INDEX IF NOT EXISTS "Transaction_createdAt_status_idx" 
ON "Transaction"("createdAt", "status") 
WHERE "status" = 'COMPLETED';

-- 5. ÍNDICES PARA TABELA AUDITLOG
-- ============================================
-- Índice para buscar logs por usuário e data
CREATE INDEX IF NOT EXISTS "AuditLog_userId_createdAt_idx" 
ON "AuditLog"("userId", "createdAt" DESC);

-- Índice para buscar por tipo de ação
CREATE INDEX IF NOT EXISTS "AuditLog_action_createdAt_idx" 
ON "AuditLog"("action", "createdAt" DESC);

-- Índice para buscar por recurso
CREATE INDEX IF NOT EXISTS "AuditLog_resource_resourceId_idx" 
ON "AuditLog"("resource", "resourceId");

-- 6. ÍNDICES PARA TABELA CREDITHISTORY
-- ============================================
-- Índice para histórico de créditos por usuário
CREATE INDEX IF NOT EXISTS "CreditHistory_userId_createdAt_idx" 
ON "CreditHistory"("userId", "createdAt" DESC);

-- Índice para créditos que expiram
CREATE INDEX IF NOT EXISTS "CreditHistory_expiresAt_idx" 
ON "CreditHistory"("expiresAt") 
WHERE "expiresAt" IS NOT NULL;

-- Índice para operações de crédito
CREATE INDEX IF NOT EXISTS "CreditHistory_operation_idx" 
ON "CreditHistory"("operation");

-- 7. ÍNDICES PARA ANÁLISE E RELATÓRIOS
-- ============================================
-- Índice para análise de uso mensal
CREATE INDEX IF NOT EXISTS "Video_createdAt_month_idx" 
ON "Video"(DATE_TRUNC('month', "createdAt"));

-- Índice para análise de receita mensal
CREATE INDEX IF NOT EXISTS "Transaction_createdAt_month_idx" 
ON "Transaction"(DATE_TRUNC('month', "createdAt")) 
WHERE "status" = 'COMPLETED';

-- 8. ÍNDICES PARA BUSCA FULL-TEXT (OPCIONAL)
-- ============================================
-- Criar extensão para busca full-text se necessário
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Índice para busca em prompts de vídeo
CREATE INDEX IF NOT EXISTS "Video_prompt_trgm_idx" 
ON "Video" 
USING gin ("prompt" gin_trgm_ops);

-- FIM DO SCRIPT DE ÍNDICES
-- ============================================