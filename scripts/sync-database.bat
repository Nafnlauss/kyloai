@echo off
echo Sincronizando banco de dados...
echo.

cd ..

echo Usando db push (mais rapido para desenvolvimento)...
npx prisma db push --accept-data-loss

echo.
echo Banco sincronizado!
echo.
echo Teste novamente em: http://localhost:3000/test-auth.html
pause