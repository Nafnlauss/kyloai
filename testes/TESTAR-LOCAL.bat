@echo off
echo ===================================
echo  VERIFICANDO BUILD LOCAL
echo ===================================
echo.
echo [1] Limpando cache...
rmdir /s /q .next
echo.
echo [2] Instalando dependencias...
npm install --legacy-peer-deps
echo.
echo [3] Gerando Prisma Client...
npx prisma generate
echo.
echo [4] Testando build...
npm run build
echo.
echo ===================================
echo.
echo Se o build passou, execute:
echo    NOVO-DEPLOY.bat
echo.
echo Se falhou, me mostre o erro!
echo.
pause