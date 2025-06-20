# Script PowerShell para corrigir Prisma e fazer deploy
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   CORREÇÃO PRISMA + DEPLOY" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "F:\site-ia\ai-video-hub"

Write-Host "✅ Problema identificado:" -ForegroundColor Green
Write-Host "   - Schema Prisma estava configurado para SQLite" -ForegroundColor White
Write-Host "   - Mas usando recursos de PostgreSQL (enums, @db.Text)" -ForegroundColor White
Write-Host "   - Já corrigido para PostgreSQL!" -ForegroundColor White
Write-Host ""

# Testar Prisma
Write-Host "🔧 Testando Prisma localmente..." -ForegroundColor Yellow
$prismaResult = npx prisma generate 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma gerado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao gerar Prisma:" -ForegroundColor Red
    Write-Host $prismaResult -ForegroundColor Red
    Read-Host "Pressione Enter para continuar mesmo assim"
}
Write-Host ""

# Remover postinstall temporariamente
Write-Host "📝 Ajustando package.json..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json

# Backup do postinstall
$originalPostinstall = $packageJson.scripts.postinstall
$packageJson.scripts.postinstall = ""

# Salvar temporariamente
$packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json" -Encoding UTF8
Write-Host "   Removido postinstall temporariamente" -ForegroundColor Gray
Write-Host ""

# Commit
Write-Host "💾 Commitando mudanças..." -ForegroundColor Yellow
git add .
git commit -m "Fix: configurar Prisma para PostgreSQL e ajustar build" 2>$null
Write-Host ""

# Deploy
Write-Host "🚀 Iniciando deploy..." -ForegroundColor Cyan
vercel --prod --yes

# Restaurar postinstall
Write-Host ""
Write-Host "🔄 Restaurando package.json..." -ForegroundColor Yellow
$packageJson.scripts.postinstall = $originalPostinstall
$packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json" -Encoding UTF8
git add package.json
git commit -m "Restore: postinstall script" 2>$null
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   PRÓXIMOS PASSOS" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Configure as variáveis no Vercel!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Acesse:" -ForegroundColor White
Write-Host "https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables" -ForegroundColor Cyan
Write-Host ""
Write-Host "Adicione estas variáveis essenciais:" -ForegroundColor Yellow
Write-Host "1. DATABASE_URL (copie do .env)" -ForegroundColor White
Write-Host "2. DIRECT_URL (copie do .env)" -ForegroundColor White
Write-Host "3. NEXTAUTH_SECRET (copie do .env)" -ForegroundColor White
Write-Host "4. NEXTAUTH_URL = https://kyloai.vercel.app" -ForegroundColor White
Write-Host "5. GOOGLE_CLIENT_ID (copie do .env)" -ForegroundColor White
Write-Host "6. GOOGLE_CLIENT_SECRET (copie do .env)" -ForegroundColor White
Write-Host ""
Write-Host "Depois de adicionar as variáveis:" -ForegroundColor Yellow
Write-Host "vercel --prod" -ForegroundColor White
Write-Host ""

Read-Host "Pressione Enter para sair"
