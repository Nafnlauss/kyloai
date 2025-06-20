@echo off
echo ===================================
echo   DEPLOY SEM POSTINSTALL
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [1] Removendo postinstall temporariamente...
echo.

:: Criar package.json sem postinstall
powershell -Command ^
"$pkg = Get-Content 'package.json' -Raw | ConvertFrom-Json; ^
$pkg.scripts.PSObject.Properties.Remove('postinstall'); ^
$pkg | ConvertTo-Json -Depth 10 | Set-Content 'package.json' -Encoding UTF8"

echo [2] Commitando alteracao...
git add package.json prisma/schema.prisma
git commit -m "Deploy: remover postinstall temporariamente"

echo.
echo [3] Deploy para Vercel...
vercel --prod --yes

echo.
echo [4] Depois do deploy, configure as variaveis:
echo.
echo https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo.
echo E faca redeploy com: vercel --prod
echo.
pause
