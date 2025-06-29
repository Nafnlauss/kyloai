#!/bin/bash

echo "======================================"
echo "   CORRIGINDO ERRO DO NEXT.JS"
echo "======================================"
echo

echo "1. Parando servidor..."
pkill -f "next" || true

echo "2. Limpando cache..."
rm -rf .next
rm -rf node_modules/.cache

echo "3. Verificando instalação..."
if [ ! -d "node_modules/next" ]; then
    echo "Next.js não encontrado! Reinstalando..."
    pnpm install
fi

echo "4. Gerando cliente Prisma..."
pnpm prisma generate

echo "5. Iniciando servidor..."
pnpm dev