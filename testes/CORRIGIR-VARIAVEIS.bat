@echo off
echo ===================================
echo  CORRIGINDO VARIAVEIS NO VERCEL
echo ===================================
echo.
echo O Vercel esta com conflito de variaveis!
echo.
echo SOLUCAO 1: Deletar e recriar o projeto
echo ----------------------------------------
echo 1. No Vercel, va em Settings
echo 2. Delete Project (no final da pagina)
echo 3. Execute: vercel --yes
echo.
echo SOLUCAO 2: Usar CLI direto
echo ----------------------------------------
echo Execute os comandos abaixo:
echo.
pause
echo.
echo Adicionando variaveis via CLI...
vercel env add DATABASE_URL production < nul
vercel env add NEXTAUTH_SECRET production < nul
vercel env add NEXTAUTH_URL production < nul
vercel env add NEXT_PUBLIC_APP_URL production < nul
echo.
echo Agora faca o deploy:
vercel --prod
pause