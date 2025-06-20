@echo off
cd ..

echo ===================================
echo  FIX RAPIDO - SECRETS E PNPM
echo ===================================
echo.

echo [1] Desfazendo ultimo commit...
git reset --soft HEAD~1

echo.
echo [2] Removendo arquivo com secrets...
git reset HEAD testes/VARIAVEIS-VERCEL.md
echo testes/VARIAVEIS-VERCEL.md >> .gitignore

echo.
echo [3] Configurando NPM no Vercel...
echo {"installCommand": "npm install", "buildCommand": "npm run build", "framework": "nextjs"} > vercel.json

echo.
echo [4] Fazendo commit sem o arquivo de variaveis...
git add .
git commit -m "fix: add UI components and configure npm for Vercel"

echo.
echo [5] Push...
git push origin main -f

echo.
echo [OK] Agora o push deve funcionar!
echo.
pause