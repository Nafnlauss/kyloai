@echo off
echo ===================================
echo   DEPLOY RAPIDO VERCEL
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [1] Criando vercel.json minimo...
echo {>vercel.json
echo   "framework": "nextjs">>vercel.json
echo }>>vercel.json

echo.
echo [2] Arquivo criado. Tentando deploy...
echo.

vercel --prod --yes

echo.
echo ===================================
echo Se ainda der erro de variaveis:
echo.
echo 1. Acesse o Vercel Dashboard
echo 2. Va em Settings > Environment Variables
echo 3. Adicione as variaveis necessarias
echo 4. Execute novamente: vercel --prod
echo ===================================
echo.

pause
