@echo off
cd F:\site-ia\ai-video-hub

:: Criar o vercel.json mais simples possível
echo {"framework":"nextjs"} > vercel.json

:: Commit
git add vercel.json
git commit -m "Minimal vercel config"

:: Deploy
vercel --prod --yes

pause
