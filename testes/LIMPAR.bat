@echo off
echo Movendo todos os arquivos criados para a pasta testes...
echo.

:: Mover todos os arquivos .bat
for %%f in (*.bat) do (
    if not "%%f"=="package.json" (
        move "%%f" testes\ 2>nul
    )
)

:: Mover arquivos .md criados
move PROBLEMA-BUILD.md testes\ 2>nul
move SOLUCAO-FINAL.md testes\ 2>nul

:: Mover arquivos .ps1
move *.ps1 testes\ 2>nul

echo.
echo Feito! Todos os arquivos foram movidos para a pasta testes.
echo.

:: Mover este proprio arquivo
move MOVER-TUDO.bat testes\ 2>nul

pause