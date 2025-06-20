@echo off
echo ===================================
echo   VERIFICAR VARIAVEIS NO VERCEL
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [!] O deploy esta falhando porque o Vercel
echo     NAO tem acesso a DATABASE_URL!
echo.
echo [1] Abra o navegador e acesse:
echo.
echo https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo.
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo.
echo [2] Adicione estas variaveis (copie do .env):
echo.
echo DATABASE_URL = postgresql://postgres:m3b1%%23D%%5E7%%26W9%%2AypgzGhCv@db.snfxczgjpnydysccigps.supabase.co:5432/postgres
echo.
echo NEXTAUTH_SECRET = xPq3Rt7Uv9WcYa2Bd4FgHj6Km8NpQs0TvXz1Ac3Ef5Gi=
echo.
echo NEXTAUTH_URL = https://kyloai.vercel.app
echo.
echo [3] Depois de adicionar, execute:
echo.
echo vercel --prod
echo.
echo ===================================
echo IMPORTANTE: Sem DATABASE_URL, o Prisma
echo nao consegue gerar o client!
echo ===================================
echo.
pause
