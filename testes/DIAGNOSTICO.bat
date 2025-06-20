@echo off
cd ..

echo ===================================
echo  DIAGNOSTICO E CORRECAO AUTOMATICA
echo ===================================
echo.

echo [1] O erro indica que o build falhou no Vercel.
echo.
echo Causas mais provaveis:
echo - Variaveis de ambiente nao configuradas
echo - Erro de tipos do TypeScript
echo.

echo [2] Abrindo painel de variaveis do Vercel...
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables

echo.
echo [3] Verifique se estas variaveis estao configuradas:
echo.
echo ESSENCIAIS:
echo - DATABASE_URL
echo - NEXTAUTH_SECRET  
echo - NEXTAUTH_URL (use: https://kyloai.vercel.app)
echo - NEXT_PUBLIC_APP_URL (use: https://kyloai.vercel.app)
echo.
echo IMPORTANTES:
echo - NEXT_PUBLIC_SUPABASE_URL
echo - NEXT_PUBLIC_SUPABASE_ANON_KEY
echo - DIRECT_URL
echo - SUPABASE_SERVICE_ROLE_KEY
echo.

set /p configured="Todas as variaveis estao configuradas? (s/n): "

if /i "%configured%"=="n" (
    echo.
    echo [4] Copie os valores do arquivo .env
    echo.
    notepad .env
    echo.
    echo Adicione as variaveis no Vercel e depois pressione qualquer tecla...
    pause > nul
)

echo.
echo [5] Tentando deploy novamente...
vercel --prod --yes

echo.
echo Se ainda der erro, execute:
echo vercel logs [deployment-url]
echo.
pause