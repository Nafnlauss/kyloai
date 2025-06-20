@echo off
echo ===================================
echo  TESTANDO BUILD LOCALMENTE PRIMEIRO
echo ===================================
echo.

cd ..

echo [1] Limpando cache...
rmdir /s /q .next 2>nul
rmdir /s /q .vercel 2>nul

echo.
echo [2] Instalando dependencias...
npm install

echo.
echo [3] Testando build local...
npm run build

echo.
echo ===================================
echo.
echo Se o build PASSOU localmente:
echo   - Execute: vercel --prod
echo.
echo Se o build FALHOU localmente:
echo   - Corrija os erros primeiro
echo   - Me mostre o erro especifico
echo.
pause