@echo off
echo ===================================
echo  SOLUCAO FINAL - VARIAVEIS VERCEL
echo ===================================
echo.

echo Voce tem apenas 9 variaveis secundarias no Vercel.
echo Faltam as 15 variaveis ESSENCIAIS!
echo.

echo Abrindo arquivo com variaveis...
start notepad COPIAR-PARA-VERCEL.txt

echo.
echo Abrindo Vercel...
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables

echo.
echo INSTRUCOES:
echo 1. COPIE todo conteudo do Notepad (Ctrl+A, Ctrl+C)
echo 2. No Vercel, clique em "Add Multiple" 
echo 3. COLE (Ctrl+V) e clique "Save"
echo.
echo Sao 15 variaveis essenciais!
echo.
echo Depois de adicionar, pressione qualquer tecla...
pause > nul

cd ..
echo.
echo Fazendo deploy...
vercel --prod

echo.
echo ===================================
echo  FIM!
echo ===================================
echo.
echo Se funcionou, delete a pasta testes:
echo cd ..
echo rmdir /s /q testes
echo.
pause