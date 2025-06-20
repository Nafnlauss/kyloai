@echo off
cd ..

echo ===================================
echo  INSTALANDO 8 COMPONENTES FALTANTES
echo ===================================
echo.

echo Componentes ja instalados:
echo [OK] checkbox
echo [OK] badge
echo [OK] table
echo [OK] dropdown-menu
echo [OK] scroll-area
echo.

echo Componentes que ainda faltam:
echo [ ] skeleton
echo [ ] progress
echo [ ] alert-dialog
echo.

echo Instalando todos de uma vez...
echo.

REM Lista completa dos 8 componentes necessarios
set componentes=checkbox badge table dropdown-menu scroll-area skeleton progress alert-dialog

npx shadcn@latest add %componentes% --yes

echo.
echo ===================================
echo  TESTANDO BUILD FINAL
echo ===================================
echo.

npm run build

if %errorlevel% equ 0 (
    echo.
    echo [SUCESSO] Build funcionou!
    echo.
    echo Proximos passos:
    echo 1. Execute: .\2-commit-e-push.bat
    echo 2. Ou continue com: .\RESOLVER-TUDO.bat
) else (
    echo.
    echo [ERRO] Ainda ha problemas no build.
    echo Verifique se ha mais componentes faltando acima.
)

pause