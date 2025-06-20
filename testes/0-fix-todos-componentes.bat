@echo off
echo ===================================
echo  CORRECAO COMPLETA - COMPONENTES UI
echo ===================================
echo.

cd ..

echo Este script vai resolver TODOS os problemas de componentes faltando.
echo.

echo [1] Limpando cache...
if exist .next rmdir /s /q .next

echo.
echo [2] Instalando componentes shadcn/ui essenciais...
echo.

REM Componentes básicos que geralmente são necessários
set components=button card dialog label input select tabs toast alert checkbox badge table dropdown-menu scroll-area

for %%c in (%components%) do (
    echo Instalando %%c...
    npx shadcn@latest add %%c --yes 2>nul
)

echo.
echo [3] Verificando se os componentes foram instalados...
echo.
echo Componentes instalados:
dir /b src\components\ui\*.tsx 2>nul

echo.
echo [4] Testando build novamente...
echo.
call npm run build

if %errorlevel% equ 0 (
    echo.
    echo [OK] Build funcionou! 
    echo Execute agora: .\2-commit-e-push.bat
) else (
    echo.
    echo [ERRO] Ainda ha erros. Verifique acima quais componentes estao faltando.
    echo Para instalar manualmente: npx shadcn@latest add [nome-do-componente]
)

echo.
pause