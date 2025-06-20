@echo off
echo ===================================
echo  ADICIONAR VARIAVEIS NO VERCEL
echo ===================================
echo.

echo Abrindo arquivo com as variaveis...
start notepad "VARIAVEIS-VERCEL.md"

echo.
echo Abrindo o painel do Vercel no navegador...
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables

echo.
echo ===================================
echo  INSTRUCOES:
echo ===================================
echo.
echo 1. No Vercel, clique em "Add New"
echo 2. Copie e cole cada variavel do arquivo que abriu
echo 3. Clique em "Save" apos adicionar todas
echo 4. Execute o script 4-deploy-vercel.bat
echo.
pause