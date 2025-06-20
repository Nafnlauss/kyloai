@echo off
cls
echo ===================================
echo  ERRO: VARIAVEIS NAO FORAM SALVAS
echo ===================================
echo.
echo SOLUCAO RAPIDA:
echo.
echo 1. Clique em "Add Another" no Vercel
echo 2. Adicione UMA variavel por vez
echo 3. Comece com estas 4 essenciais:
echo.
echo    NEXTAUTH_SECRET = xPq3Rt7Uv9WcYa2Bd4FgHj6Km8NpQs0TvXz1Ac3Ef5Gi=
echo    NEXTAUTH_URL = https://kyloai.vercel.app  
echo    NEXT_PUBLIC_APP_URL = https://kyloai.vercel.app
echo    DATABASE_URL = (copie do arquivo 4-VARIAVEIS.txt)
echo.
echo Abrindo arquivo com as 4 variaveis...
start notepad 4-VARIAVEIS.txt
echo.
echo Abrindo Vercel...
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo.
echo Adicione PELO MENOS essas 4 e depois pressione qualquer tecla...
pause > nul
echo.
cd ..
vercel --prod
pause