@echo off
cd ..

echo ===================================
echo  FIX DEFINITIVO - COMPONENTES UI
echo ===================================
echo.

:install_loop
echo Tentando build para detectar componentes faltando...
echo.

REM Captura a saída do build
npm run build 2>&1 | findstr "Module not found: Can't resolve '@/components/ui/" > temp_errors.txt

REM Verifica se há erros
if %errorlevel% equ 0 (
    echo Componentes faltando detectados. Instalando...
    echo.
    
    REM Extrai os nomes dos componentes dos erros
    for /f "tokens=6 delims=/" %%a in (temp_errors.txt) do (
        for /f "tokens=1 delims='" %%b in ("%%a") do (
            echo Instalando: %%b
            npx shadcn@latest add %%b --yes 2>nul
        )
    )
    
    del temp_errors.txt
    echo.
    echo Verificando novamente...
    echo.
    goto install_loop
) else (
    echo.
    echo [OK] Nenhum componente faltando!
    echo.
    echo Executando build final...
    npm run build
    
    if %errorlevel% equ 0 (
        echo.
        echo ===================================
        echo  BUILD FUNCIONOU!
        echo ===================================
        echo.
        echo Agora execute: .\2-commit-e-push.bat
    )
)

pause