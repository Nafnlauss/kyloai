@echo off
echo.
echo ===================================
echo  ESCOLHA UMA OPCAO:
echo ===================================
echo.
echo 1. Resolver automaticamente (recomendado)
echo 2. Ver instrucoes manuais
echo 3. Cancelar
echo.
set /p opcao="Digite 1, 2 ou 3: "

if "%opcao%"=="1" (
    call R.bat
)

if "%opcao%"=="2" (
    echo.
    echo INSTRUCOES MANUAIS:
    echo.
    echo 1. Execute estes comandos:
    echo    git reset --soft HEAD~1
    echo    git reset HEAD testes/VARIAVEIS-VERCEL.md
    echo    echo testes/VARIAVEIS-VERCEL.md ^>^> .gitignore
    echo    echo {"installCommand": "npm install", "buildCommand": "npm run build", "framework": "nextjs"} ^> vercel.json
    echo    git add -A
    echo    git commit -m "fix: add UI components and configure npm"
    echo    git push origin main -f
    echo.
    echo 2. Adicione as variaveis no Vercel
    echo 3. Execute: vercel --prod
    echo.
    pause
)

if "%opcao%"=="3" (
    echo Cancelado.
)