# Configuração de Login - Kylo AI Video Hub

## Problemas Identificados e Soluções

### 1. Login com Email/Senha

**Status**: ✅ Funcionando corretamente

O sistema de login com email/senha está funcionando. O erro "Invalid email or password" é esperado quando:
- O usuário não existe no banco de dados
- A senha está incorreta
- A conta está bloqueada (após 5 tentativas falhas)

### 2. Registro de Novos Usuários

**Problema**: O registro falha porque a tabela `Plan` não tem o plano "free" cadastrado.

**Solução**: Execute o seguinte script SQL no Supabase:

```sql
-- Criar planos básicos
INSERT INTO "Plan" (id, name, "displayName", description, "monthlyPrice", "yearlyPrice", credits, features, "isActive")
VALUES 
  ('free', 'free', 'Free', 'Perfect for trying out', 0, 0, 300, '["300 free credits", "Videos up to 5 seconds", "Slower generation speed", "No commercial use", "Watermark", "Email support"]', true),
  ('lite', 'lite', 'Lite', 'Great for beginners', 8, 80, 1000, '["1000 credits per month", "Commercial use allowed", "Videos up to 10 seconds", "HD resolution", "No watermark"]', true),
  ('creator', 'creator', 'Creator', 'Ideal for content creators', 26, 260, 4000, '["4000 credits per month", "Priority queue", "Videos up to 20 seconds", "Full HD resolution", "Priority support"]', true),
  ('professional', 'professional', 'Professional', 'For intensive commercial use', 68, 680, 12000, '["12000 credits per month", "VIP queue", "Videos up to 30 seconds", "4K resolution", "Dedicated support"]', true);
```

### 3. Login com Google

**Problema**: Google OAuth não está configurado.

**Solução**: Configure as variáveis de ambiente:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para "APIs & Services" > "Credentials"
4. Clique em "Create Credentials" > "OAuth client ID"
5. Escolha "Web application"
6. Configure:
   - Authorized JavaScript origins: `http://localhost:3002`
   - Authorized redirect URIs: `http://localhost:3002/api/auth/callback/google`
7. Copie o Client ID e Client Secret

No arquivo `.env.local`, adicione:

```env
# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui

# NextAuth
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=gere_uma_chave_aleatória_com_openssl_rand_base64_32
```

### 4. Migrações do Banco de Dados

Se houver problemas com o schema do banco:

```bash
# Gerar cliente Prisma
npx prisma generate

# Sincronizar schema com banco (desenvolvimento)
npx prisma db push

# Ou criar migração (produção)
npx prisma migrate dev --name add_missing_fields
```

### 5. Criando um Usuário de Teste

Execute este script SQL no Supabase para criar um usuário de teste:

```sql
-- Criar usuário de teste (senha: Test1234!)
INSERT INTO "User" (
  id, 
  email, 
  name, 
  "passwordHash",
  "emailVerified",
  credits,
  role,
  "isActive"
) VALUES (
  'test-user-id',
  'test@example.com',
  'Test User',
  '$2a$10$YourHashedPasswordHere', -- Use bcrypt para gerar
  NOW(),
  1000,
  'USER',
  true
);
```

Ou use o script TypeScript incluído:

```bash
npx tsx tests/create-test-user.ts
```

## Testando o Sistema

1. **Login com Email/Senha**:
   - Email: `test@example.com`
   - Senha: `Test1234!`

2. **Login com Google**:
   - Configure as variáveis de ambiente primeiro
   - Reinicie o servidor de desenvolvimento
   - Clique no botão "Google" na tela de login

## Variáveis de Ambiente Necessárias

```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# NextAuth
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=sua_chave_secreta_aqui

# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

## Troubleshooting

### Erro: "Invalid email or password"
- Verifique se o usuário existe no banco
- Confirme que a senha está correta
- Verifique se a conta não está bloqueada

### Erro: "Error creating account"
- Verifique se os planos existem no banco
- Confirme que o Prisma Client está atualizado
- Verifique os logs do servidor para detalhes

### Erro com Google OAuth
- Confirme que as variáveis GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão configuradas
- Verifique se o NEXTAUTH_URL está correto
- Certifique-se de que o callback URL está configurado no Google Console