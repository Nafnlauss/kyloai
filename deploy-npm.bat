@echo off
:: Deploy definitivo com NPM

cd /d F:\site-ia\ai-video-hub

echo ===================================
echo   DEPLOY DEFINITIVO - NPM
echo ===================================
echo.

:: Garantir que estamos usando NPM
echo [1] Configurando para usar NPM...
echo {>vercel.json
echo   "framework": "nextjs",>>vercel.json
echo   "installCommand": "npm install --legacy-peer-deps",>>vercel.json
echo   "buildCommand": "npm run build",>>vercel.json
echo   "outputDirectory": ".next">>vercel.json
echo }>>vercel.json

:: Verificar se package-lock.json existe
if exist package-lock.json (
    echo [OK] package-lock.json encontrado
) else (
    echo [!] Gerando package-lock.json...
    npm install --package-lock-only
)

:: Commit
echo.
echo [2] Salvando mudancas...
git add .
git commit -m "Fix: configuracao NPM para Vercel" 2>nul

:: Deploy
echo.
echo [3] Iniciando deploy final...
echo.
vercel --prod --yes

echo.
echo ===================================
echo Se funcionou: Parabens!
echo Se falhou: Execute localmente:
echo   npm install
echo   npm run build
echo E corrija os erros antes do deploy
echo ===================================
echo.
pause
