@echo off
echo ===================================
echo  INSTALANDO COMPONENTES FALTANTES
echo ===================================
echo.

cd ..

echo Instalando componentes shadcn/ui que estao faltando...
echo.

echo [1] Instalando checkbox...
npx shadcn@latest add checkbox --yes

echo.
echo [2] Instalando badge...
npx shadcn@latest add badge --yes

echo.
echo [3] Instalando table...
npx shadcn@latest add table --yes

echo.
echo [4] Instalando dropdown-menu...
npx shadcn@latest add dropdown-menu --yes

echo.
echo [5] Instalando scroll-area...
npx shadcn@latest add scroll-area --yes

echo.
echo ===================================
echo  COMPONENTES INSTALADOS!
echo ===================================
echo.
echo Agora execute novamente: .\RESOLVER-TUDO.bat
echo.
pause