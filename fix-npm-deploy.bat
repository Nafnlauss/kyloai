@echo off
echo ===================================
echo   DIAGNOSTICO NPM E DEPLOY
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [1] Testando npm install localmente...
echo.
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo.
    echo [!] NPM install falhou localmente!
    echo     Verifique os erros acima.
    echo.
    echo Tentando com --force...
    npm install --force
)

echo.
echo [2] Verificando versao do Node...
node --version
npm --version

echo.
echo [3] Criando vercel.json mais simples...
echo {>vercel.json
echo   "framework": "nextjs",>>vercel.json
echo   "installCommand": "npm install --force",>>vercel.json
echo   "buildCommand": "npm run build",>>vercel.json
echo   "env": {>>vercel.json
echo     "NODE_VERSION": "20">>vercel.json
echo   }>>vercel.json
echo }>>vercel.json

echo.
echo [4] Commitando...
git add .
git commit -m "Fix: npm install with force flag" 2>nul

echo.
echo [5] Deploy final...
vercel --prod --yes

echo.
echo ===================================
echo Se ainda falhar:
echo 1. Delete node_modules e package-lock.json
echo 2. Execute: npm install
echo 3. Corrija erros de dependencias
echo 4. Tente novamente
echo ===================================
echo.
pause
