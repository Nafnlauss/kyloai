@echo off
echo ===================================
echo  FIX RAPIDO - 5 COMPONENTES
echo ===================================
echo.

cd ..

echo Instalando os 5 componentes que estao dando erro...
echo.

npx shadcn@latest add checkbox badge table dropdown-menu scroll-area --yes

echo.
echo [OK] Componentes instalados!
echo.
echo Agora teste o build novamente:
echo npm run build
echo.
echo Ou execute: .\RESOLVER-TUDO.bat
echo.
pause