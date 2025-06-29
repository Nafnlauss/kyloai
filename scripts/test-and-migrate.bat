@echo off
echo ======================================
echo TESTANDO CONEXAO COM BANCO DE DADOS
echo ======================================
echo.

echo 1. Testando conexao...
echo.
node test-db-connection.js
echo.

echo ======================================
echo 2. Executando migracoes do Prisma...
echo ======================================
echo.
npx prisma migrate deploy
echo.

echo ======================================
echo 3. Gerando cliente Prisma...
echo ======================================
echo.
npx prisma generate
echo.

echo ======================================
echo PROCESSO CONCLUIDO!
echo ======================================
pause
