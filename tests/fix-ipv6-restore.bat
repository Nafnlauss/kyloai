@echo off
echo ========================================
echo Restaurando configuracoes IPv6
echo ========================================
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

echo Habilitando IPv6...
echo.

REM Restaurar configurações padrão
netsh interface ipv6 set global randomizeidentifiers=enabled
netsh interface ipv6 set privacy state=enabled

REM Restaurar políticas padrão
netsh interface ipv6 reset

echo.
echo ✅ IPv6 restaurado!
echo.
pause