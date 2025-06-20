@echo off
echo ===================================
echo  DIAGNOSTICO RAPIDO
echo ===================================
echo.
cd ..

echo [1] Verificando build local...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Build falhou localmente!
    echo Resolva os erros locais primeiro.
) else (
    echo [OK] Build local funcionando!
    echo.
    echo [2] Verificando logs do Vercel...
    vercel logs --output raw -n 50
)
echo.
pause