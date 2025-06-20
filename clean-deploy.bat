@echo off
echo ===================================
echo   LIMPEZA E REINSTALACAO
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [!] Este script vai limpar node_modules e reinstalar tudo!
echo.
pause

echo [1] Removendo node_modules...
rmdir /s /q node_modules 2>nul

echo.
echo [2] Removendo package-lock.json...
del package-lock.json 2>nul

echo.
echo [3] Limpando cache do NPM...
npm cache clean --force

echo.
echo [4] Instalando dependencias novamente...
npm install

if %errorlevel% neq 0 (
    echo.
    echo [!] Erro na instalacao. Tentando com --force...
    npm install --force
)

echo.
echo [5] Testando build local...
npm run build

if %errorlevel% neq 0 (
    echo.
    echo [!] Build falhou! Corrija os erros antes de fazer deploy.
    pause
    exit /b 1
)

echo.
echo [6] Build OK! Preparando deploy...
echo {>vercel.json
echo   "framework": "nextjs">>vercel.json
echo }>>vercel.json

echo.
echo [7] Commitando...
git add .
git commit -m "Clean install and deploy" 2>nul

echo.
echo [8] Deploy...
vercel --prod --yes

echo.
pause
