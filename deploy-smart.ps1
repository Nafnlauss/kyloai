# Deploy Inteligente para Vercel
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   DEPLOY INTELIGENTE VERCEL" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "F:\site-ia\ai-video-hub"

# Verificar Node e NPM
Write-Host "🔍 Verificando ambiente..." -ForegroundColor Yellow
$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "   Node: $nodeVersion" -ForegroundColor Green
Write-Host "   NPM: $npmVersion" -ForegroundColor Green
Write-Host ""

# Verificar se package-lock.json existe
Write-Host "📦 Verificando dependências..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Write-Host "✅ package-lock.json existe" -ForegroundColor Green
} else {
    Write-Host "⚠️  package-lock.json não encontrado" -ForegroundColor Yellow
    Write-Host "   Gerando..." -ForegroundColor White
    npm install --package-lock-only
}
Write-Host ""

# Testar build local primeiro
Write-Host "🏗️  Testando build local..." -ForegroundColor Yellow
Write-Host "   (Isso pode demorar alguns minutos)" -ForegroundColor Gray

$buildTest = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build local bem-sucedido!" -ForegroundColor Green
} else {
    Write-Host "❌ Build local falhou!" -ForegroundColor Red
    Write-Host "   Erro:" -ForegroundColor Yellow
    Write-Host $buildTest -ForegroundColor Red
    Write-Host ""
    Write-Host "⚠️  Corrija os erros antes de fazer deploy!" -ForegroundColor Yellow
    Read-Host "Pressione Enter para continuar mesmo assim ou Ctrl+C para cancelar"
}
Write-Host ""

# Criar vercel.json otimizado
Write-Host "📝 Criando configuração otimizada..." -ForegroundColor Yellow
$vercelConfig = @{
    framework = "nextjs"
    installCommand = "npm ci --legacy-peer-deps || npm install --legacy-peer-deps"
    buildCommand = "npm run build"
    outputDirectory = ".next"
    env = @{
        NODE_VERSION = "20"
    }
}

$vercelConfig | ConvertTo-Json -Depth 10 | Set-Content "vercel.json" -Encoding UTF8
Write-Host "✅ vercel.json criado" -ForegroundColor Green
Write-Host ""

# Commit
Write-Host "💾 Salvando alterações..." -ForegroundColor Yellow
git add .
git commit -m "Deploy: configuração otimizada $(Get-Date -Format 'yyyy-MM-dd HH:mm')" 2>$null
Write-Host ""

# Deploy
Write-Host "🚀 Iniciando deploy para Vercel..." -ForegroundColor Cyan
Write-Host ""
vercel --prod --yes

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   PRÓXIMOS PASSOS" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Se o deploy falhou por variáveis de ambiente:" -ForegroundColor Yellow
Write-Host "1. Acesse: https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables" -ForegroundColor White
Write-Host "2. Adicione as variáveis necessárias" -ForegroundColor White
Write-Host "3. Re-deploy: vercel --prod" -ForegroundColor White
Write-Host ""

Write-Host "Pressione qualquer tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
