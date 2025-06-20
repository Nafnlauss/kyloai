@echo off
echo ===================================
echo  CORRIGINDO TYPESCRIPT
echo ===================================
echo.
cd ..

echo [1] Atualizando TypeScript e tipos...
npm install -D typescript@latest @types/node@latest @types/react@latest @types/react-dom@latest

echo.
echo [2] Limpando cache...
rmdir /s /q .next
rmdir /s /q node_modules\.cache

echo.
echo [3] Instalando dependencias novamente...
npm install

echo.
echo [4] Testando build...
npm run build

echo.
pause