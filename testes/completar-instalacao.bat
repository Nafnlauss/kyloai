@echo off
cd ..

echo ===================================
echo  INSTALANDO NODEMAILER E TESTANDO
echo ===================================
echo.

echo [1] Instalando nodemailer...
npm install nodemailer

echo.
echo [2] Instalando tipos do nodemailer...
npm install --save-dev @types/nodemailer

echo.
echo [3] Testando build final...
npm run build

if %errorlevel% equ 0 (
    echo.
    echo ===================================
    echo  BUILD FUNCIONOU COM SUCESSO!
    echo ===================================
    echo.
    echo Agora execute: .\RESOLVER-TUDO.bat
    echo.
    echo Isso vai:
    echo - Fazer commit das alteracoes
    echo - Fazer push para o GitHub
    echo - Abrir o Vercel para adicionar variaveis
    echo - Fazer o deploy
) else (
    echo.
    echo [ERRO] Ainda ha erros no build.
    echo Verifique os erros acima.
)

pause