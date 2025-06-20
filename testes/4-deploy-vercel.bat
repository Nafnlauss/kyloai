@echo off
echo ===================================
echo  DEPLOY NO VERCEL
echo ===================================
echo.

cd ..

echo Fazendo deploy no Vercel...
echo.

vercel --prod

echo.
echo ===================================
echo  DEPLOY FINALIZADO!
echo ===================================
echo.
echo Se ainda houver erros, verifique:
echo 1. Se todas as variaveis foram adicionadas corretamente
echo 2. Os logs em: https://vercel.com/nafnlaus-projects/kyloai
echo.
pause