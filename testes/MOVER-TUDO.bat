@echo off
echo ===================================
echo  MOVENDO ARQUIVOS PARA PASTA TESTES
echo ===================================
echo.

move FIX-BUILD.bat testes\ 2>nul
move fix-deploy.ps1 testes\ 2>nul
move FIX-IMPORTS.bat testes\ 2>nul
move FIX-NOW.bat testes\ 2>nul
move GO.bat testes\ 2>nul
move NOVO-DEPLOY.bat testes\ 2>nul
move NOW.bat testes\ 2>nul
move PROBLEMA-BUILD.md testes\ 2>nul
move QUICK-DEPLOY.bat testes\ 2>nul
move QUICK-FIX.bat testes\ 2>nul
move RUN.bat testes\ 2>nul
move SOLUCAO-FINAL.md testes\ 2>nul
move TESTAR-LOCAL.bat testes\ 2>nul
move VER-ERRO.bat testes\ 2>nul
move X.bat testes\ 2>nul

echo.
echo Arquivos movidos!
echo.
pause