@echo off
echo ===================================
echo  VERIFICAR LOGS DE ERRO
echo ===================================
echo.

cd ..

echo Digite o ID do deployment com erro (ex: kyloai-z30wialwn-nafnlaus-projects.vercel.app):
set /p deployment_id=ID: 

echo.
echo Buscando logs...
vercel logs %deployment_id%

echo.
echo ===================================
echo  DICAS DE RESOLUCAO:
echo ===================================
echo.
echo 1. Se o erro for "npm install failed":
echo    - Verifique se todas as dependencias estao corretas
echo    - Tente deletar node_modules e package-lock.json localmente
echo    - Execute: npm install --legacy-peer-deps
echo.
echo 2. Se o erro for com Prisma:
echo    - Verifique se DATABASE_URL esta configurada no Vercel
echo    - Verifique se o banco de dados esta acessivel
echo.
echo 3. Se o erro for com variaveis de ambiente:
echo    - Verifique se todas foram adicionadas no Vercel
echo    - Verifique se os nomes estao corretos (case sensitive)
echo.
pause