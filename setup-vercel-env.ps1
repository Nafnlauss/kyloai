# Script PowerShell para configurar variáveis de ambiente no Vercel

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   CONFIGURAR VARIÁVEIS VERCEL" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location "F:\site-ia\ai-video-hub"

Write-Host "❌ PROBLEMA IDENTIFICADO:" -ForegroundColor Red
Write-Host "   As variáveis de ambiente no vercel.json referenciam" -ForegroundColor Yellow
Write-Host "   secrets que não existem no projeto Vercel" -ForegroundColor Yellow
Write-Host ""

# Fazer backup
Write-Host "📁 Fazendo backup do vercel.json..." -ForegroundColor Yellow
Copy-Item "vercel.json" "vercel.json.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')" -Force
Write-Host "✅ Backup criado" -ForegroundColor Green
Write-Host ""

# Criar novo vercel.json simplificado
Write-Host "📝 Criando novo vercel.json..." -ForegroundColor Yellow

$newVercelJson = @{
    buildCommand = "npm run build"
    outputDirectory = ".next"
    installCommand = "npm install"
    framework = "nextjs"
}

$newVercelJson | ConvertTo-Json -Depth 10 | Set-Content "vercel.json" -Encoding UTF8

Write-Host "✅ Novo vercel.json criado (simplificado)" -ForegroundColor Green
Write-Host ""

# Mostrar conteúdo
Write-Host "📄 Conteúdo do novo vercel.json:" -ForegroundColor Yellow
Get-Content "vercel.json"
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   PRÓXIMOS PASSOS" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣  Deploy com o novo arquivo:" -ForegroundColor Yellow
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""

Write-Host "2️⃣  Adicione as variáveis de ambiente no Vercel Dashboard:" -ForegroundColor Yellow
Write-Host "   https://vercel.com/nafnlaus-projects/kyloai/settings/environment-variables" -ForegroundColor Cyan
Write-Host ""

Write-Host "   Variáveis necessárias:" -ForegroundColor Yellow
Write-Host "   - DATABASE_URL" -ForegroundColor White
Write-Host "   - NEXTAUTH_URL (use: https://\$VERCEL_URL)" -ForegroundColor White
Write-Host "   - NEXTAUTH_SECRET (gere com: openssl rand -base64 32)" -ForegroundColor White
Write-Host "   - GOOGLE_CLIENT_ID" -ForegroundColor White
Write-Host "   - GOOGLE_CLIENT_SECRET" -ForegroundColor White
Write-Host "   - STRIPE_SECRET_KEY" -ForegroundColor White
Write-Host "   - STRIPE_WEBHOOK_SECRET" -ForegroundColor White
Write-Host "   - NEXT_PUBLIC_APP_URL (use: https://\$VERCEL_URL)" -ForegroundColor White
Write-Host ""

Write-Host "3️⃣  Ou use variáveis locais do .env:" -ForegroundColor Yellow
Write-Host "   vercel env pull .env.production" -ForegroundColor White
Write-Host ""

Write-Host "4️⃣  Deploy alternativo (sem verificação):" -ForegroundColor Yellow
Write-Host "   vercel --prod --skip-domain" -ForegroundColor White
Write-Host ""

# Perguntar se quer tentar deploy
Write-Host "Deseja tentar o deploy agora? (S/N)" -ForegroundColor Cyan
$response = Read-Host
if ($response -eq 'S' -or $response -eq 's') {
    Write-Host ""
    Write-Host "🚀 Executando: vercel --prod" -ForegroundColor Green
    vercel --prod
}

Write-Host ""
Write-Host "Pressione qualquer tecla para continuar..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
