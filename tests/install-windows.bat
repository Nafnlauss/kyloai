@echo off
echo ========================================
echo Instalando dependencias do projeto
echo ========================================

echo.
echo [1/5] Limpando cache do pnpm...
call pnpm store prune

echo.
echo [2/5] Removendo node_modules antigo...
if exist node_modules (
    rmdir /s /q node_modules
    echo node_modules removido!
) else (
    echo node_modules nao existe, continuando...
)

echo.
echo [3/5] Removendo arquivo de lock...
if exist pnpm-lock.yaml del pnpm-lock.yaml
if exist package-lock.json del package-lock.json

echo.
echo [4/5] Instalando dependencias com pnpm...
call pnpm install

echo.
echo [5/5] Gerando cliente Prisma...
call pnpm prisma generate

echo.
echo ========================================
echo Instalacao concluida!
echo ========================================
echo.
echo Para iniciar o servidor, execute:
echo   pnpm dev
echo.
pause