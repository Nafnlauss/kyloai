@echo off
cd ..

echo ===================================
echo  TESTANDO BUILD FINAL
echo ===================================
echo.

npm run build

if %errorlevel% equ 0 (
    echo.
    echo ===================================
    echo  BUILD FUNCIONOU COM SUCESSO!
    echo ===================================
    echo.
    echo Agora execute: .\RESOLVER-TUDO.bat
    echo.
    echo Ou faca manualmente:
    echo 1. git add .
    echo 2. git commit -m "fix: add missing UI components"
    echo 3. git push origin main
    echo 4. Adicione as variaveis no Vercel
    echo 5. vercel --prod
) else (
    echo.
    echo [ERRO] Ainda ha erros no build.
    echo Verifique os erros acima.
)

pause