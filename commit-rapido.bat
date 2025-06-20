@echo off
echo ===================================
echo   COMMIT RAPIDO PARA VERCEL
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [1] Adicionando todos os arquivos...
git add .

echo.
echo [2] Status atual:
git status --short

echo.
echo [3] Fazendo commit...
git commit -m "Update: deploy automatico %date% %time%" 2>&1

if %errorlevel% neq 0 (
    echo.
    echo [!] Commit falhou. Tentando commit vazio...
    git commit --allow-empty -m "Force deploy: %date% %time%"
)

echo.
echo [4] Listando branches:
git branch -a

echo.
echo [5] Para fazer push, execute:
echo    git push origin main
echo    ou
echo    git push origin master
echo.
echo [6] Ou use Vercel CLI:
echo    vercel --prod
echo.

pause
