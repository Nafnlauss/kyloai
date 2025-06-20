@echo off
echo ===================================
echo  VERIFICANDO COMPONENTES UI
echo ===================================
echo.

cd ..

echo Verificando quais componentes estao instalados...
echo.

echo Componentes em src\components\ui:
dir /b src\components\ui\*.tsx 2>nul

echo.
echo ===================================
echo  INSTALANDO TODOS DE UMA VEZ
echo ===================================
echo.

echo Instalando TODOS os componentes que podem estar faltando...
echo.

REM Lista dos componentes mais comuns que podem estar faltando
npx shadcn@latest add checkbox badge table dropdown-menu scroll-area --yes

echo.
echo Se ainda houver erros de componentes faltando, instale manualmente:
echo npx shadcn@latest add [nome-do-componente]
echo.
pause