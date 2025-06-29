# Sistema de Referral - Status da Implementação

## ✅ O que foi implementado

### 1. **Sistema de Referral Completo (5% de comissão vitalícia)**
- Comissão de 5% em todas as compras (assinaturas e pacotes de créditos)
- Sistema de nível único (apenas indicações diretas)
- Código de referral gerado automaticamente para cada usuário (formato cuid)
- Rastreamento via cookies (30 dias de duração)

### 2. **Banco de Dados**
- Novos campos no modelo User:
  - `referralCode` - código único de referral
  - `referredById` - ID de quem indicou
- Novos modelos:
  - `ReferralEarning` - ganhos de cada indicação
  - `ReferralPayout` - saques realizados
  - `ReferralStats` - estatísticas agregadas

### 3. **APIs Implementadas**
- `/api/referral/link` - Obter link de referral
- `/api/referral/stats` - Estatísticas e ganhos
- `/api/referral/request-payout` - Solicitar saque (mínimo $10)
- `/api/admin/referrals` - Gerenciamento admin

### 4. **Interface do Usuário**
- Dashboard de referral completo com:
  - Link de referral com botões copiar/compartilhar
  - Estatísticas (total indicados, ganhos, pendente, pago)
  - Lista de indicados com status
  - Histórico de ganhos
  - Histórico de saques
  - Modal para solicitar saque (USDT em ERC20, SOL, Polygon)

### 5. **Painel Administrativo**
- Nova página em `/admin/referrals` com:
  - Resumo geral (usuários, indicações, ganhos totais)
  - Tabela de usuários com códigos de referral
  - Estatísticas individuais
  - Busca por email/nome/código
- Nova página em `/admin/pricing-config`:
  - Exibição dos planos e preços do arquivo de configuração
  - Visualização dos pacotes de créditos
  - Uso de créditos por provedor

### 6. **Integração com Pagamentos**
- Webhook do Stripe atualizado para processar comissões
- Cálculo automático de 5% em todas as transações
- Suporte para pagamentos únicos e assinaturas recorrentes

## 📋 Pendências

### 1. **Migração do Banco de Dados**
Você precisa executar o seguinte SQL no Supabase:

```sql
-- Remove conflicting triggers first
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON "UserPreferences";
DROP TRIGGER IF EXISTS update_referral_earning_updated_at ON "ReferralEarning";
DROP TRIGGER IF EXISTS update_referral_payout_updated_at ON "ReferralPayout";
DROP TRIGGER IF EXISTS update_referral_stats_updated_at ON "ReferralStats";

-- Add referral fields to User table
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "referralCode" TEXT UNIQUE DEFAULT gen_random_uuid()::text,
ADD COLUMN IF NOT EXISTS "referredById" TEXT;

-- Add foreign key for referredById
ALTER TABLE "User" 
ADD CONSTRAINT "User_referredById_fkey" 
FOREIGN KEY ("referredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create ReferralEarning table
CREATE TABLE IF NOT EXISTS "ReferralEarning" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralEarning_pkey" PRIMARY KEY ("id")
);

-- Create ReferralPayout table
CREATE TABLE IF NOT EXISTS "ReferralPayout" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "method" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "network" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "transactionHash" TEXT,
    "processedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralPayout_pkey" PRIMARY KEY ("id")
);

-- Create ReferralStats table
CREATE TABLE IF NOT EXISTS "ReferralStats" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "totalReferrals" INTEGER NOT NULL DEFAULT 0,
    "activeReferrals" INTEGER NOT NULL DEFAULT 0,
    "totalEarnings" INTEGER NOT NULL DEFAULT 0,
    "pendingEarnings" INTEGER NOT NULL DEFAULT 0,
    "paidEarnings" INTEGER NOT NULL DEFAULT 0,
    "lastCalculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralStats_pkey" PRIMARY KEY ("id")
);

-- Create UserPreferences table if not exists
CREATE TABLE IF NOT EXISTS "UserPreferences" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'system',
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "marketingEmails" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- Add indexes
CREATE INDEX IF NOT EXISTS "ReferralEarning_userId_idx" ON "ReferralEarning"("userId");
CREATE INDEX IF NOT EXISTS "ReferralEarning_referredUserId_idx" ON "ReferralEarning"("referredUserId");
CREATE INDEX IF NOT EXISTS "ReferralEarning_transactionId_idx" ON "ReferralEarning"("transactionId");
CREATE INDEX IF NOT EXISTS "ReferralPayout_userId_idx" ON "ReferralPayout"("userId");
CREATE INDEX IF NOT EXISTS "ReferralPayout_status_idx" ON "ReferralPayout"("status");
CREATE UNIQUE INDEX IF NOT EXISTS "ReferralStats_userId_key" ON "ReferralStats"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "UserPreferences_userId_key" ON "UserPreferences"("userId");
CREATE INDEX IF NOT EXISTS "User_referredById_idx" ON "User"("referredById");

-- Add foreign keys
ALTER TABLE "ReferralEarning" ADD CONSTRAINT "ReferralEarning_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReferralEarning" ADD CONSTRAINT "ReferralEarning_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReferralPayout" ADD CONSTRAINT "ReferralPayout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReferralStats" ADD CONSTRAINT "ReferralStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

### 2. **Configuração do Email**
- Configurar notificações de email para:
  - Novo indicado se cadastrou
  - Comissão confirmada
  - Saque processado

### 3. **Testes End-to-End**
- Testar fluxo completo de indicação
- Testar cálculo de comissões
- Testar solicitação de saque

## 🔗 Links Importantes

### Para Usuários:
- Dashboard de Referral: Integrado ao dashboard principal
- Link de teste: `/test-referral`

### Para Administradores:
- Gerenciar Referrals: `/admin/referrals`
- Processar Saques: `/admin/payouts`
- Configuração de Preços: `/admin/pricing-config`

## 💡 Como Usar

1. **Para o usuário gerar seu link:**
   - Acessar o dashboard
   - O link de referral será exibido automaticamente
   - Compartilhar o link com amigos

2. **Para processar saques (Admin):**
   - Acessar `/admin/payouts`
   - Ver solicitações pendentes
   - Processar com hash da transação

3. **Monitorar indicações (Admin):**
   - Acessar `/admin/referrals`
   - Ver estatísticas gerais
   - Buscar usuários específicos

## 🔐 Segurança

- Validação de endereços crypto antes do saque
- Mínimo de $10 para solicitar saque
- Auditoria completa de todas as transações
- Proteção contra manipulação de cookies