@echo off
cd ..

echo ===================================
echo  REMOVENDO SECRETS DO HISTORICO
echo ===================================
echo.

echo [1] Verificando commits com problema...
git log --oneline -n 5

echo.
echo [2] Resetando para antes dos commits problematicos...
REM Volta 2 commits
git reset --hard HEAD~2

echo.
echo [3] Criando vercel.json com configuracao NPM...
echo {"installCommand": "npm install", "buildCommand": "npm run build", "framework": "nextjs"} > vercel.json

echo.
echo [4] Adicionando arquivos (sem secrets)...
git add src/components/ui/*.tsx
git add package*.json
git add vercel.json
git add .gitignore

echo.
echo [5] Commit limpo...
git commit -m "fix: add UI components and configure npm for Vercel"

echo.
echo [6] Push forcado...
git push origin main --force

echo.
echo ===================================
echo  PRONTO!
echo ===================================
echo.
echo Agora sim deve funcionar!
echo.
echo Proximos passos:
echo 1. Abra: https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo 2. Adicione as variaveis do arquivo .env
echo 3. Execute: vercel --prod
echo.
pause