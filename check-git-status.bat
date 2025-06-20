@echo off
echo === Verificando status do Git ===
echo.

cd /d F:\site-ia\ai-video-hub

echo Diretorio atual:
cd
echo.

echo Status do Git:
git status
echo.

echo Branches disponiveis:
git branch -a
echo.

echo Remote configurado:
git remote -v
echo.

echo Ultimos commits:
git log --oneline -5
echo.

echo Verificando se ha alteracoes:
git diff --stat
echo.

pause
