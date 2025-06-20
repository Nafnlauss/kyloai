@echo off
echo.
echo ===== PROBLEMA IDENTIFICADO =====
echo.
echo O Vercel esta falhando porque faltam as VARIAVEIS DE AMBIENTE
echo.
echo Execute um destes comandos:
echo.
echo 1) Para copiar variaveis automaticamente:
echo    cd .. ^&^& powershell -ExecutionPolicy Bypass -File "testes\deploy-automatico.ps1"
echo.
echo 2) Para fazer manualmente:
echo    cd testes ^&^& FAZER-DEPLOY.bat
echo.
echo ===== FIM =====
echo.
pause