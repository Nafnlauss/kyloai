@echo off
echo ===================================
echo   CORRIGINDO PRISMA E DEPLOY
echo ===================================
echo.

cd /d F:\site-ia\ai-video-hub

echo [1] Schema.prisma corrigido para PostgreSQL!
echo.

echo [2] Testando geracao do Prisma localmente...
npx prisma generate

if %errorlevel% neq 0 (
    echo.
    echo [!] Erro ao gerar Prisma. Verifique sua DATABASE_URL
    pause
    exit /b 1
)

echo.
echo [3] Prisma gerado com sucesso!
echo.

echo [4] Commitando correcao...
git add prisma/schema.prisma
git commit -m "Fix: mudar prisma de sqlite para postgresql"

echo.
echo [5] Deploy final...
vercel --prod --yes

echo.
echo ===================================
echo IMPORTANTE: Configure no Vercel:
echo.
echo 1. DATABASE_URL (da Supabase)
echo 2. NEXTAUTH_SECRET
echo 3. Outras variaveis do .env
echo.
echo Dashboard:
echo https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo ===================================
echo.
pause
