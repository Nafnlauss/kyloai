# Script para reinstalar dependências no Windows PowerShell
Write-Host "Limpando node_modules e package-lock.json..." -ForegroundColor Yellow

# Remove node_modules e package-lock.json
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force node_modules
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json
}

Write-Host "Instalando dependencias..." -ForegroundColor Green
npm install

Write-Host "Iniciando servidor de desenvolvimento..." -ForegroundColor Cyan
npm run dev