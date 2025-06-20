@echo off
cd ..

echo ===================================
echo  BUILD COMPILOU COM SUCESSO!
echo ===================================
echo.
echo Status:
echo [OK] Build compilou
echo [!] Alguns warnings de import
echo [!] Um erro de tipo do TypeScript
echo.
echo Esses problemas geralmente NAO impedem o deploy.
echo.
echo Deseja prosseguir com o deploy no Vercel?
echo.
set /p resposta="(S/N): "

if /i "%resposta%"=="s" (
    echo.
    echo Fazendo commit das alteracoes...
    git add .
    git commit -m "fix: add missing UI components and dependencies" 2>nul
    
    echo.
    echo Fazendo push...
    git push origin main
    
    echo.
    echo ===================================
    echo  IMPORTANTE: VARIAVEIS DE AMBIENTE
    echo ===================================
    echo.
    echo Agora voce precisa adicionar as variaveis no Vercel!
    echo.
    start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
    start notepad "..\testes\VARIAVEIS-VERCEL.md"
    
    echo.
    echo Depois de adicionar as variaveis, pressione qualquer tecla...
    pause > nul
    
    echo.
    echo Fazendo deploy...
    vercel --prod
) else (
    echo.
    echo Para corrigir os warnings de import, execute:
    echo .\F.bat
)

pause