@echo off
echo ===================================
echo   VERIFICANDO CONFIGURACAO
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [1] Verificando .env...
if exist .env (
    echo [OK] Arquivo .env existe
    findstr "DATABASE_URL=postgresql" .env >nul
    if %errorlevel% equ 0 (
        echo [OK] DATABASE_URL aponta para PostgreSQL
    ) else (
        echo [!] DATABASE_URL nao e PostgreSQL
    )
) else (
    echo [!] Arquivo .env nao encontrado
)

echo.
echo [2] Verificando schema.prisma...
findstr "provider = \"postgresql\"" prisma\schema.prisma >nul
if %errorlevel% equ 0 (
    echo [OK] Prisma configurado para PostgreSQL
) else (
    echo [!] Prisma NAO esta configurado para PostgreSQL
)

echo.
echo [3] Testando Prisma Generate...
call npx prisma generate 2>nul
if %errorlevel% equ 0 (
    echo [OK] Prisma gerado com sucesso!
    echo.
    echo TUDO PRONTO! Execute:
    echo .\RESOLVER-TUDO.bat
) else (
    echo [!] Erro ao gerar Prisma
    echo.
    echo Use o deploy sem Prisma:
    echo .\deploy-sem-prisma.bat
)

echo.
pause
