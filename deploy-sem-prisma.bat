@echo off
echo ===================================
echo   DEPLOY RAPIDO SEM PRISMA
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [1] Criando package.json temporario sem postinstall...
powershell -Command "$p = Get-Content 'package.json' | ConvertFrom-Json; $p.scripts.postinstall = $null; $p.scripts.build = 'next build'; $p | ConvertTo-Json -Depth 10 | Set-Content 'package.json' -Encoding UTF8"

echo.
echo [2] Commitando...
git add package.json prisma/schema.prisma
git commit -m "Fix: remover prisma generate do build temporariamente"

echo.
echo [3] Deploy...
vercel --prod --yes

echo.
echo [4] Restaurando package.json original...
git checkout package.json

echo.
echo ===================================
echo IMPORTANTE:
echo.
echo Configure as variaveis no Vercel:
echo https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo.
echo Copie do arquivo .env:
echo - DATABASE_URL
echo - NEXTAUTH_SECRET
echo - GOOGLE_CLIENT_ID
echo - GOOGLE_CLIENT_SECRET
echo ===================================
echo.
pause
