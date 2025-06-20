@echo off
cd ..
git add .
git commit -m "fix: add UI components and dependencies"
git push origin main
echo.
echo Agora adicione as variaveis no Vercel e execute: vercel --prod
echo.
pause