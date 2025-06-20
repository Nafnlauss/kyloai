@echo off
echo ===================================
echo  TESTE LOCAL DO BUILD
echo ===================================
echo.

cd ..

echo Testando build localmente...
echo.

call npm run build

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Build falhou localmente!
    echo Verifique os erros acima.
) else (
    echo.
    echo [OK] Build funcionou localmente!
    echo O problema esta apenas no Vercel.
)

echo.
pause