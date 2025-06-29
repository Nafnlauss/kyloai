@echo off
echo ======================================
echo   CORRIGINDO ERRO DO NEXT.JS
echo ======================================
echo.

echo 1. Parando servidor...
taskkill /F /IM node.exe 2>nul

echo 2. Limpando cache...
rmdir /S /Q .next 2>nul
rmdir /S /Q node_modules\.cache 2>nul

echo 3. Verificando instalacao...
if not exist node_modules\next (
    echo Next.js nao encontrado! Reinstalando...
    call pnpm install
)

echo 4. Iniciando servidor...
call pnpm dev

pause