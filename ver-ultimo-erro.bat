@echo off
echo ===================================
echo   VER LOGS DO ULTIMO DEPLOY
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo Abrindo logs no navegador...
start https://kyloai-1dufbyt0i-nafnlaus-projects.vercel.app/_logs

echo.
echo Tentando ver logs no terminal...
vercel logs kyloai-1dufbyt0i-nafnlaus-projects.vercel.app 2>nul

echo.
echo ===================================
echo SOLUCAO: Execute estes comandos:
echo.
echo 1. .\ADICIONAR-VARIAVEIS.bat
echo    (configure DATABASE_URL no Vercel)
echo.
echo 2. .\DEPLOY-FINAL.bat
echo    (deploy sem postinstall)
echo.
echo 3. vercel --prod
echo    (depois de adicionar variaveis)
echo ===================================
echo.
pause
