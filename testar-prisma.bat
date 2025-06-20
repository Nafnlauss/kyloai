@echo off
echo Testando Prisma Generate...
echo.
cd F:\site-ia\ai-video-hub
npx prisma generate
echo.
if %errorlevel% equ 0 (
    echo [OK] Prisma gerado com sucesso!
    echo.
    echo Agora execute:
    echo .\RESOLVER-TUDO.bat
) else (
    echo [ERRO] Prisma ainda com erro
    echo.
    echo Execute:
    echo .\deploy-sem-prisma.bat
)
echo.
pause
