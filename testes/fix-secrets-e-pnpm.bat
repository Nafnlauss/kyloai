@echo off
cd ..

echo ===================================
echo  RESOLVENDO PROBLEMA DE SECRETS
echo ===================================
echo.

echo [1] Removendo arquivo com secrets do Git...
git rm --cached testes/VARIAVEIS-VERCEL.md
echo /testes/VARIAVEIS-VERCEL.md >> .gitignore

echo.
echo [2] Fazendo novo commit...
git add .
git commit -m "fix: remove secrets from repository"

echo.
echo [3] Configurando Vercel para usar NPM...
echo {"installCommand": "npm install", "buildCommand": "npm run build", "framework": "nextjs"} > vercel.json

echo.
echo [4] Commitando configuracao do Vercel...
git add vercel.json
git commit -m "fix: configure Vercel to use npm instead of pnpm"

echo.
echo [5] Fazendo push...
git push origin main

echo.
echo ===================================
echo  PROBLEMA RESOLVIDO!
echo ===================================
echo.
echo Agora:
echo 1. Adicione as variaveis manualmente no Vercel
echo 2. Execute: vercel --prod
echo.
pause