@echo off
echo ========================================
echo Instalando com NPM (alternativa)
echo ========================================

echo.
echo [1/4] Removendo node_modules...
if exist node_modules rmdir /s /q node_modules

echo.
echo [2/4] Removendo arquivos de lock...
if exist pnpm-lock.yaml del pnpm-lock.yaml
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock

echo.
echo [3/4] Instalando com npm...
call npm install --legacy-peer-deps

echo.
echo [4/4] Gerando cliente Prisma...
call npm run postinstall

echo.
echo ========================================
echo Instalacao concluida com NPM!
echo ========================================
echo.
echo Para iniciar o servidor, execute:
echo   npm run dev
echo.
pause