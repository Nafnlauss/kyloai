@echo off
echo ===================================
echo  INSTALANDO COMPONENTES EXTRAS
echo ===================================
echo.
cd ..

echo Instalando componentes que podem estar faltando...
echo.

:: Lista de componentes comuns que podem estar faltando
npx shadcn@latest add dialog -y
npx shadcn@latest add select -y
npx shadcn@latest add tabs -y
npx shadcn@latest add toast -y
npx shadcn@latest add tooltip -y
npx shadcn@latest add popover -y
npx shadcn@latest add command -y
npx shadcn@latest add separator -y
npx shadcn@latest add sheet -y
npx shadcn@latest add switch -y

echo.
echo Componentes instalados! Testando build...
echo.
npm run build
echo.
pause