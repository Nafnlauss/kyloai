@echo off
cd ..

echo ===================================
echo  RESOLVENDO TUDO DE UMA VEZ
echo ===================================
echo.

REM Volta o commit
git reset --soft HEAD~1

REM Remove o arquivo problemático do staging
git reset HEAD testes/VARIAVEIS-VERCEL.md

REM Adiciona ao gitignore
echo testes/VARIAVEIS-VERCEL.md >> .gitignore

REM Cria vercel.json configurando NPM
echo {"installCommand": "npm install", "buildCommand": "npm run build", "framework": "nextjs"} > vercel.json

REM Adiciona tudo exceto o arquivo com secrets
git add -A
git commit -m "fix: add UI components and configure npm"

REM Push
git push origin main -f

echo.
echo ===================================
echo  PRONTO!
echo ===================================
echo.
echo Agora:
echo 1. Abra https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo 2. Adicione as variaveis do arquivo .env
echo 3. Execute: vercel --prod
echo.
pause