@echo off
cls
echo ===================================
echo        DEPLOY KYLOAI
echo ===================================
echo.
echo [1] Removendo postinstall...

cd F:\site-ia\ai-video-hub
powershell -Command "$p=Get-Content 'package.json'|ConvertFrom-Json;$p.scripts.PSObject.Properties.Remove('postinstall');$p|ConvertTo-Json -Depth 10|Set-Content 'package.json'"

echo [2] Salvando...
git add . >nul 2>&1
git commit -m "Deploy sem postinstall" >nul 2>&1

echo [3] Fazendo deploy...
echo.
vercel --prod --yes

echo.
echo ===================================
echo [!] AGORA FACA ISSO:
echo ===================================
echo.
echo 1. O navegador vai abrir
echo 2. Adicione as 3 variaveis
echo 3. Execute: vercel --prod
echo.
echo Abrindo navegador em 3 segundos...
timeout /t 3 >nul
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables

echo.
echo ===================================
echo VARIAVEIS PARA COPIAR:
echo ===================================
echo.
echo DATABASE_URL = postgresql://postgres:m3b1%%23D%%5E7%%26W9%%2AypgzGhCv@db.snfxczgjpnydysccigps.supabase.co:5432/postgres
echo.
echo NEXTAUTH_SECRET = xPq3Rt7Uv9WcYa2Bd4FgHj6Km8NpQs0TvXz1Ac3Ef5Gi=
echo.
echo NEXTAUTH_URL = https://kyloai.vercel.app
echo.
pause
