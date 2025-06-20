@echo off
cd ..
echo Corrigindo imports...
powershell -Command "Get-ChildItem -Path ./src -Recurse -Include *.ts,*.tsx | ForEach-Object { $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue; if ($content -and $content.Contains(\"import { getServerSession } from 'next-auth'\")) { $content.Replace(\"import { getServerSession } from 'next-auth'\", \"import { getServerSession } from 'next-auth/next'\") | Set-Content $_.FullName -NoNewline; Write-Host \"Fixed: $_\" } }"
npm run build
pause