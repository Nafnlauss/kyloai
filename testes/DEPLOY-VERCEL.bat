@echo off
echo.
echo =====================================================
echo  ADICIONAR VARIAVEIS DE AMBIENTE NO VERCEL
echo =====================================================
echo.
echo Abrindo arquivos necessarios...
echo.

start notepad .env
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables

echo COPIE do .env para o Vercel:
echo.
echo [x] DATABASE_URL
echo [x] DIRECT_URL
echo [x] NEXTAUTH_SECRET
echo [x] NEXT_PUBLIC_SUPABASE_URL
echo [x] NEXT_PUBLIC_SUPABASE_ANON_KEY
echo [x] SUPABASE_SERVICE_ROLE_KEY
echo.
echo E MUDE estas:
echo [x] NEXTAUTH_URL = https://kyloai.vercel.app
echo [x] NEXT_PUBLIC_APP_URL = https://kyloai.vercel.app
echo.
echo Depois de adicionar TODAS, pressione qualquer tecla...
pause >nul

echo.
echo Fazendo deploy...
vercel --prod

echo.
echo FIM! Se funcionou, delete a pasta testes:
echo rmdir /s /q testes
echo.
pause