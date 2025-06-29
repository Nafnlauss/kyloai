-- Atualiza créditos padrão para novos usuários
-- Esta é uma migração manual opcional

-- Atualiza usuários existentes que têm exatamente 10 créditos (valor antigo padrão) para 300
UPDATE "User" 
SET credits = 300 
WHERE credits = 10;