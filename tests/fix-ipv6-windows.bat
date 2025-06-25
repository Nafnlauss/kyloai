@echo off
echo ========================================
echo Desabilitando IPv6 temporariamente
echo ========================================
echo.
echo AVISO: Este script precisa ser executado como Administrador!
echo.

REM Verificar se está rodando como admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ❌ ERRO: Execute este script como Administrador!
    echo.
    echo Clique com botão direito e selecione "Executar como administrador"
    pause
    exit /b 1
)

echo Desabilitando IPv6 nas interfaces de rede...
echo.

REM Desabilitar IPv6 em todas as interfaces
netsh interface ipv6 set global randomizeidentifiers=disabled
netsh interface ipv6 set privacy state=disabled

REM Preferir IPv4 sobre IPv6
netsh interface ipv6 set prefixpolicy ::ffff:0:0/96 precedence=55 label=4

echo.
echo ✅ IPv6 temporariamente desabilitado!
echo.
echo Para reverter, execute: fix-ipv6-restore.bat
echo.
echo Agora tente executar: node tests\test-connection.js
echo.
pause