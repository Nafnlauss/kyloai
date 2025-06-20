@echo off
cls
echo.
echo  ██████╗ ███████╗██████╗ ██╗      ██████╗ ██╗   ██╗
echo  ██╔══██╗██╔════╝██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝
echo  ██║  ██║█████╗  ██████╔╝██║     ██║   ██║ ╚████╔╝ 
echo  ██║  ██║██╔══╝  ██╔═══╝ ██║     ██║   ██║  ╚██╔╝  
echo  ██████╔╝███████╗██║     ███████╗╚██████╔╝   ██║   
echo  ╚═════╝ ╚══════╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   
echo.
echo          SOLUCAO DEFINITIVA PARA VERCEL
echo.
echo ===================================
echo   CORRIGINDO TUDO E FAZENDO DEPLOY
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [OK] Problema identificado: Prisma configurado para SQLite
echo [OK] Solucao: Ja mudamos para PostgreSQL
echo.

echo [1] Gerando Prisma localmente...
call npx prisma generate
echo.

echo [2] Commitando correcao do Prisma...
git add prisma/schema.prisma
git commit -m "Fix: Prisma PostgreSQL ao inves de SQLite" 2>nul
echo.

echo [3] Deploy para Vercel...
echo.
vercel --prod --yes

echo.
echo ===================================
echo   SE O DEPLOY AINDA FALHAR:
echo ===================================
echo.
echo 1. ADICIONE AS VARIAVEIS NO VERCEL:
echo.
echo    https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo.
echo    Variaveis ESSENCIAIS:
echo    - DATABASE_URL (copie do .env)
echo    - NEXTAUTH_SECRET (copie do .env)
echo    - NEXTAUTH_URL = https://kyloai.vercel.app
echo.
echo 2. DEPOIS EXECUTE:
echo    vercel --prod
echo.
echo 3. OU USE O DEPLOY SEM PRISMA:
echo    .\deploy-sem-prisma.bat
echo.
echo Veja o arquivo VARIAVEIS-VERCEL.md para a lista completa!
echo.
pause
