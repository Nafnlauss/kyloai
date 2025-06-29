# 🛡️ BACKUP DO DASHBOARD ADMINISTRATIVO KYLO

**Data do Backup**: 28/06/2025  
**Versão**: 1.0.0

## 📍 ACESSO RÁPIDO

### Desenvolvimento Local
```bash
cd ai-video-hub
pnpm dev
# Acesse: http://localhost:3000/admin/overview
```

### Usuário Admin de Teste
- **Email**: admin@example.com
- **Senha**: (verificar no banco ou criar novo)
- **Créditos**: 9999
- **Role**: ADMIN

## 🗂️ ESTRUTURA DE ARQUIVOS

### Páginas do Admin (`src/app/admin/`)
```
admin/
├── layout.tsx          # Layout principal do admin
├── page.tsx           # Redirect para /admin/overview
├── overview/          # Dashboard principal
│   └── page.tsx      
├── users/             # Gestão de usuários
│   └── page.tsx      
├── transactions/      # Histórico de transações
│   └── page.tsx      
├── payments/          # Pagamentos e assinaturas
│   └── page.tsx      
├── videos/            # Vídeos gerados
│   └── page.tsx      
├── credits/           # Gestão de créditos
│   └── page.tsx      
├── plans/             # Planos de assinatura
│   └── page.tsx      
├── pricing/           # Configuração de preços
│   └── page.tsx      
├── api-status/        # Status das APIs
│   └── page.tsx      
├── metrics/           # Métricas detalhadas
│   └── page.tsx      
├── audit/             # Logs de auditoria
│   └── page.tsx      
├── alerts/            # Sistema de alertas
│   └── page.tsx      
├── integrations/      # Integrações
│   └── page.tsx      
└── stripe/            # Configurações Stripe
    └── page.tsx      
```

### Componentes do Admin (`src/components/admin/`)
```
admin/
├── admin-header.tsx              # Header do admin
├── admin-sidebar.tsx             # Sidebar com navegação
├── demo-admin-header.tsx         # Header modo demo
├── demo-admin-sidebar.tsx        # Sidebar modo demo
├── overview.tsx                  # Cards e gráficos do dashboard
├── users-data-table.tsx          # Tabela de usuários
├── payments-table.tsx            # Tabela de pagamentos
├── data-table.tsx               # Componente genérico de tabela
├── api-usage-chart.tsx          # Gráfico de uso das APIs
├── profitability-card.tsx       # Card de lucratividade
├── stripe-stats.tsx             # Estatísticas do Stripe
├── recent-sales.tsx             # Vendas recentes
├── notification-center.tsx       # Centro de notificações
├── edit-user-credits-dialog.tsx  # Modal editar créditos
├── confirm-dialog.tsx           # Modal de confirmação
├── export-button.tsx            # Botão de exportar dados
├── empty-state.tsx              # Estado vazio
└── theme-toggle.tsx             # Toggle tema claro/escuro
```

### APIs do Admin (`src/app/api/admin/`)
```
api/admin/
├── users/
│   ├── route.ts                    # GET (listar), POST (criar)
│   ├── [userId]/
│   │   ├── route.ts               # GET, PATCH, DELETE usuário
│   │   └── role/
│   │       └── route.ts           # PATCH role do usuário
│   └── debug/
│       └── route.ts               # Debug de usuários
├── metrics/
│   ├── route.ts                   # Métricas gerais
│   ├── simple/
│   │   └── route.ts              # Métricas simplificadas
│   ├── performance/
│   │   └── route.ts              # Métricas de performance
│   └── v2/
│       └── route.ts              # Métricas v2
├── transactions/
│   └── route.ts                   # GET transações
├── payments/
│   └── route.ts                   # GET pagamentos
├── videos/
│   ├── route.ts                   # GET vídeos
│   ├── stats/
│   │   └── route.ts              # Estatísticas de vídeos
│   └── [videoId]/
│       ├── route.ts              # GET, DELETE vídeo
│       └── reprocess/
│           └── route.ts          # POST reprocessar vídeo
├── credits/
│   ├── users/
│   │   └── route.ts              # Gerenciar créditos
│   └── transactions/
│       └── route.ts              # Histórico de créditos
├── stripe/
│   ├── webhook/
│   │   └── route.ts              # Webhook do Stripe
│   ├── checkout/
│   │   └── route.ts              # Criar checkout
│   ├── products/
│   │   └── route.ts              # Produtos Stripe
│   ├── payments/
│   │   └── route.ts              # Pagamentos Stripe
│   ├── mrr/
│   │   └── route.ts              # MRR (Monthly Recurring Revenue)
│   └── session/
│       └── [id]/
│           └── route.ts          # Sessão específica
├── plans/
│   └── route.ts                   # CRUD de planos
├── alerts/
│   └── route.ts                   # Sistema de alertas
├── audit/
│   └── route.ts                   # Logs de auditoria
├── api-health/
│   └── route.ts                   # Saúde das APIs
├── integrations/
│   └── check-all/
│       └── route.ts              # Verificar integrações
├── notifications/
│   └── route.ts                   # Notificações
├── stats/
│   └── route.ts                   # Estatísticas gerais
└── video-logs/
    └── route.ts                   # Logs de vídeos
```

