@echo off
cd ..

echo ===================================
echo  INSTALANDO TODOS OS COMPONENTES
echo ===================================
echo.

echo Este script vai instalar TODOS os componentes mais comuns do shadcn/ui
echo para evitar erros futuros de componentes faltando.
echo.

echo Instalando componentes basicos...
npx shadcn@latest add button card dialog label input select tabs toast alert --yes

echo.
echo Instalando componentes de formulario...
npx shadcn@latest add form checkbox radio-group switch textarea --yes

echo.
echo Instalando componentes de dados...
npx shadcn@latest add table badge skeleton progress --yes

echo.
echo Instalando componentes de navegacao...
npx shadcn@latest add dropdown-menu navigation-menu breadcrumb --yes

echo.
echo Instalando componentes de feedback...
npx shadcn@latest add alert-dialog sheet popover tooltip --yes

echo.
echo Instalando componentes de layout...
npx shadcn@latest add separator scroll-area aspect-ratio --yes

echo.
echo ===================================
echo  TODOS OS COMPONENTES INSTALADOS!
echo ===================================
echo.

echo Testando build final...
npm run build

pause