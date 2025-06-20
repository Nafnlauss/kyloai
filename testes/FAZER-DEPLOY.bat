@echo off
cd ..

echo ===================================
echo  SOLUCAO AUTOMATICA
echo ===================================
echo.

echo O problema: Faltam variaveis de ambiente no Vercel
echo.

echo [1] Abrindo .env para voce copiar...
start notepad .env

echo.
echo [2] Abrindo Vercel...
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables

echo.
echo COPIE estas variaveis do .env para o Vercel:
echo.
echo - DATABASE_URL
echo - DIRECT_URL  
echo - NEXTAUTH_SECRET
echo - NEXT_PUBLIC_SUPABASE_URL
echo - NEXT_PUBLIC_SUPABASE_ANON_KEY
echo - SUPABASE_SERVICE_ROLE_KEY
echo.
echo E MUDE estas para o valor indicado:
echo - NEXTAUTH_URL = https://kyloai.vercel.app
echo - NEXT_PUBLIC_APP_URL = https://kyloai.vercel.app
echo.
echo Depois de adicionar TODAS, pressione qualquer tecla...
pause > nul

echo.
echo [3] Fazendo deploy...
vercel --prod

pause