@echo off
echo ===================================
echo  ADICIONAR VARIAVEIS UMA POR UMA
echo ===================================
echo.
echo O Vercel nao aceitou todas de uma vez.
echo Vamos adicionar uma por uma.
echo.
echo ORDEM RECOMENDADA:
echo.
echo 1. DATABASE_URL
echo 2. NEXTAUTH_SECRET
echo 3. NEXTAUTH_URL
echo 4. NEXT_PUBLIC_APP_URL (mude para https://kyloai.vercel.app)
echo 5. Depois as outras...
echo.
echo DICA: Se der erro em alguma, tente:
echo - Remover caracteres especiais
echo - Adicionar entre aspas
echo - Verificar se nao tem espacos extras
echo.
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo.
echo Depois de adicionar PELO MENOS as 4 primeiras, pressione qualquer tecla...
pause > nul
echo.
cd ..
echo Tentando deploy...
vercel --prod
pause