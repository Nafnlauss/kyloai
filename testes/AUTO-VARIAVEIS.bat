@echo off
cd ..

echo ===================================
echo  PREPARANDO VARIAVEIS PARA VERCEL
echo ===================================
echo.

echo Extraindo variaveis do .env...
echo.

REM Cria arquivo temporário com as variáveis
echo COPIE ESTAS VARIAVEIS PARA O VERCEL: > temp_vars.txt
echo. >> temp_vars.txt

REM Extrai cada variável importante
for /f "tokens=1,* delims==" %%a in ('findstr "DATABASE_URL NEXTAUTH_SECRET NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY DIRECT_URL SESSION_SECRET ENCRYPTION_KEY REDIS_URL" .env') do (
    echo %%a >> temp_vars.txt
    echo %%b >> temp_vars.txt
    echo. >> temp_vars.txt
)

REM Adiciona variáveis específicas do Vercel
echo NEXTAUTH_URL >> temp_vars.txt
echo https://kyloai.vercel.app >> temp_vars.txt
echo. >> temp_vars.txt
echo NEXT_PUBLIC_APP_URL >> temp_vars.txt  
echo https://kyloai.vercel.app >> temp_vars.txt

echo.
echo Abrindo arquivo com variaveis...
notepad temp_vars.txt

echo.
echo Abrindo painel do Vercel...
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables

echo.
echo INSTRUCOES:
echo 1. No Vercel, clique em "Bulk Edit" ou "Add Multiple"
echo 2. Copie e cole as variaveis do Notepad
echo 3. Clique em "Save"
echo.
echo Depois de adicionar TODAS as variaveis, pressione qualquer tecla...
pause > nul

del temp_vars.txt

echo.
echo Fazendo deploy...
vercel --prod --yes

pause