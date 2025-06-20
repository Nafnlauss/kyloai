@echo off
echo ===================================
echo  ADICIONANDO VIA VERCEL CLI
echo ===================================
echo.
cd ..

echo Adicionando DATABASE_URL...
echo postgresql://postgres:m3b1%%23D%%5E7%%26W9%%2AypgzGhCv@db.snfxczgjpnydysccigps.supabase.co:5432/postgres | vercel env add DATABASE_URL production

echo.
echo Adicionando NEXTAUTH_SECRET...
echo xPq3Rt7Uv9WcYa2Bd4FgHj6Km8NpQs0TvXz1Ac3Ef5Gi= | vercel env add NEXTAUTH_SECRET production

echo.
echo Adicionando NEXTAUTH_URL...
echo https://kyloai.vercel.app | vercel env add NEXTAUTH_URL production

echo.
echo Adicionando NEXT_PUBLIC_APP_URL...
echo https://kyloai.vercel.app | vercel env add NEXT_PUBLIC_APP_URL production

echo.
echo ===================================
echo  VARIAVEIS ADICIONADAS VIA CLI
echo ===================================
echo.
echo Fazendo deploy...
vercel --prod

pause