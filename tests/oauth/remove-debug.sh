#!/bin/bash

# Script para remover o endpoint de debug após o OAuth funcionar

echo "🗑️  Removendo endpoint de debug OAuth..."

# Remove o arquivo de debug
rm -f ../../src/app/api/debug/oauth-temp/route.ts

# Remove o diretório se estiver vazio
rmdir ../../src/app/api/debug/oauth-temp 2>/dev/null

echo "✅ Endpoint de debug removido!"
echo ""
echo "Agora faça o commit:"
echo "git add -A"
echo "git commit -m 'fix: remove OAuth debug endpoint after fixing production'"
echo "git push origin main"