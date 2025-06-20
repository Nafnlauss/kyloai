@echo off
echo.
echo ====== FALTAM VARIAVEIS CRITICAS NO VERCEL! ======
echo.
echo Voce tem apenas 9 variaveis secundarias.
echo Faltam as ESSENCIAIS (DATABASE_URL, etc)
echo.
echo Abrindo arquivo com variaveis...
start notepad COPIAR-PARA-VERCEL.txt
echo.
echo Abrindo Vercel...
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo.
echo 1. COPIE todo o conteudo do Notepad
echo 2. No Vercel, clique em "Add Multiple"
echo 3. COLE e clique em "Save"
echo.
echo Depois pressione qualquer tecla...
pause >nul
echo.
echo Fazendo deploy...
vercel --prod
pause