-- Criar usuário de teste para login
-- Email: test@example.com
-- Senha: Test1234!

-- O hash abaixo é para a senha "Test1234!" gerado com bcrypt (10 rounds)
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

-- Verificar se o usuário foi criado
SELECT id, email, name, credits, role FROM "User" WHERE email = 'test@example.com';