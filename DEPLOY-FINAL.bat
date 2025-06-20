@echo off
cls
echo ===================================
echo   DEPLOY DEFINITIVO
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [1] Preparando arquivos para deploy...
echo.

:: Remover postinstall do package.json
echo - Removendo postinstall...
powershell -Command ^
"$pkg = Get-Content 'package.json' -Raw | ConvertFrom-Json; ^
if ($pkg.scripts.postinstall) { ^
  $pkg.scripts.PSObject.Properties.Remove('postinstall'); ^
  $pkg | ConvertTo-Json -Depth 10 | Set-Content 'package.json' -NoNewline -Encoding UTF8; ^
  Write-Host '  [OK] Postinstall removido' -ForegroundColor Green ^
} else { ^
  Write-Host '  [OK] Sem postinstall' -ForegroundColor Green ^
}"

echo.
echo [2] Vercel.json configurado para gerar Prisma no build
echo.

echo [3] Commitando alteracoes...
git add .
git commit -m "Deploy: configuracao final" 2>nul

echo.
echo [4] Iniciando deploy...
echo.
vercel --prod --yes

echo.
echo ===================================
echo   PROXIMOS PASSOS
echo ===================================
echo.
echo 1. Se o deploy funcionou, configure as variaveis:
echo    https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo.
echo 2. Variaveis essenciais:
echo    - DATABASE_URL (copie do .env)
echo    - NEXTAUTH_SECRET (copie do .env)
echo    - NEXTAUTH_URL = https://kyloai.vercel.app
echo.
echo 3. Depois faca redeploy: vercel --prod
echo.
pause
