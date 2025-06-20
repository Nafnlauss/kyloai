@echo off
cd ..
git reset --soft HEAD~1
git reset HEAD testes/VARIAVEIS-VERCEL.md
echo testes/VARIAVEIS-VERCEL.md >> .gitignore
echo {"installCommand": "npm install", "buildCommand": "npm run build", "framework": "nextjs"} > vercel.json
git add -A
git commit -m "fix: add UI components and configure npm"
git push origin main -f
echo.
echo [OK] Push feito! Agora adicione as variaveis no Vercel e execute: vercel --prod
pause