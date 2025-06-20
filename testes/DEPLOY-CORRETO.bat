@echo off
echo ===================================
echo  DEPLOY DA PASTA CORRETA
echo ===================================
echo.

echo [1] Voltando para a raiz do projeto...
cd ..

echo.
echo [2] Verificando se estamos na pasta correta...
if exist package.json (
    echo [OK] package.json encontrado!
) else (
    echo [ERRO] package.json nao encontrado!
    pause
    exit
)

echo.
echo [3] Deploy no Vercel...
vercel --prod

echo.
pause