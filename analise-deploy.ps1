# Análise e Deploy Inteligente
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   ANÁLISE DO PROJETO" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "F:\site-ia\ai-video-hub"

# Verificar Node
Write-Host "📊 Ambiente:" -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "   Node: $nodeVersion" -ForegroundColor White

# Verificar se é Node 20+
$nodeVersionNumber = [int]($nodeVersion -replace 'v(\d+)\..*', '$1')
if ($nodeVersionNumber -lt 18) {
    Write-Host "⚠️  Node muito antigo! Vercel precisa Node 18+" -ForegroundColor Red
}

# Verificar package.json
Write-Host ""
Write-Host "📦 Analisando package.json..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json

# Verificar se tem postinstall
if ($packageJson.scripts.postinstall) {
    Write-Host "⚠️  Script postinstall detectado: $($packageJson.scripts.postinstall)" -ForegroundColor Yellow
    Write-Host "   Isso pode causar problemas no Vercel" -ForegroundColor Gray
}

# Verificar versão do Next.js
$nextVersion = $packageJson.dependencies.next
Write-Host "   Next.js: $nextVersion" -ForegroundColor White

# Verificar Prisma
if ($packageJson.dependencies.'@prisma/client') {
    Write-Host "   Prisma detectado - build command deve incluir 'prisma generate'" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Criando configuração otimizada..." -ForegroundColor Yellow

# Criar vercel.json baseado na análise
$vercelConfig = @{
    framework = "nextjs"
    installCommand = "npm install"
}

# Se tem Prisma, ajustar build command
if ($packageJson.scripts.build -like "*prisma generate*") {
    $vercelConfig.buildCommand = "npm run build"
    Write-Host "✅ Build já inclui prisma generate" -ForegroundColor Green
} else {
    $vercelConfig.buildCommand = "npx prisma generate && npm run build"
    Write-Host "➕ Adicionando prisma generate ao build" -ForegroundColor Yellow
}

# Adicionar versão do Node se necessário
if ($nodeVersionNumber -lt 20) {
    $vercelConfig.functions = @{
        "api/*.js" = @{
            runtime = "nodejs20.x"
        }
    }
    Write-Host "➕ Forçando Node 20 no Vercel" -ForegroundColor Yellow
}

$vercelConfig | ConvertTo-Json -Depth 10 | Set-Content "vercel.json" -Encoding UTF8

Write-Host ""
Write-Host "📝 vercel.json criado:" -ForegroundColor Green
Get-Content "vercel.json"
Write-Host ""

# Testar instalação local
Write-Host "🧪 Testando instalação local..." -ForegroundColor Yellow
$installResult = npm install 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro na instalação!" -ForegroundColor Red
    Write-Host $installResult -ForegroundColor Red
    Write-Host ""
    Write-Host "Tentando com --force..." -ForegroundColor Yellow
    npm install --force
}

# Commit e deploy
Write-Host ""
Write-Host "💾 Salvando alterações..." -ForegroundColor Yellow
git add .
git commit -m "Deploy: configuração baseada em análise" 2>$null

Write-Host ""
Write-Host "🚀 Iniciando deploy..." -ForegroundColor Cyan
vercel --prod --yes

Write-Host ""
Write-Host "Para ver logs em tempo real:" -ForegroundColor Yellow
Write-Host "vercel logs --follow" -ForegroundColor White
Write-Host ""

Read-Host "Pressione Enter para sair"
