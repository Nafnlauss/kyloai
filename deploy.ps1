@echo off
cd F:\site-ia\ai-video-hub

:: Remove postinstall
powershell -Command "$p=Get-Content 'package.json'|ConvertFrom-Json;$p.scripts.PSObject.Properties.Remove('postinstall');$p|ConvertTo-Json -Depth 10|Set-Content 'package.json'"

:: Commit
git add .
git commit -m "Remove postinstall"

:: Deploy
vercel --prod --yes

echo.
echo AGORA ADICIONE AS VARIAVEIS NO VERCEL:
echo https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo.
pause
