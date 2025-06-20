@echo off
cd ..

echo Resetando tudo...
git reset --hard origin/main

echo.
echo Adicionando apenas componentes e config...
echo {"installCommand": "npm install", "buildCommand": "npm run build", "framework": "nextjs"} > vercel.json
git add src/components/ui/*.tsx
git add package.json package-lock.json
git add vercel.json
git commit -m "fix: add UI components"
git push

echo.
echo [OK] Pronto!
pause