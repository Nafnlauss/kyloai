@echo off
echo ===================================
echo  DELETANDO E RECRIANDO VARIAVEIS
echo ===================================
echo.
echo PASSO 1: Deletando variaveis existentes...
echo.
vercel env rm NEXTAUTH_SECRET production -y
vercel env rm DATABASE_URL production -y
vercel env rm NEXTAUTH_URL production -y
vercel env rm NEXT_PUBLIC_APP_URL production -y
echo.
echo PASSO 2: Execute agora:
echo.
echo    .\ADD-CLI.bat
echo.
echo Isso vai adicionar as variaveis novamente.
echo.
pause