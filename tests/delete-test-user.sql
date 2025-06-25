-- Script para deletar usuário de teste
-- Execute no Supabase SQL Editor

-- Deleta o usuário (cascade deleta accounts, sessions, etc)
DELETE FROM "User" 
WHERE email = 'leonardovyguimaraes@gmail.com';

-- Verifica se foi deletado
SELECT * FROM "User" 
WHERE email = 'leonardovyguimaraes@gmail.com';