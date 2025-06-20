@echo off
cd ..
git push --set-upstream origin main
vercel --prod
pause