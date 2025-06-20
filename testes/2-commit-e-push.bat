@echo off
echo ===================================
echo  COMMIT E PUSH PARA VERCEL
echo ===================================
echo.

cd ..

echo [1] Verificando status do Git...
git status

echo.
echo [2] Adicionando arquivos...
git add .

echo.
echo [3] Fazendo commit...
git commit -m "fix: configuracao para deploy no Vercel"

echo.
echo [4] Fazendo push...
git push origin main

echo.
echo ===================================
echo  PUSH CONCLUIDO!
echo ===================================
echo.
echo Agora o Vercel vai tentar fazer o deploy automaticamente.
echo Se falhar, execute o script 3-adicionar-variaveis-vercel.bat
echo.
pause