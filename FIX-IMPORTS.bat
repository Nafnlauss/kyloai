@echo off
echo ===================================
echo  CORRIGINDO IMPORTS DO NEXT-AUTH
echo ===================================
echo.
echo Corrigindo imports de getServerSession...
echo.

:: Criar script PowerShell para corrigir imports
powershell -Command "Get-ChildItem -Path . -Include *.ts,*.tsx -Recurse | ForEach-Object { $content = Get-Content $_.FullName -Raw; if ($content -match 'from ''next-auth''.*getServerSession') { $newContent = $content -replace 'from ''next-auth''', 'from ''next-auth/next'''; Set-Content -Path $_.FullName -Value $newContent -NoNewline; Write-Host 'Fixed: ' $_.FullName } }"

echo.
echo Imports corrigidos!
echo.
pause