@echo off
cd ..

echo ===================================
echo  SOLUCAO DEFINITIVA
echo ===================================
echo.

echo [1] Voltando 2 commits...
git reset --hard HEAD~2

echo.
echo [2] Removendo pasta testes temporariamente...
move testes testes_backup

echo.
echo [3] Criando vercel.json...
echo {"installCommand": "npm install", "buildCommand": "npm run build", "framework": "nextjs"} > vercel.json

echo.
echo [4] Commitando apenas os componentes UI...
git add src/components/ui/*.tsx
git add package*.json  
git add vercel.json
git commit -m "fix: add UI components and dependencies"

echo.
echo [5] Push...
git push origin main --force

echo.
echo [6] Restaurando pasta testes...
move testes_backup testes

echo.
echo ===================================
echo  SUCESSO!
echo ===================================
echo.
echo Agora:
echo 1. Adicione as variaveis no Vercel
echo 2. Execute: vercel --prod
echo.
pause