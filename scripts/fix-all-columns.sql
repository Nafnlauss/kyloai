-- Script para adicionar TODAS as colunas faltantes na tabela User
-- Execute este SQL no Supabase SQL Editor

-- Adiciona todas as colunas que podem estar faltando
ALTER TABLE "User" 
ADD COLUMN IF NOT EXISTS "bio" TEXT,
ADD COLUMN IF NOT EXISTS "website" TEXT,
ADD COLUMN IF NOT EXISTS "location" TEXT,
ADD COLUMN IF NOT EXISTS "emailVerificationToken" TEXT,
ADD COLUMN IF NOT EXISTS "emailVerificationExpires" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "creditsLastReset" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "twoFactorEnabled" BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS "twoFactorSecret" TEXT,
ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "lastLoginIp" TEXT,
ADD COLUMN IF NOT EXISTS "failedLoginAttempts" INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS "lockedUntil" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS "asaasCustomerId" TEXT UNIQUE;

-- Verifica se funcionou
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'User' 
ORDER BY ordinal_position;