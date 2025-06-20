#!/bin/bash
cd /mnt/f/site-ia/ai-video-hub

echo "====================================="
echo " AUTO-FIX VERCEL DEPLOYMENT"
echo "====================================="
echo ""

# 1. Verificar logs do erro
echo "[1] Buscando logs do erro..."
vercel logs kyloai-bvhpktubn-nafnlaus-projects.vercel.app --output raw > vercel-error.log 2>&1

# 2. Verificar se é problema de variáveis
echo "[2] Verificando se faltam variáveis de ambiente..."
if grep -q "DATABASE_URL" vercel-error.log || grep -q "environment variable" vercel-error.log; then
    echo "ERRO: Faltam variáveis de ambiente no Vercel!"
    echo ""
    echo "Abrindo painel de variáveis..."
    cmd.exe /c start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
    echo ""
    echo "Adicione estas variáveis essenciais:"
    echo "- DATABASE_URL (copie do .env)"
    echo "- NEXTAUTH_SECRET (copie do .env)"
    echo "- NEXTAUTH_URL = https://kyloai.vercel.app"
    echo "- NEXT_PUBLIC_APP_URL = https://kyloai.vercel.app"
    echo "- NEXT_PUBLIC_SUPABASE_URL (copie do .env)"
    echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY (copie do .env)"
    echo ""
    read -p "Depois de adicionar TODAS as variáveis, pressione ENTER..."
fi

# 3. Verificar se é problema de imports do next-auth
echo "[3] Verificando imports..."
if grep -q "getServerSession" vercel-error.log; then
    echo "Corrigindo imports do next-auth..."
    find src -name "*.ts" -o -name "*.tsx" | xargs sed -i "s/from 'next-auth'/from 'next-auth\/next'/g"
    git add -A
    git commit -m "fix: correct next-auth imports"
    git push
fi

# 4. Tentar deploy novamente
echo "[4] Tentando deploy novamente..."
vercel --prod --yes

echo ""
echo "====================================="
echo " PROCESSO COMPLETO"
echo "====================================="