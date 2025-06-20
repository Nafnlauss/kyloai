@echo off
echo ===================================
echo  ABORDAGEM ALTERNATIVA - NOVO DEPLOY
echo ===================================
echo.

cd ..

echo [1] Deletando configuracao antiga do Vercel...
rmdir /s /q .vercel 2>nul

echo.
echo [2] Iniciando novo deploy do zero...
echo.
echo IMPORTANTE: Quando perguntar:
echo - Set up and deploy: Y
echo - Which scope: (escolha sua conta)
echo - Link to existing project: N
echo - Project name: kyloai-v2 (ou outro nome)
echo - In which directory: ./ (enter)
echo - Override settings: N
echo.

vercel

echo.
echo [3] Depois de configurar, execute:
echo     vercel --prod
echo.
pause