@echo off
echo ===================================
echo  ADICIONANDO VARIAVEIS VIA CLI
echo ===================================
echo.
echo Criando arquivo temporario com variaveis...

cd ..

:: Criar arquivo temporario para DATABASE_URL
echo postgresql://postgres:m3b1%%23D%%5E7%%26W9%%2AypgzGhCv@db.snfxczgjpnydscclgps.supabase.co:5432/postgres > temp_db.txt

:: Adicionar DATABASE_URL
echo Adicionando DATABASE_URL...
vercel env add DATABASE_URL production < temp_db.txt
del temp_db.txt

:: Criar arquivo temporario para NEXTAUTH_SECRET
echo xPq3Rt7Uv9WcYa2Bd4FgHj6Km8NpQs0TvXz1Ac3Ef5Gi= > temp_secret.txt

:: Adicionar NEXTAUTH_SECRET
echo Adicionando NEXTAUTH_SECRET...
vercel env add NEXTAUTH_SECRET production < temp_secret.txt
del temp_secret.txt

:: Adicionar NEXTAUTH_URL
echo https://kyloai.vercel.app > temp_url.txt
vercel env add NEXTAUTH_URL production < temp_url.txt
del temp_url.txt

:: Adicionar NEXT_PUBLIC_APP_URL
echo https://kyloai.vercel.app > temp_public.txt
vercel env add NEXT_PUBLIC_APP_URL production < temp_public.txt
del temp_public.txt

echo.
echo Variaveis adicionadas! Fazendo deploy...
echo.
vercel --prod
pause