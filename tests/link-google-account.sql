-- Script para conectar conta Google a usuário existente
-- Execute no Supabase SQL Editor

-- 1. Primeiro, verifique se o usuário existe
SELECT id, email, name FROM "User" 
WHERE email = 'leonardovyguimaraes@gmail.com';

-- 2. Se o usuário existir, copie o ID e use aqui:
-- Substitua 'USER_ID_AQUI' pelo ID real do usuário
INSERT INTO "Account" (
  id,
  userId,
  type,
  provider,
  providerAccountId,
  access_token,
  token_type,
  scope
) VALUES (
  gen_random_uuid()::text,
  'USER_ID_AQUI', -- Substitua pelo ID do usuário
  'oidc',
  'google',
  '112331654460903776771',
  'dummy_token',
  'bearer',
  'openid email profile'
);

-- 3. Verifique se funcionou
SELECT * FROM "Account" WHERE provider = 'google';