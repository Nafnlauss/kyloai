# 🗑️ EXCLUSÃO DE USUÁRIOS - BANCO DE DADOS + SUPABASE AUTH

## ✅ Como Funciona

Quando você deleta um usuário pelo painel administrativo, o sistema:

1. **Deleta do Banco de Dados (Prisma)**:
   - Remove todos os dados relacionados (vídeos, transações, sessões, etc.)
   - Usa transação para garantir integridade
   - SEMPRE acontece

2. **Deleta do Supabase Auth** (se configurado):
   - Tenta remover o usuário do Supabase Auth
   - Usa o Service Role Key para ter permissão admin
   - Se falhar, continua mesmo assim (não bloqueia a exclusão)

## 📋 Verificar Configuração

Execute o teste para verificar se está tudo configurado:

```bash
cd ai-video-hub/tests
node test-delete-supabase.js
```

## ⚙️ Configuração Necessária

No arquivo `.env.local`, você precisa ter:

```env
# URL pública do Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[seu-projeto].supabase.co

# Service Role Key (encontrada no painel do Supabase)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Onde encontrar a Service Role Key:
1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em Settings → API
3. Copie a "service_role" key (não a "anon" key!)

## 🔍 Cenários de Exclusão

### ✅ Cenário 1: Usuário existe em ambos
- Usuário criado via Supabase Auth (login social, magic link, etc.)
- ID do banco = ID do Supabase Auth
- **Resultado**: Deletado de ambos os lugares

### ✅ Cenário 2: Usuário existe apenas no banco
- Usuário criado manualmente (scripts de teste, importação, etc.)
- Não tem conta no Supabase Auth
- **Resultado**: Deletado apenas do banco (sem erros)

### ⚠️ Cenário 3: IDs diferentes
- Usuário tem ID diferente no banco e no Supabase Auth
- **Resultado**: Deletado apenas do banco

## 🛡️ Segurança

- A exclusão requer privilégios de ADMIN
- Não é possível deletar sua própria conta
- Não é possível deletar outros admins
- Todas as exclusões são registradas nos logs de auditoria
- Modal de confirmação obrigatório

## 📝 Logs

Quando uma exclusão ocorre, você verá no console do servidor:

```
✅ Sucesso completo:
"User deleted from Supabase Auth successfully"

⚠️ Apenas banco deletado:
"Failed to delete user from Supabase Auth: [erro]"
"Error deleting from Supabase Auth: [erro]"
```

## 🚨 Importante

1. **A exclusão é PERMANENTE** - não há como desfazer
2. **Faça backup** antes de deletar usuários importantes
3. **Service Role Key** deve ser mantida em segredo (nunca exponha no frontend)
4. Se o Supabase não estiver configurado, apenas o banco será afetado