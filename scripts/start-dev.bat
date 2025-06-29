@echo off
echo Iniciando servidor de desenvolvimento Kylo...
echo.

REM Volta para o diretorio raiz do projeto
cd ..

REM Verifica se node_modules existe
if not exist "node_modules" (
    echo Instalando dependencias...
    call npm install
    echo.
)

echo Iniciando servidor na porta 3000...
echo Acesse: http://localhost:3000
echo.
echo Para parar o servidor, pressione Ctrl+C
echo.

npm run dev