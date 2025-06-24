@echo off
echo ========================================
echo Limpeza e Instalacao Completa
echo ========================================
echo.

echo Removendo node_modules...
if exist node_modules (
    rmdir /s /q node_modules 2>nul
    if exist node_modules (
        echo Tentando remover com PowerShell...
        powershell -Command "Remove-Item -Path node_modules -Recurse -Force -ErrorAction SilentlyContinue"
    )
)

echo Removendo .next...
if exist .next rmdir /s /q .next

echo Removendo pnpm-lock.yaml...
if exist pnpm-lock.yaml del pnpm-lock.yaml

echo.
echo Limpando cache do pnpm...
call pnpm store prune

echo.
echo Instalando dependencias...
call pnpm install

echo.
echo Adicionando @radix-ui/react-slider...
call pnpm add @radix-ui/react-slider

echo.
echo Gerando Prisma Client...
call pnpm prisma generate

echo.
echo ========================================
echo Instalacao concluida!
echo ========================================
echo.
echo Execute: pnpm dev
echo.
pause