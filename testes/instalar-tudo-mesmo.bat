@echo off
cd ..

echo ===================================
echo  INSTALANDO TUDO QUE FALTA
echo ===================================
echo.

echo [1] Instalando todos os componentes UI comuns...
echo.

REM Lista completa de componentes shadcn/ui mais usados
set componentes=accordion alert alert-dialog aspect-ratio avatar badge breadcrumb button calendar card carousel checkbox collapsible command context-menu dialog drawer dropdown-menu form hover-card input label menubar navigation-menu pagination popover progress radio-group resizable scroll-area select separator sheet skeleton slider sonner switch table tabs textarea toast toggle tooltip

echo Instalando TODOS os componentes para evitar futuros erros...
npx shadcn@latest add %componentes% --yes --overwrite

echo.
echo [2] Verificando dependencias npm...
echo.

echo Instalando nodemailer...
npm install nodemailer @types/nodemailer

echo.
echo [3] Build final...
npm run build

pause