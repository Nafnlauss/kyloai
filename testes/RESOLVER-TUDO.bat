@echo off
echo ===================================
echo  SOLUCAO COMPLETA VERCEL
echo ===================================
echo.

cd ..

echo Este script vai:
echo 1. Testar o build localmente
echo 2. Fazer commit e push
echo 3. Abrir o Vercel para adicionar variaveis
echo 4. Fazer o deploy
echo.
echo Pressione qualquer tecla para continuar...
pause > nul

echo.
echo [PASSO 1] Testando build local...
echo.
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Build falhou localmente!
    echo Resolva os erros acima primeiro.
    pause
    exit /b
)

echo.
echo [OK] Build local funcionou!
echo.

echo [PASSO 2] Fazendo commit e push...
git add .
git commit -m "fix: deploy configuration" 2>nul
git push origin main

echo.
echo [PASSO 3] Variaveis de Ambiente
echo.
echo IMPORTANTE: Adicione as variaveis no Vercel!
echo.
echo Abrindo o painel do Vercel...
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables

echo.
echo Adicione pelo menos estas variaveis:
echo - DATABASE_URL
echo - NEXTAUTH_SECRET
echo - NEXTAUTH_URL
echo - NEXT_PUBLIC_APP_URL
echo - NEXT_PUBLIC_SUPABASE_URL
echo - NEXT_PUBLIC_SUPABASE_ANON_KEY
echo.
echo Depois de adicionar TODAS as variaveis, pressione qualquer tecla...
pause > nul

echo.
echo [PASSO 4] Fazendo deploy...
echo.
vercel --prod

echo.
echo ===================================
echo  PROCESSO COMPLETO!
echo ===================================
echo.
pause