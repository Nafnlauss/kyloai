@echo off
echo ===================================
echo  DEPLOY SIMPLES E DIRETO
echo ===================================
echo.

echo [1] Corrigindo imports do next-auth...
powershell -Command "Get-ChildItem -Path src -Include *.ts,*.tsx -Recurse | Where-Object { $_.FullName -notlike '*node_modules*' } | ForEach-Object { $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue; if ($content -and $content -match 'from ''next-auth''.*getServerSession') { $newContent = $content -replace 'from ''next-auth''', 'from ''next-auth/next'''; Set-Content -Path $_.FullName -Value $newContent -NoNewline; Write-Host 'Fixed: ' $_.Name } }"

echo.
echo [2] Commit e push...
git add -A
git commit -m "fix: remove nodemailer and fix next-auth imports"
git push

echo.
echo [3] Deploy no Vercel...
vercel --prod

echo.
echo PRONTO! Se ainda der erro, me mostre os logs.
echo.
pause