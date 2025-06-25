# 🚀 Instruções de Setup do Banco de Dados Supabase

## 📋 Ordem de Execução dos Scripts

Execute os scripts SQL na seguinte ordem no **Supabase SQL Editor**:

1. **01-create-all-tables.sql** - Cria todas as tabelas, tipos e dados iniciais
2. **02-create-rls-policies.sql** - Configura políticas de segurança Row Level Security
3. **03-create-functions.sql** - Cria funções úteis do sistema
4. **04-create-indexes.sql** - Cria índices para otimização
5. **05-create-triggers.sql** - Cria triggers automáticos
6. **06-create-views.sql** - Cria views para consultas otimizadas

## 🔧 Como Executar no Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá para **SQL Editor** no menu lateral
3. Clique em **New Query**
4. Copie e cole o conteúdo de cada arquivo SQL
5. Clique em **Run** para executar
6. Repita para cada arquivo na ordem indicada

## ⚠️ Importante

### Antes de Executar
- **Faça backup** do banco se já tiver dados
- Os scripts são **idempotentes** (podem ser executados múltiplas vezes)
- Verifique se não há erros após cada execução

### Configuração do Prisma
Após executar todos os scripts SQL, atualize o Prisma:

```bash
# Sincronizar o schema do Prisma com o banco
pnpm prisma db pull

# Gerar o cliente Prisma
pnpm prisma generate
```

### Variáveis de Ambiente
Certifique-se de ter as seguintes variáveis no `.env.local`:

```env
# Supabase
DATABASE_URL="postgresql://postgres:[senha]@db.[project-ref].supabase.co:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[project-ref].supabase.com"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[anon-key]"
SUPABASE_SERVICE_ROLE_KEY="[service-role-key]"
```

## 🔒 Segurança

### Row Level Security (RLS)
- Todas as tabelas têm RLS habilitado
- Usuários só podem ver seus próprios dados
- Admins têm acesso expandido
- Service role tem acesso total

### Políticas Implementadas
- ✅ Usuários veem apenas seus vídeos
- ✅ Usuários veem apenas suas transações
- ✅ Planos públicos visíveis para todos
- ✅ Audit logs apenas para admins
- ✅ Créditos protegidos por triggers

## 📊 Dados Iniciais

### Planos Criados
- **Free**: 10 créditos/mês - $0
- **Lite**: 50 créditos/mês - $12
- **Creator**: 150 créditos/mês - $29
- **Professional**: 500 créditos/mês - $79

### Pacotes de Créditos
- 1,000 créditos - $19
- 2,500 créditos - $39
- 7,000 créditos - $89
- 16,000 créditos - $179

## 🛠️ Funções Disponíveis

### Gestão de Créditos
- `deduct_user_credits()` - Deduz créditos do usuário
- `add_user_credits()` - Adiciona créditos ao usuário
- `check_credit_limit()` - Verifica se tem créditos suficientes
- `reset_monthly_credits()` - Reseta créditos mensais

### Estatísticas
- `get_user_stats()` - Estatísticas do usuário
- `get_credit_usage_by_period()` - Uso de créditos por período

### Manutenção
- `cleanup_old_videos()` - Limpa vídeos antigos
- `log_audit_action()` - Registra ações de auditoria

## 📈 Views Úteis

- `user_subscription_info` - Informações completas de usuários e assinaturas
- `user_video_stats` - Estatísticas de vídeos por usuário
- `provider_performance` - Performance dos providers (Luma/Kling)
- `system_metrics` - Métricas gerais do sistema
- `users_at_risk` - Usuários com risco de cancelamento

## 🔍 Verificação

Após executar todos os scripts, verifique:

```sql
-- Verificar tabelas criadas
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;

-- Verificar RLS habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verificar planos criados
SELECT * FROM "Plan";

-- Verificar views criadas
SELECT viewname FROM pg_views 
WHERE schemaname = 'public';
```

## 🚨 Troubleshooting

### Erro de Permissão
Se receber erro de permissão, execute como service role ou admin.

### Erro de Tipo Já Existe
Os scripts já tratam isso com `IF NOT EXISTS`, mas se persistir, ignore.

### Conexão WSL
Se estiver no WSL e não conseguir conectar:
1. Use uma VPN
2. Ou execute diretamente no Supabase Dashboard
3. Ou use um cliente SQL fora do WSL

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs no Supabase Dashboard
2. Consulte a [documentação do Supabase](https://supabase.com/docs)
3. Abra uma issue no repositório do projeto