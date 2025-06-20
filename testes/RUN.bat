@echo off
cd ..

echo Instalando avatar e nodemailer...
call npx shadcn@latest add avatar --yes
call npm i nodemailer @types/nodemailer

echo.
echo Testando...
call npm run build

echo.
if %errorlevel% equ 0 (
    echo [SUCESSO] Agora execute: .\RESOLVER-TUDO.bat
) else (
    echo [ERRO] Verifique os erros acima
)

pause