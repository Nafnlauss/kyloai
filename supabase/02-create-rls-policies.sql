-- ============================================
-- POLÍTICAS DE SEGURANÇA ROW LEVEL SECURITY (RLS)
-- Execute este arquivo após criar as tabelas
-- ============================================

-- 1. HABILITAR RLS EM TODAS AS TABELAS
-- ============================================
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Plan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Video" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CreditHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CreditPack" ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICAS PARA TABELA USER
-- ============================================
-- Usuários podem ver apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON "User"
    FOR SELECT USING (auth.uid()::text = id);

-- Usuários podem atualizar apenas seu próprio perfil
CREATE POLICY "Users can update own profile" ON "User"
    FOR UPDATE USING (auth.uid()::text = id)
    WITH CHECK (auth.uid()::text = id);

-- Admins podem ver todos os usuários
CREATE POLICY "Admins can view all users" ON "User"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE id = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- 3. POLÍTICAS PARA TABELA PLAN
-- ============================================
-- Todos podem ver planos ativos
CREATE POLICY "Anyone can view active plans" ON "Plan"
    FOR SELECT USING ("isActive" = true);

-- Apenas admins podem modificar planos
CREATE POLICY "Only admins can manage plans" ON "Plan"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE id = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- 4. POLÍTICAS PARA TABELA SUBSCRIPTION
-- ============================================
-- Usuários podem ver apenas suas próprias assinaturas
CREATE POLICY "Users can view own subscriptions" ON "Subscription"
    FOR SELECT USING ("userId" = auth.uid()::text);

-- Sistema pode criar/atualizar assinaturas (via service role)
CREATE POLICY "Service role can manage subscriptions" ON "Subscription"
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- 5. POLÍTICAS PARA TABELA VIDEO
-- ============================================
-- Usuários podem ver apenas seus próprios vídeos
CREATE POLICY "Users can view own videos" ON "Video"
    FOR SELECT USING ("userId" = auth.uid()::text);

-- Usuários podem criar vídeos
CREATE POLICY "Users can create videos" ON "Video"
    FOR INSERT WITH CHECK ("userId" = auth.uid()::text);

-- Usuários podem atualizar seus próprios vídeos
CREATE POLICY "Users can update own videos" ON "Video"
    FOR UPDATE USING ("userId" = auth.uid()::text)
    WITH CHECK ("userId" = auth.uid()::text);

-- Usuários podem deletar seus próprios vídeos
CREATE POLICY "Users can delete own videos" ON "Video"
    FOR DELETE USING ("userId" = auth.uid()::text);

-- 6. POLÍTICAS PARA TABELA TRANSACTION
-- ============================================
-- Usuários podem ver apenas suas próprias transações
CREATE POLICY "Users can view own transactions" ON "Transaction"
    FOR SELECT USING ("userId" = auth.uid()::text);

-- Sistema pode criar transações (via service role)
CREATE POLICY "Service role can create transactions" ON "Transaction"
    FOR INSERT USING (auth.jwt()->>'role' = 'service_role');

-- 7. POLÍTICAS PARA TABELA AUDITLOG
-- ============================================
-- Apenas admins podem ver logs de auditoria
CREATE POLICY "Only admins can view audit logs" ON "AuditLog"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE id = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- Sistema pode criar logs (via service role)
CREATE POLICY "Service role can create audit logs" ON "AuditLog"
    FOR INSERT USING (auth.jwt()->>'role' = 'service_role');

-- 8. POLÍTICAS PARA TABELA CREDITHISTORY
-- ============================================
-- Usuários podem ver apenas seu próprio histórico
CREATE POLICY "Users can view own credit history" ON "CreditHistory"
    FOR SELECT USING ("userId" = auth.uid()::text);

-- Sistema pode gerenciar histórico de créditos
CREATE POLICY "Service role can manage credit history" ON "CreditHistory"
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- 9. POLÍTICAS PARA TABELA CREDITPACK
-- ============================================
-- Todos podem ver pacotes de crédito ativos
CREATE POLICY "Anyone can view active credit packs" ON "CreditPack"
    FOR SELECT USING ("isActive" = true);

-- Apenas admins podem gerenciar pacotes
CREATE POLICY "Only admins can manage credit packs" ON "CreditPack"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "User" 
            WHERE id = auth.uid()::text 
            AND role = 'ADMIN'
        )
    );

-- FIM DO SCRIPT RLS
-- ============================================