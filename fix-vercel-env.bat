@echo off
echo =========================================
echo   CORRIGIR VARIAVEIS VERCEL
echo =========================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [!] ERRO IDENTIFICADO:
echo     A variavel NEXT_PUBLIC_APP_URL referencia
echo     um secret "@production_url" que nao existe
echo.

echo [1] Opcoes para corrigir:
echo.
echo A) Criar o secret no Vercel Dashboard:
echo    1. Acesse: https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo    2. Adicione um novo secret chamado "production_url"
echo    3. Com o valor: https://kyloai.vercel.app (ou seu dominio)
echo.
echo B) Modificar vercel.json localmente:
echo    Vamos fazer isso agora...
echo.

echo [2] Fazendo backup do vercel.json atual...
copy vercel.json vercel.json.backup

echo.
echo [3] Criando novo vercel.json corrigido...
echo {>vercel-temp.json
echo   "buildCommand": "pnpm run build",>>vercel-temp.json
echo   "outputDirectory": ".next",>>vercel-temp.json
echo   "installCommand": "pnpm install",>>vercel-temp.json
echo   "framework": "nextjs",>>vercel-temp.json
echo   "env": {>>vercel-temp.json
echo     "NEXT_PUBLIC_APP_URL": "$VERCEL_URL",>>vercel-temp.json
echo     "NODE_ENV": "production">>vercel-temp.json
echo   }>>vercel-temp.json
echo }>>vercel-temp.json

echo.
echo [4] Substituindo arquivo...
move /y vercel-temp.json vercel.json

echo.
echo [5] Novo vercel.json criado com NEXT_PUBLIC_APP_URL usando $VERCEL_URL
echo.
echo [6] Agora tente novamente:
echo    vercel --prod
echo.
echo OU adicione as variaveis no Vercel Dashboard:
echo https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo.

pause
