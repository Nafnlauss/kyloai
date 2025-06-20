@echo off
:: Deploy Express para Vercel - Resolve todos os problemas

cd /d F:\site-ia\ai-video-hub

:: Criar vercel.json minimalista
echo {"framework": "nextjs"} > vercel.json

:: Fazer commit das mudanças
git add vercel.json
git commit -m "Fix: simplified vercel.json" 2>nul

:: Deploy
echo.
echo Iniciando deploy...
echo.
vercel --prod --yes --skip-domain

echo.
echo ========================================
echo Se o deploy falhou por variaveis:
echo.
echo Acesse:
echo https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo.
echo E adicione pelo menos:
echo - DATABASE_URL
echo - NEXTAUTH_SECRET
echo ========================================
pause
