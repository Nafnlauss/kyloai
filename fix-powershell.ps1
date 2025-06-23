# PowerShell Script para corrigir instalação no Windows

Write-Host "=== Kylo AI - Fix Installation Script ===" -ForegroundColor Cyan
Write-Host ""

# Parar todos os processos Node
Write-Host "[1/6] Stopping all Node processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Remover pastas antigas
Write-Host "[2/6] Removing old folders..." -ForegroundColor Yellow
$foldersToRemove = @("node_modules", ".next", ".pnpm-store")
foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder) {
        Write-Host "  - Removing $folder"
        Remove-Item -Path $folder -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Remover arquivos de lock
Write-Host "[3/6] Removing lock files..." -ForegroundColor Yellow
$filesToRemove = @("package-lock.json", "pnpm-lock.yaml", "yarn.lock")
foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Write-Host "  - Removing $file"
        Remove-Item -Path $file -Force -ErrorAction SilentlyContinue
    }
}

# Limpar cache do npm
Write-Host "[4/6] Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Instalar dependências
Write-Host "[5/6] Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
npm install --legacy-peer-deps --force

# Gerar Prisma Client
Write-Host "[6/6] Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

Write-Host ""
Write-Host "=== Installation Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development server, run:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""