cd F:\site-ia\ai-video-hub
echo {"framework":"nextjs","installCommand":"npm install --legacy-peer-deps","buildCommand":"npm run build"} > vercel.json
git add vercel.json
git commit -m "Fix npm deploy"
vercel --prod --yes
pause
