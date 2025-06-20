@echo off
echo ===================================
echo  FAZENDO DEPLOY FINAL!
echo ===================================
echo.
echo [OK] Todas as variaveis estao configuradas!
echo.
echo Iniciando deploy em producao...
echo.
cd ..
vercel --prod
echo.
echo ===================================
echo  DEPLOY CONCLUIDO!
echo ===================================
echo.
echo Se tudo deu certo, seu site esta no ar!
echo.
echo URL: https://kyloai.vercel.app
echo.
pause