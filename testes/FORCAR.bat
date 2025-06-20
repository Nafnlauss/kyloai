@echo off
echo ===================================
echo  FORCAR ADICAO DE VARIAVEIS
echo ===================================
echo.
cd ..
echo Listando variaveis atuais...
vercel env ls
echo.
echo ===================================
echo.
echo Forcando adicao para TODOS ambientes...
echo.

:: DATABASE_URL
echo postgresql://postgres:m3b1%%23D%%5E7%%26W9%%2AypgzGhCv@db.snfxczgjpnydscclgps.supabase.co:5432/postgres > temp.txt
vercel env add DATABASE_URL < temp.txt
del temp.txt

:: NEXTAUTH_SECRET
echo xPq3Rt7Uv9WcYa2Bd4FgHj6Km8NpQs0TvXz1Ac3Ef5Gi= > temp.txt
vercel env add NEXTAUTH_SECRET < temp.txt
del temp.txt

:: NEXTAUTH_URL
echo https://kyloai.vercel.app > temp.txt
vercel env add NEXTAUTH_URL < temp.txt
del temp.txt

:: NEXT_PUBLIC_APP_URL
echo https://kyloai.vercel.app > temp.txt
vercel env add NEXT_PUBLIC_APP_URL < temp.txt
del temp.txt

echo.
echo Verificando variaveis...
vercel env ls
echo.
echo Fazendo deploy...
vercel --prod
pause