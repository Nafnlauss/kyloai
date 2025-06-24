# Instruções de Login - Kylo AI Video Hub

## 1. Criar Usuário de Teste

Execute o seguinte SQL no Supabase SQL Editor:

```sql
-- Criar usuário de teste para login
-- Email: test@example.com
-- Senha: Test1234!

INSERT INTO "User" (
    id,
    email,
    name,
    "passwordHash",
    "emailVerified",
    credits,
    "creditsLastReset",
    role,
    "isActive",
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid()::text,
    'test@example.com',
    'Test User',
    '$2a$10$YH6X.XqKqCr8kCVwnbSjHuLqNhhYXY3CyVFvWDnXqKEYL7XKpjGHO',
    NOW(),
    300,
    NOW(),
    'USER',
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;
```

## 2. Testar Login

Após criar o usuário, você pode fazer login com:
- **Email**: test@example.com
- **Senha**: Test1234!

## 3. Sistema de Créditos

Usuários free (sem assinatura) recebem:
- 300 créditos gratuitos por mês
- Os créditos são resetados mensalmente
- Precisa estar logado para usar os créditos

## 4. Configurar Google OAuth (Opcional)

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou use um existente
3. Ative a API do Google+ 
4. Crie credenciais OAuth 2.0
5. Configure:
   - Authorized JavaScript origins: `http://localhost:3002`
   - Authorized redirect URIs: `http://localhost:3002/api/auth/callback/google`

6. Adicione ao `.env.local`:
```env
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui
```

## 5. Problemas Comuns

### Erro "Error creating account"
- Geralmente indica problema no banco de dados
- Verifique se todas as colunas necessárias existem
- Execute `npx prisma db push` para sincronizar o schema

### Erro "Invalid email or password"
- Confirme que o usuário foi criado no banco
- Verifique se está usando a senha correta
- A senha é case-sensitive

### Login com Google não funciona
- Verifique se as variáveis GOOGLE_CLIENT_ID e GOOGLE_CLIENT_SECRET estão configuradas
- Confirme que o NEXTAUTH_URL está correto no .env.local
- O callback URL deve estar configurado no Google Console