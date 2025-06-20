@echo off
cls
echo ========================================================
echo         ERRO: FALTAM VARIAVEIS NO VERCEL!
echo ========================================================
echo.
echo VOCE TEM:  9 variaveis (apenas secundarias)
echo PRECISA:   20+ variaveis (incluindo as ESSENCIAIS)
echo.
echo FALTAM AS MAIS IMPORTANTES:
echo.
echo [X] DATABASE_URL ............ (Banco de dados)
echo [X] NEXTAUTH_SECRET ......... (Autenticacao)  
echo [X] NEXT_PUBLIC_SUPABASE_URL  (Supabase)
echo [X] DIRECT_URL .............. (Prisma)
echo [X] + 11 outras variaveis
echo.
echo ========================================================
echo.
echo SOLUCAO: Execute o comando abaixo
echo.
echo         .\V.bat
echo.
echo ========================================================
pause