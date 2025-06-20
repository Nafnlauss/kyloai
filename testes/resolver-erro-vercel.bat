@echo off
echo ===================================
echo  SOLUCAO PARA ERRO DO VERCEL
echo ===================================
echo.
echo O erro "No environment variables were created" pode acontecer por:
echo.
echo 1. Limite de caracteres
echo 2. Caracteres especiais na DATABASE_URL
echo 3. Formato incorreto
echo.
echo TENTE ASSIM:
echo.
echo [1] Delete TODAS as variaveis existentes no Vercel
echo [2] Adicione UMA POR VEZ, comecando com:
echo     - NEXTAUTH_SECRET
echo     - NEXTAUTH_URL
echo     - DATABASE_URL (se der erro, veja abaixo)
echo.
echo Para DATABASE_URL com problema, use:
echo postgresql://postgres:password@db.snfxczgjpnydysccigps.supabase.co:5432/postgres
echo (temporariamente sem a senha complexa)
echo.
start https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables
echo.
echo Pressione qualquer tecla para abrir as variaveis essenciais...
pause > nul
start notepad VARIAVEIS-ESSENCIAIS.md
echo.
echo Depois de adicionar, pressione qualquer tecla para fazer deploy...
pause > nul
cd ..
vercel --prod
pause