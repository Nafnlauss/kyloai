@echo off
echo ===================================
echo   CORRIGINDO E DEPLOYANDO
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [1] Verificando logs do erro anterior...
echo.
vercel logs kyloai-fo0tovubi-nafnlaus-projects.vercel.app --limit 10
echo.

echo [2] Mudando para NPM (mais compativel)...
echo {>vercel.json
echo   "framework": "nextjs",>>vercel.json
echo   "installCommand": "npm install",>>vercel.json
echo   "buildCommand": "npm run build">>vercel.json
echo }>>vercel.json

echo.
echo [3] Commitando mudanca...
git add vercel.json
git commit -m "Fix: usar npm ao inves de pnpm" 2>nul

echo.
echo [4] Tentando deploy novamente...
echo.
vercel --prod --yes

echo.
echo ===================================
echo Se ainda falhar:
echo 1. Verifique se tem arquivo package-lock.json
echo 2. Delete pnpm-lock.yaml se existir
echo 3. Execute: npm install localmente
echo ===================================
echo.
pause