## 🔑 CONFIGURAÇÕES IMPORTANTES

### Modo Demo
```typescript
// Em qualquer componente admin
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

// Bloquear ações de escrita
if (isDemoMode) {
  toast.info("Modo demo: ação simulada");
  return;
}
```

### Middleware de Autenticação Admin
```typescript
// src/components/auth/with-admin-auth.tsx
import { withAdminAuth } from '@/components/auth/with-admin-auth';

// Uso em páginas admin
export default withAdminAuth(AdminPage);
```

### Verificação de Role
```typescript
// Em APIs admin
const session = await getServerSession(authOptions);
if (session?.user?.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
```

## 📊 FUNCIONALIDADES PRINCIPAIS

### 1. Dashboard Overview
- **KPIs**: MRR, Churn, Taxa de Conversão, ARPU
- **Gráficos**: Receita, Usuários, Uso de APIs
- **Cards**: Total de usuários, vídeos, receita

### 2. Gestão de Usuários
- Listar todos usuários com filtros
- Editar créditos e role
- Visualizar histórico
- Deletar usuários (soft delete)

### 3. Transações e Pagamentos
- Histórico completo
- Filtros por data, valor, status
- Export para CSV
- Detalhes de cada transação

### 4. Monitoramento de APIs
- Status em tempo real
- Taxa de sucesso/erro
- Tempo de resposta
- Custos por provider

### 5. Sistema de Alertas
- Alertas configuráveis
- Notificações por email
- Dashboard de alertas ativos
- Histórico de alertas

## 🚀 COMANDOS ÚTEIS

### Desenvolvimento
```bash
# Iniciar em modo desenvolvimento
cd ai-video-hub
pnpm dev

# Build para produção
pnpm build

# Verificar tipos TypeScript
pnpm tsc --noEmit
```

### Banco de Dados
```bash
# Listar usuários admin
node -e "const {PrismaClient} = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.findMany({where:{role:'ADMIN'}}).then(console.log)"

# Promover usuário para admin
node -e "const {PrismaClient} = require('@prisma/client'); const prisma = new PrismaClient(); prisma.user.update({where:{email:'usuario@email.com'},data:{role:'ADMIN'}}).then(console.log)"
```

## 🔐 SEGURANÇA

1. **Autenticação**: NextAuth com sessões JWT
2. **Autorização**: Verificação de role ADMIN
3. **Audit Log**: Todas ações são registradas
4. **Rate Limiting**: Proteção contra abuso
5. **CSRF Protection**: Tokens em todas ações

## 📝 NOTAS IMPORTANTES

1. **Modo Demo**: Está ativo por padrão. Para produção, remova `NEXT_PUBLIC_DEMO_MODE`
2. **Dados Mock**: Em modo demo, usa @faker-js/faker
3. **Ações de Escrita**: Bloqueadas em modo demo
4. **Performance**: Usa React.memo e useMemo para otimização

## 🆘 TROUBLESHOOTING

### Admin não carrega
1. Verificar se o usuário tem role=ADMIN
2. Verificar sessão do NextAuth
3. Verificar console do navegador

### Dados não aparecem
1. Em modo demo, são dados mock
2. Em produção, verificar conexão com banco
3. Verificar permissões do usuário

### Erro 403 Forbidden
1. Usuário não é admin
2. Sessão expirada
3. Token inválido

## 📱 SCREENSHOTS E FLUXOS

### Fluxo de Acesso
1. Login em /login
2. Verificação de role ADMIN
3. Redirect para /admin/overview
4. Navegação pelo sidebar

### Principais Telas
- **Overview**: Dashboard com métricas
- **Users**: Tabela de gestão
- **Transactions**: Histórico financeiro
- **API Status**: Monitoramento em tempo real

---

**BACKUP CRIADO COM SUCESSO!** 
Este documento contém todas as informações necessárias para manter e acessar o dashboard administrativo.