@echo off
echo ========================================
echo Adicionando entradas no arquivo hosts
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

set HOSTS_FILE=C:\Windows\System32\drivers\etc\hosts

echo.
echo Fazendo backup do arquivo hosts...
copy "%HOSTS_FILE%" "%HOSTS_FILE%.backup" >nul

echo.
echo Resolvendo IPs do Supabase...
echo.

REM Usar nslookup para pegar o IPv4
for /f "tokens=2" %%a in ('nslookup db.snfxczgjpnydysccigps.supabase.co 2^>nul ^| findstr /i "Address" ^| findstr /v ":"') do set SUPABASE_IP=%%a

if "%SUPABASE_IP%"=="" (
    echo ❌ Não foi possível resolver o IP do Supabase
    echo.
    echo Adicionando IP padrão da AWS São Paulo...
    echo.
    echo # Supabase entries >> "%HOSTS_FILE%"
    echo 52.67.247.58  db.snfxczgjpnydysccigps.supabase.co >> "%HOSTS_FILE%"
    echo 15.229.150.166  aws-0-sa-east-1.pooler.supabase.com >> "%HOSTS_FILE%"
) else (
    echo IP encontrado: %SUPABASE_IP%
    echo.
    echo # Supabase entries >> "%HOSTS_FILE%"
    echo %SUPABASE_IP%  db.snfxczgjpnydysccigps.supabase.co >> "%HOSTS_FILE%"
    echo 15.229.150.166  aws-0-sa-east-1.pooler.supabase.com >> "%HOSTS_FILE%"
)

echo.
echo ✅ Entradas adicionadas ao arquivo hosts!
echo.
echo Agora execute: node tests\test-connection.js
echo.
echo Para remover as entradas, edite: %HOSTS_FILE%
echo e remova as linhas com "Supabase entries"
echo.
pause