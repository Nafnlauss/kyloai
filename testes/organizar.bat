@echo off
echo ===================================
echo  ORGANIZANDO ARQUIVOS
echo ===================================
echo.

echo Movendo arquivos criados para pasta testes...
echo.

REM Move arquivos .bat
if exist ADD-VARS.bat move ADD-VARS.bat testes\
if exist ADICIONAR-VARIAVEIS.bat move ADICIONAR-VARIAVEIS.bat testes\
if exist DEPLOY-VERCEL.bat move DEPLOY-VERCEL.bat testes\
if exist ERRO.bat move ERRO.bat testes\
if exist RUN-AUTO-DEPLOY.bat move RUN-AUTO-DEPLOY.bat testes\
if exist V.bat move V.bat testes\

REM Move arquivos .md
if exist "!ERRO-VARIAVEIS.md" move "!ERRO-VARIAVEIS.md" testes\
if exist "!.md" move "!.md" testes\
if exist "000-RESUMO-FINAL.md" move "000-RESUMO-FINAL.md" testes\
if exist PROBLEMA-VARIAVEIS.md move PROBLEMA-VARIAVEIS.md testes\
if exist SOLUCAO-VERCEL.md move SOLUCAO-VERCEL.md testes\
if exist VARIAVEIS-FALTANTES.md move VARIAVEIS-FALTANTES.md testes\

REM Move arquivos .txt
if exist COPIAR-PARA-VERCEL.txt move COPIAR-PARA-VERCEL.txt testes\

REM Move arquivos .ps1
if exist adicionar-variaveis.ps1 move adicionar-variaveis.ps1 testes\

echo.
echo [OK] Arquivos movidos para pasta testes!
echo.
echo Agora execute:
echo cd testes
echo .\V.bat
echo.
pause