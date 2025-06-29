#!/bin/bash

# Script para testar build localmente

echo "🔨 Testando build local..."

# Limpar caches
rm -rf .next
rm -rf node_modules/.cache

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Gerar Prisma Client
echo "🗄️ Gerando Prisma Client..."
npx prisma generate

# Build
echo "🏗️ Executando build..."
SKIP_ENV_VALIDATION=1 npm run build

echo "✅ Build concluído!"