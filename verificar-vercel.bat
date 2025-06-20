@echo off
echo ===================================
echo   VERIFICAR CONEXAO VERCEL
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [1] Verificando Vercel CLI...
where vercel >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Vercel CLI nao instalado!
    echo     Instale com: npm i -g vercel
    echo.
) else (
    echo [OK] Vercel CLI instalado
    vercel --version
    echo.
)

echo [2] Verificando projeto Vercel local...
if exist ".vercel\project.json" (
    echo [OK] Projeto configurado localmente
    echo.
    echo Detalhes do projeto:
    type .vercel\project.json
    echo.
) else (
    echo [!] Projeto nao configurado
    echo     Execute: vercel
    echo.
)

echo [3] Status do Git:
git status --short
echo.

echo [4] Remote configurado:
git remote -v
echo.

echo ===================================
echo   OPCOES DE DEPLOY:
echo ===================================
echo.
echo 1. Deploy direto via Vercel CLI:
echo    vercel --prod
echo.
echo 2. Deploy via Git:
echo    git add .
echo    git commit -m "Deploy"
echo    git push origin main
echo.
echo 3. Forcar deploy sem alteracoes:
echo    vercel --prod --force
echo.
echo 4. Linkar projeto existente:
echo    vercel link
echo.

pause
