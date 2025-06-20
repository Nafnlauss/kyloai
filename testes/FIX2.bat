@echo off
cd ..

echo ===================================
echo  INSTALANDO MAIS COMPONENTES
echo ===================================
echo.

echo Instalando componentes que ainda estao faltando...
npx shadcn@latest add skeleton progress alert-dialog --yes

echo.
echo Testando build novamente...
npm run build

pause