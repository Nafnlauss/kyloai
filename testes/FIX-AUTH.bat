@echo off
cd ..

echo ===================================
echo  CORRIGINDO IMPORTS NEXT-AUTH
echo ===================================
echo.

echo Corrigindo imports em todos os arquivos...
echo.

powershell -Command "Get-ChildItem -Path ./src -Recurse -Include *.ts,*.tsx | ForEach-Object { $content = Get-Content $_.FullName -Raw; if ($content -match \"import { getServerSession } from 'next-auth'\") { $content -replace \"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\" | Set-Content $_.FullName; Write-Host \"Fixed: $($_.FullName)\" } }"

echo.
echo ===================================
echo  TESTANDO BUILD
echo ===================================
echo.

npm run build

pause