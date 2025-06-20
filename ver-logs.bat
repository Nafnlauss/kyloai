@echo off
echo ===================================
echo   VERIFICAR LOGS DO ERRO
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo Buscando logs do ultimo deploy...
echo.
vercel logs --limit 50

echo.
echo ===================================
echo Analise os logs acima.
echo.
echo Erros comuns:
echo - "pnpm: command not found" = use NPM
echo - "peer deps conflict" = use --legacy-peer-deps
echo - "out of memory" = reduza o tamanho do build
echo.
echo Para tentar novamente:
echo   .\deploy.bat
echo ===================================
echo.
pause
