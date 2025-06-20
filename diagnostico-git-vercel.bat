@echo off
setlocal enabledelayedexpansion

echo ===================================
echo   Diagnostico Git para Vercel
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [1] Verificando configuracao do Git...
git config user.name
git config user.email
echo.

echo [2] Status atual do repositorio:
git status
echo.

echo [3] Verificando remotes configurados:
git remote -v
echo.

echo [4] Branch atual:
git branch --show-current
echo.

echo [5] Tentando adicionar todos os arquivos:
git add .
echo.

echo [6] Status apos add:
git status
echo.

echo [7] Tentando fazer commit:
git commit -m "Update: ajustes no projeto" 2>&1
echo.

echo [8] Se o commit falhou, verificando possiveis problemas:
echo.

echo - Verificando se ha conflitos de merge:
git ls-files -u
echo.

echo - Verificando arquivos grandes:
echo Arquivos maiores que 10MB:
for /f "tokens=*" %%i in ('git ls-files') do (
    set "size="
    for /f %%j in ('powershell -command "(Get-Item '%%i' -ErrorAction SilentlyContinue).Length / 1MB"') do set size=%%j
    if defined size (
        for /f %%k in ('powershell -command "if (%%j -gt 10) { 'GRANDE' } else { 'OK' }"') do (
            if "%%k"=="GRANDE" echo %%i - !size! MB
        )
    )
)
echo.

echo [9] Informacoes do Vercel:
if exist .vercel\project.json (
    echo Projeto Vercel configurado
    type .vercel\project.json
) else (
    echo Projeto Vercel NAO configurado
)
echo.

echo ===================================
echo   Solucoes comuns:
echo ===================================
echo.
echo 1. Se nao ha alteracoes para commit:
echo    - Faca alguma alteracao no codigo
echo    - Ou use: git commit --allow-empty -m "Empty commit"
echo.
echo 2. Se ha problemas com email/nome:
echo    - git config --global user.email "seu-email@example.com"
echo    - git config --global user.name "Seu Nome"
echo.
echo 3. Se ha arquivos muito grandes:
echo    - Adicione ao .gitignore
echo    - Ou use Git LFS
echo.
echo 4. Para fazer push para o Vercel:
echo    - git push origin main
echo    - Ou configure: vercel --prod
echo.

pause
