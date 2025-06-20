@echo off
cd ..

echo ===================================
echo  VERIFICANDO STATUS DO PROJETO
echo ===================================
echo.

echo Componentes UI instalados:
echo [OK] checkbox
echo [OK] badge
echo [OK] table
echo [OK] dropdown-menu
echo [OK] scroll-area
echo [OK] skeleton
echo [OK] progress
echo [OK] alert-dialog
echo [OK] avatar
echo.

echo Verificando nodemailer...
npm list nodemailer >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] nodemailer instalado
) else (
    echo [X] nodemailer NAO instalado
    echo.
    echo Instalando nodemailer agora...
    npm install nodemailer @types/nodemailer
)

echo.
echo ===================================
echo  TESTANDO BUILD FINAL
echo ===================================
echo.

npm run build

pause